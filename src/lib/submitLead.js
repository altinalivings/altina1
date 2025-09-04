// submitLead.js
// Use this implementation if you are posting directly from browser to Google Apps Script webapp.
// It posts via a temporary form (no CORS preflight), attaches client/browser metadata and UTM params,
// and returns a lightweight success indicator.

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec"; // <-- REPLACE with your Apps Script web app URL

function getUtmParamsFromLocation() {
  try {
    const url = new URL(window.location.href);
    const out = {};
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k => {
      if (url.searchParams.has(k)) out[k] = url.searchParams.get(k);
    });
    return out;
  } catch (e) {
    return {};
  }
}

function detectDeviceType() {
  const ua = navigator.userAgent || '';
  const isMobile = /Mobi|Android|iPhone|iPod|IEMobile|Opera Mini/i.test(ua);
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
    viewport,
    screen: screenSize,
    device_type: detectDeviceType(),
    userAgent: navigator.userAgent || ''
  };
}

/**
 * Convert a value to a form-friendly string. Objects/arrays -> JSON string.
 */
function toFormValue(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') {
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }
  return String(v);
}

/**
 * Post data using a temporary hidden form (avoids CORS preflight).
 * Returns a simple object indicating the DOM-level submit was performed.
 */
function postViaForm(url, data = {}) {
  try {
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

    // Attach and submit
    document.body.appendChild(form);

    // Option A: Submit to the same window (will navigate away). 
    // Option B: Submit to an invisible iframe to stay on SPA. We'll use iframe approach by default.
    // Create a hidden iframe target, submit to it, then clean up.
    const iframeName = 'lead_submit_iframe_' + Date.now();
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    form.target = iframeName;
    form.submit();

    // Cleanup after short delay
    setTimeout(() => {
      try { document.body.removeChild(form); } catch (e) {}
      try { document.body.removeChild(iframe); } catch (e) {}
    }, 1500);

    return { result: 'submitted' };
  } catch (err) {
    console.error('postViaForm error:', err);
    return { result: 'error', details: err.message || String(err) };
  }
}

/**
 * submitLead: public function used by the site code.
 * formData: object that contains fields like name, phone, email, message, source, utm fields (optional)
 *
 * This function will merge in utm params and client info and POST to Apps Script via form.
 */
export async function submitLead(formData = {}) {
  try {
    const utm = getUtmParamsFromLocation();
    const client = gatherClientFields();

    // Merge: prefer explicit values in formData, fallback to UTM / client
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
      // Keep a timestamp column (your Apps Script should map 'time' or 'ts' -> time)
      time: new Date().toISOString(),
      // include any additional fields the caller passed
      extra: formData.extra || ''
    };

    // If the formData contains additional custom fields, append them (stringify objects)
    Object.keys(formData).forEach(k => {
      if (!payload.hasOwnProperty(k)) payload[k] = formData[k];
    });

    // Submit using form POST to avoid CORS; use hidden iframe so SPA doesn't navigate away
    const result = postViaForm(WEBHOOK_URL, payload);

    // Tracking / analytics (best effort)
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_lead', { event_category: 'Leads', event_label: payload.source });
        window.gtag('event', 'conversion', { send_to: 'AW-XXXX/XXXX' });
      }
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', { content_name: payload.source });
      }
      if (typeof window !== 'undefined' && window.lintrk) {
        window.lintrk('track', { conversion_id: 515682278 });
      }
    } catch (e) {
      // swallow
      console.warn('analytics error', e);
    }

    return { ok: true, status: result.result || 'submitted' };
  } catch (err) {
    console.error('submitLead error:', err);
    return { ok: false, error: String(err) };
  }
}
