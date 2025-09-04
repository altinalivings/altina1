// submitLead.js — hidden-form + iframe + postMessage listener + toast
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec"; // <-- REPLACE

function getUtmParams() {
  try {
    const u = new URL(window.location.href);
    const out = {};
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k => {
      if (u.searchParams.has(k)) out[k] = u.searchParams.get(k);
    });
    return out;
  } catch (e) {
    return {};
  }
}

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

/**
 * Show a simple toast message (bottom-right)
 * options: { text, durationMs (default 3000), type: 'success'|'error' }
 */
function showToast({ text = '', durationMs = 3000, type = 'success' } = {}) {
  try {
    // create container if missing
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
    toast.style.maxWidth = '380px';
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
      toast.style.background = 'linear-gradient(90deg,#16a34a,#10b981)'; // green-ish
    } else {
      toast.style.background = 'linear-gradient(90deg,#ef4444,#f97316)'; // red-orange
    }

    toast.textContent = text;
    container.appendChild(toast);

    // animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // auto remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        try { container.removeChild(toast); } catch (e) {}
      }, 250);
    }, durationMs);
  } catch (e) {
    console.warn('showToast error', e);
  }
}

/**
 * Post using a hidden form + hidden iframe. Listen for postMessage from iframe.
 * Returns a Promise that resolves to the message payload from Apps Script (object).
 *
 * Timeout fallback in case postMessage is not received.
 */
function postViaFormWithMessage(url, data = {}, opts = {}) {
  const timeoutMs = opts.timeoutMs || 8000;
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
        input.value = toFormValue(data[key]);
        form.appendChild(input);
      });

      const iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';

      // Append to DOM
      document.body.appendChild(iframe);
      form.target = iframeName;
      document.body.appendChild(form);

      // Message listener
      let settled = false;
      function onMessage(event) {
        try {
          const msg = event.data;
          if (!msg || typeof msg !== 'object') return;
          if (msg.source !== 'lead_webapp') return; // only accept messages from our webapp marker
          // clean up
          cleanup();
          settled = true;
          resolve(msg);
        } catch (e) {
          // ignore parse errors
        }
      }

      function cleanup() {
        try { window.removeEventListener('message', onMessage); } catch (e) {}
        try { document.body.removeChild(form); } catch (e) {}
        try { document.body.removeChild(iframe); } catch (e) {}
        try { clearTimeout(fallbackTimer); } catch (e) {}
      }

      window.addEventListener('message', onMessage, false);

      // Fallback timeout
      const fallbackTimer = setTimeout(() => {
        if (settled) return;
        cleanup();
        reject(new Error('No response from lead endpoint (timeout)'));
      }, timeoutMs);

      // Submit
      try {
        form.submit();
      } catch (e) {
        cleanup();
        reject(e);
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Public function to call from your form handler:
 * submitLead({ name, phone, email, message, source })
 * Returns a Promise resolving to the webapp response object.
 */
export async function submitLead(formData = {}) {
  try {
    const utm = getUtmParams();
    const client = gatherClientFields();

    const payload = {
      name: formData.name || formData.fullname || '',
      phone: formData.phone || formData.mobile || '',
      email: formData.email || '',
      message: formData.message || formData.comments || '',
      source: formData.source || 'website',
      utm_source: formData.utm_source || utm.utm_source || '',
      utm_medium: formData.utm_medium || utm.utm_medium || '',
      utm_campaign: formData.utm_campaign || utm.utm_campaign || '',
      utm_term: formData.utm_term || utm.utm_term || '',
      utm_content: formData.utm_content || utm.utm_content || '',
      referrer: client.referrer,
      language: client.language,
      timezone: client.timezone,
      viewport: client.viewport,
      screen: client.screen,
      device_type: client.device_type,
      userAgent: client.userAgent,
      time: new Date().toISOString()
    };

    // include any extra fields present in formData
    Object.keys(formData).forEach(k => {
      if (!payload.hasOwnProperty(k)) payload[k] = formData[k];
    });

    const result = await postViaFormWithMessage(WEBHOOK_URL, payload, { timeoutMs: 9000 });

    // result expected: { source: 'lead_webapp', status: 'success'|'error', message: '...' }
    if (result && result.status === 'success') {
      showToast({ text: result.message || 'Thanks — we received your request.', type: 'success' });
    } else {
      showToast({ text: (result && result.message) ? result.message : 'Submission failed', type: 'error' });
    }

    return result;
  } catch (err) {
    showToast({ text: 'Submission failed — try again', type: 'error' });
    return { source: 'lead_webapp', status: 'error', message: String(err) };
  }
}
