// submitLead.js — hidden-form + iframe + postMessage listener + toast + robust fallback
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyaT79B9lI8SQRKMT92dxvJGBIHvuV1SOhjCszEocDUqqkwdnOYmI9pG5bhfBfXdf8H2g/exec";


/* -------------------- Utilities -------------------- */

function getParam(name) {
  try {
    return new URLSearchParams(window.location.search).get(name) || '';
  } catch (e) {
    return '';
  }
}

function getCookie(name) {
  try {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : '';
  } catch (e) {
    return '';
  }
}

// Try to extract GA client id from _ga cookie (Universal Analytics format: GA1.2.XXXXXXXXX.YYYYYYYYY)
function getGaCidFromCookie() {
  try {
    const val = getCookie('_ga') || '';
    if (!val) return '';
    const parts = val.split('.');
    if (parts.length >= 4) {
      // join last two parts
      return parts.slice(-2).join('.');
    }
    return '';
  } catch (e) {
    return '';
  }
}

function generateRandomId(prefix='s') {
  return prefix + '_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* -------------------- Device & Client Fields -------------------- */

function detectDeviceType() {
  const ua = navigator.userAgent || '';
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(ua);
  if (isMobile) {
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
    return 'mobile';
  }
  return 'desktop';
}

function gatherClientFields() {
  const viewport = `${window.innerWidth || 0}x${window.innerHeight || 0}`;
  const screenSize = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
  return {
    referrer: document.referrer || '',
    language: navigator.language || navigator.userLanguage || '',
    timezone: (Intl && Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '',
    viewport: viewport,
    screen: screenSize,
    device_type: detectDeviceType(),
    userAgent: navigator.userAgent || ''
  };
}

function toFormValue(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') {
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }
  return String(v);
}

/* -------------------- Toast -------------------- */

function showToast({ text = '', durationMs = 3000, type = 'success' } = {}) {
  try {
    let container = document.getElementById('lead-toasts-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'lead-toasts-container';
      container.style.position = 'fixed';
      container.style.right = '20px';
      container.style.bottom = '20px';
      container.style.zIndex = '2147483647';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '8px';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'lead-toast';
    toast.style.minWidth = '220px';
    toast.style.maxWidth = '420px';
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
    toast.style.fontFamily = 'Inter, Arial, sans-serif';
    toast.style.fontSize = '13px';
    toast.style.color = '#fff';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'opacity 220ms ease, transform 220ms ease';

    if (type === 'success') {
      toast.style.background = 'linear-gradient(90deg,#16a34a,#10b981)';
    } else {
      toast.style.background = 'linear-gradient(90deg,#ef4444,#f97316)';
    }

    toast.textContent = text;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        try { container.removeChild(toast); } catch (e) {}
      }, 250);
    }, durationMs);
  } catch (e) {
    // ignore toast errors
    console.warn('showToast error', e);
  }
}

/* -------------------- Form Submit + robust postMessage/fallback -------------------- */

/**
 * postViaFormWithMessage(url, data, opts)
 * - Tries hidden form -> iframe + postMessage first (no CORS)
 * - If no response within timeout, falls back to fetch form-encoded POST
 * - Returns a normalized object:
 *    { via: 'iframe', ok: boolean, body: <message-object-from-iframe> }
 *    or
 *    { via: 'fetch', ok: boolean, status: <http-status>, body: <parsed-json-or-text> }
 */
function postViaFormWithMessage(url, data = {}, opts = {}) {
  const timeoutMs = (opts && opts.timeoutMs) || 9000;

  // fallback helper: fetch with form-encoded body
  async function fetchFallback() {
    try {
      console.info('[lead] fetch fallback to', url);
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      const text = await resp.text();
      console.info('[lead] fetch fallback response:', resp.status, text);
      try {
        const json = JSON.parse(text);
        return { via: 'fetch', ok: resp.ok, status: resp.status, body: json };
      } catch (e) {
        return { via: 'fetch', ok: resp.ok, status: resp.status, body: text };
      }
    } catch (err) {
      console.error('[lead] fetch fallback error', err);
      return { via: 'fetch', ok: false, error: String(err) };
    }
  }

  return new Promise((resolve, reject) => {
    try {
      const iframeName = 'lead_submit_iframe_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      form.style.display = 'none';

      Object.keys(data).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = (data[key] === null || data[key] === undefined) ? '' : String(data[key]);
        form.appendChild(input);
      });

      const iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';

      document.body.appendChild(iframe);
      form.target = iframeName;
      document.body.appendChild(form);

      let settled = false;

      function cleanup() {
        try { window.removeEventListener('message', onMessage); } catch (e) {}
        try { if (form.parentNode) form.parentNode.removeChild(form); } catch (e) {}
        try { if (iframe.parentNode) iframe.parentNode.removeChild(iframe); } catch (e) {}
        try { clearTimeout(fallbackTimer); } catch (e) {}
      }

      function onMessage(event) {
        try {
          const msg = event.data;
          // Accept either our marker or any object with 'status' or 'ok'
          if (!msg || typeof msg !== 'object') return;
          if (!(msg.source === 'lead_webapp' || msg.status || msg.ok)) return;
          cleanup();
          settled = true;
          console.info('[lead] Received postMessage:', msg);
          resolve({ via: 'iframe', ok: (msg.status === 'success' || msg.ok === true), body: msg });
        } catch (e) {
          // ignore
        }
      }

      window.addEventListener('message', onMessage, false);

      const fallbackTimer = setTimeout(async () => {
        if (settled) return;
        console.warn('[lead] No postMessage from iframe within timeout. Trying fetch fallback.');
        try {
          const fetchRes = await fetchFallback();
          cleanup();
          settled = true;
          resolve(fetchRes);
        } catch (err) {
          cleanup();
          settled = true;
          reject(err);
        }
      }, timeoutMs);

      try {
        form.submit();
      } catch (e) {
        console.error('[lead] form.submit error', e);
        clearTimeout(fallbackTimer);
        cleanup();
        // immediate fetch fallback
        fetchFallback().then(res => resolve(res)).catch(err => reject(err));
      }
    } catch (err) {
      reject(err);
    }
  });
}

/* -------------------- First-touch persistence (optional) -------------------- */

function readFirstTouchFromStorage() {
  try {
    const raw = localStorage.getItem('lead_first_touch_v1');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveFirstTouchToStorage(obj) {
  try {
    localStorage.setItem('lead_first_touch_v1', JSON.stringify(obj));
  } catch (e) {
    // ignore
  }
}

/* -------------------- Public submitLead -------------------- */

/**
 * submitLead(formData)
 * formData: { name, phone, email, message, source, ... }
 */
export async function submitLead(formData = {}) {
  try {
    // UTM params and click IDs from URL
    const utm_source = getParam('utm_source') || '';
    const utm_medium = getParam('utm_medium') || '';
    const utm_campaign = getParam('utm_campaign') || '';
    const utm_term = getParam('utm_term') || '';
    const utm_content = getParam('utm_content') || '';

    const gclid = getParam('gclid') || '';
    const fbclid = getParam('fbclid') || '';
    const msclkid = getParam('msclkid') || '';

    const client = gatherClientFields();

    // session id from sessionStorage or generate
    let session_id = sessionStorage.getItem('lead_session_id');
    if (!session_id) {
      session_id = generateRandomId('sess');
      try { sessionStorage.setItem('lead_session_id', session_id); } catch (e) {}
    }

    // ga cid from _ga cookie (best-effort)
    const ga_cid = getGaCidFromCookie() || '';

    // first touch: try read from localStorage, otherwise populate from current params & save
    let firstTouch = readFirstTouchFromStorage();
    if (!firstTouch) {
      firstTouch = {
        first_touch_ts: new Date().toISOString(),
        first_touch_page: window.location.href || '',
        first_touch_source: utm_source || (document.referrer ? new URL(document.referrer).hostname : '') || '',
        first_touch_medium: utm_medium || '',
        first_touch_campaign: utm_campaign || '',
        first_touch_term: utm_term || '',
        first_touch_content: utm_content || '',
        first_touch_gclid: gclid || '',
        first_touch_fbclid: fbclid || '',
        first_touch_msclkid: msclkid || ''
      };
      saveFirstTouchToStorage(firstTouch);
    }

    const payload = {
      name: formData.name || formData.fullname || '',
      phone: formData.phone || formData.mobile || '',
      email: formData.email || '',
      message: formData.message || formData.comments || '',
      source: formData.source || 'website',
      // page-level fields
      page: window.location.pathname || '',
      last_touch_ts: new Date().toISOString(),
      last_touch_page: window.location.href || '',
      // UTM & click ids
      utm_source: formData.utm_source || utm_source || '',
      utm_medium: formData.utm_medium || utm_medium || '',
      utm_campaign: formData.utm_campaign || utm_campaign || '',
      utm_term: formData.utm_term || utm_term || '',
      utm_content: formData.utm_content || utm_content || '',
      gclid,
      fbclid,
      msclkid,
      // session & GA
      session_id,
      ga_cid,
      // first touch bundle (if you want separate columns, they will be present)
      first_touch_ts: firstTouch.first_touch_ts || '',
      first_touch_page: firstTouch.first_touch_page || '',
      first_touch_source: firstTouch.first_touch_source || '',
      first_touch_medium: firstTouch.first_touch_medium || '',
      first_touch_campaign: firstTouch.first_touch_campaign || '',
      first_touch_term: firstTouch.first_touch_term || '',
      first_touch_content: firstTouch.first_touch_content || '',
      first_touch_gclid: firstTouch.first_touch_gclid || '',
      first_touch_fbclid: firstTouch.first_touch_fbclid || '',
      first_touch_msclkid: firstTouch.first_touch_msclkid || '',
      first_landing_page: firstTouch.first_touch_page || '',
      first_landing_ts: firstTouch.first_touch_ts || '',
      // client fields
      referrer: client.referrer,
      language: client.language,
      timezone: client.timezone,
      viewport: client.viewport,
      screen: client.screen,
      device_type: client.device_type,
      userAgent: client.userAgent,
      // other tracking fields you had
      project: formData.project || '',
      mode: formData.mode || '',
      ts: new Date().toISOString()
    };

    // include any other custom fields provided
    Object.keys(formData).forEach(k => {
      if (!payload.hasOwnProperty(k)) payload[k] = formData[k];
    });

    // Submit via hidden form + iframe and wait for postMessage
    const result = await postViaFormWithMessage(WEBHOOK_URL, payload, { timeoutMs: 9000 });

    // Normalize result checking and show toast
    let ok = false;
    let message = 'Submission failed';

    if (!result) {
      ok = false;
      message = 'No response';
    } else if (result.via === 'iframe') {
      ok = !!result.ok;
      message = (result.body && (result.body.message || result.body.msg)) || (ok ? 'Thanks — we received your request.' : 'Submission failed');
      console.info('[lead] result via iframe:', result);
    } else if (result.via === 'fetch') {
      // fetch result: check ok or JSON body.status
      ok = !!result.ok || (result.body && (result.body.status === 'success' || result.body.ok === true));
      message = (result.body && (result.body.message || result.body.msg)) || (ok ? 'Thanks — we received your request.' : 'Submission failed');
      console.info('[lead] result via fetch:', result);
    } else {
      // older style where postViaFormWithMessage returned the raw message
      if (result && typeof result === 'object' && (result.status || result.ok !== undefined)) {
        ok = (result.status === 'success') || (result.ok === true);
        message = result.message || (ok ? 'Thanks — we received your request.' : 'Submission failed');
      } else {
        // fallback
        ok = false;
        message = 'Submission failed';
      }
    }

    if (ok) {
      showToast({ text: message, type: 'success' });
    } else {
      showToast({ text: message, type: 'error' });
    }

    return result;
  } catch (err) {
    console.error('[lead] submitLead error', err);
    showToast({ text: 'Submission failed — try again', type: 'error' });
    return { source: 'lead_webapp', status: 'error', message: String(err) };
  }
}
export { showToast };