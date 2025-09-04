// src/lib/attribution.js
function uuid() {
  try {
    return crypto?.randomUUID?.() ?? ([1e7]+-1e3+-4e3+-8e3+-1e11)
      .replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function parseGaCookieToCid() {
  const c = getCookie("_ga");
  if (!c) return "";
  const parts = c.split(".");
  if (parts.length >= 4) return `${parts[2]}.${parts[3]}`;
  return "";
}

export function getAttribution(now = new Date()) {
  if (typeof window === "undefined") return {};

  const url = new URL(window.location.href);
  const qp = url.searchParams;

  const utm = {
    utm_source:   qp.get("utm_source"),
    utm_medium:   qp.get("utm_medium"),
    utm_campaign: qp.get("utm_campaign"),
    utm_term:     qp.get("utm_term"),
    utm_content:  qp.get("utm_content"),
    gclid:        qp.get("gclid"),
    fbclid:       qp.get("fbclid"),
    msclkid:      qp.get("msclkid"),
  };

  // Persist session + first/last touch
  const LS_KEY = "altina_attribution_v1";
  let store = {};
  try { store = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch {}
  if (!store.session_id) store.session_id = uuid();
  if (!store.first_landing_ts) store.first_landing_ts = now.toISOString();
  if (!store.first_landing_page) store.first_landing_page = window.location.href;
  if (!store.first_touch && (utm.utm_source || utm.gclid || utm.fbclid || utm.msclkid)) {
    store.first_touch = {
      utm_source: utm.utm_source, utm_medium: utm.utm_medium, utm_campaign: utm.utm_campaign,
      utm_term: utm.utm_term, utm_content: utm.utm_content,
      gclid: utm.gclid, fbclid: utm.fbclid, msclkid: utm.msclkid,
    };
  }
  if (utm.utm_source || utm.gclid || utm.fbclid || utm.msclkid) {
    store.last_touch = {
      utm_source: utm.utm_source, utm_medium: utm.utm_medium, utm_campaign: utm.utm_campaign,
      utm_term: utm.utm_term, utm_content: utm.utm_content,
      gclid: utm.gclid, fbclid: utm.fbclid, msclkid: utm.msclkid,
      ts: now.toISOString(), page: window.location.href,
    };
  }
  localStorage.setItem(LS_KEY, JSON.stringify(store));

  // Client meta
  const referrer = document.referrer || "";
  const language = navigator.language || "";
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const viewport = `${window.innerWidth}x${window.innerHeight}`;
  const screenRes = window.screen ? `${screen.width}x${screen.height}` : "";
  const ua = navigator.userAgent || "";
  const device_type = /Mobi|Android/i.test(ua) ? "mobile" : /iPad|Tablet/i.test(ua) ? "tablet" : "desktop";

  // GA client id from localStorage (set by AnalyticsClient), or cookie fallback
  const ga_cid = localStorage.getItem("altina_ga_cid") || parseGaCookieToCid() || "";

  return {
    // first-touch
    first_touch_source:  store.first_touch?.utm_source || "",
    first_touch_medium:  store.first_touch?.utm_medium || "",
    first_touch_campaign:store.first_touch?.utm_campaign || "",
    first_touch_term:    store.first_touch?.utm_term || "",
    first_touch_content: store.first_touch?.utm_content || "",
    first_touch_gclid:   store.first_touch?.gclid || "",
    first_touch_fbclid:  store.first_touch?.fbclid || "",
    first_touch_msclkid: store.first_touch?.msclkid || "",
    first_landing_page:  store.first_landing_page || "",
    first_landing_ts:    store.first_landing_ts || "",

    // last-touch
    utm_source:   utm.utm_source || store.last_touch?.utm_source || "",
    utm_medium:   utm.utm_medium || store.last_touch?.utm_medium || "",
    utm_campaign: utm.utm_campaign || store.last_touch?.utm_campaign || "",
    utm_term:     utm.utm_term || store.last_touch?.utm_term || "",
    utm_content:  utm.utm_content || store.last_touch?.utm_content || "",
    gclid:        utm.gclid || store.last_touch?.gclid || "",
    fbclid:       utm.fbclid || store.last_touch?.fbclid || "",
    msclkid:      utm.msclkid || store.last_touch?.msclkid || "",
    last_touch_ts:store.last_touch?.ts || "",
    last_touch_page: store.last_touch?.page || "",

    // session + client info
    session_id: store.session_id,
    ga_cid,
    referrer,
    language,
    timezone,
    viewport,
    screen: screenRes,
    device_type,
    userAgent: ua,
    page: window.location.href,
  };
}
