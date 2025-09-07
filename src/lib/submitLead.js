// src/lib/submitLead.js

// === CONFIG: your Google Apps Script Web App endpoint ===
// (Deployed as web app, accessible to Anyone, CORS allowed)
const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyaT79B9lI8SQRKMT92dxvJGBIHvuV1SOhjCszEocDUqqkwdnOYmI9pG5bhfBfXdf8H2g/exec";

// --- small utils ---
const nowISO = () => new Date().toISOString();
const uid = () =>
  (crypto?.randomUUID?.() ||
    Math.random().toString(36).slice(2) + Date.now().toString(36));

function getDeviceType(ua = "") {
  const s = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(s)) return "tablet";
  if (/mobi|iphone|android|blackberry|phone/.test(s)) return "mobile";
  return "desktop";
}

function readURLParams() {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const pick = (k) => (sp.get(k) || "").trim();
  return {
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_term: pick("utm_term"),
    utm_content: pick("utm_content"),
    gclid: pick("gclid"),
    fbclid: pick("fbclid"),
    msclkid: pick("msclkid"),
  };
}

// First-touch persistence (localStorage)
const FT_KEYS = [
  "first_touch_source",
  "first_touch_medium",
  "first_touch_campaign",
  "first_touch_term",
  "first_touch_content",
  "first_touch_gclid",
  "first_touch_fbclid",
  "first_touch_msclkid",
  "first_landing_page",
  "first_landing_ts",
  "first_touch_page",
  "first_touch_ts",
];

function getStorageSafe(key) {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function setStorageSafe(key, val) {
  try {
    localStorage.setItem(key, val);
  } catch {}
}

function ensureFirstTouch(urlParams) {
  if (typeof window === "undefined") return;
  const already = getStorageSafe("first_landing_ts");
  if (already) return; // we already have first-touch

  // write all first-touch fields
  const page = window.location.href;
  const ts = nowISO();

  setStorageSafe("first_landing_page", page);
  setStorageSafe("first_landing_ts", ts);
  setStorageSafe("first_touch_page", page);
  setStorageSafe("first_touch_ts", ts);
  setStorageSafe("first_touch_source", urlParams.utm_source || "");
  setStorageSafe("first_touch_medium", urlParams.utm_medium || "");
  setStorageSafe("first_touch_campaign", urlParams.utm_campaign || "");
  setStorageSafe("first_touch_term", urlParams.utm_term || "");
  setStorageSafe("first_touch_content", urlParams.utm_content || "");
  setStorageSafe("first_touch_gclid", urlParams.gclid || "");
  setStorageSafe("first_touch_fbclid", urlParams.fbclid || "");
  setStorageSafe("first_touch_msclkid", urlParams.msclkid || "");
}

function getFirstTouch() {
  const out = {};
  FT_KEYS.forEach((k) => (out[k] = getStorageSafe(k)));
  return out;
}

function getSessionId() {
  let id = getStorageSafe("session_id");
  if (!id) {
    id = uid();
    setStorageSafe("session_id", id);
  }
  return id;
}

/**
 * submitLead(data)
 * data: { name, phone, email?, message?, source?, project?, mode?, need?, msg? ... }
 * Posts to Google Apps Script Web App as FormData.
 */
export async function submitLead(data = {}) {
  // SSR guard
  if (typeof window === "undefined") {
    // best-effort noop on server
    return { ok: true, status: "server-noop" };
  }

  // URL params & first-touch
  const urlParams = readURLParams();
  ensureFirstTouch(urlParams);
  const ft = getFirstTouch();

  // last-touch
  const last_touch_ts = nowISO();
  const last_touch_page = window.location.href;

  // environment
  const page = window.location.href;
  const referrer = document.referrer || "";
  const language = navigator.language || "";
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const viewport = `${window.innerWidth}x${window.innerHeight}`;
  const screen = `${window.screen?.width || ""}x${window.screen?.height || ""}`;
  const userAgent = navigator.userAgent || "";
  const device_type = getDeviceType(userAgent);
  const session_id = getSessionId();

  // optional GA client id (leave blank unless you collect it)
  const ga_cid = "";

  // flatten payload
  const payload = {
    // form
    name: data.name || "",
    phone: data.phone || "",
    email: data.email || "",
    message: data.message || "",
    need: data.need || "",
    msg: data.msg || "",
    source: data.source || "website",
    project: data.project || "",
    mode: data.mode || "",

    // page/time
    page,
    time: nowISO(),

    // URL params (last-touch)
    utm_source: urlParams.utm_source,
    utm_medium: urlParams.utm_medium,
    utm_campaign: urlParams.utm_campaign,
    utm_term: urlParams.utm_term,
    utm_content: urlParams.utm_content,
    gclid: urlParams.gclid,
    fbclid: urlParams.fbclid,
    msclkid: urlParams.msclkid,

    // last-touch
    last_touch_ts,
    last_touch_page,

    // first-touch bundle
    ...ft,

    // misc env
    session_id,
    ga_cid,
    referrer,
    language,
    timezone,
    viewport,
    screen,
    device_type,
    userAgent,

    // debugging/raw
    __raw_payload: JSON.stringify(data || {}),
  };

  // Build FormData (Apps Script loves it)
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => form.append(k, v ?? ""));

  try {
    // Apps Script often returns opaque on no-cors; we treat it as best-effort success.
    const res = await fetch(ENDPOINT, {
      method: "POST",
      body: form,
      // mode: "no-cors", // uncomment if your script doesn’t send CORS headers
    });

    // If CORS configured, we can check res.ok
    if (res && "ok" in res) {
      if (!res.ok) return { ok: false, status: "error" };
      // try to parse JSON if allowed
      try {
        const json = await res.json();
        return { ok: true, status: json?.status || "success" };
      } catch {
        return { ok: true, status: "success" };
      }
    }

    // Opaque success fallback
    return { ok: true, status: "success" };
  } catch (err) {
    console.error("submitLead error:", err);
    return { ok: false, status: "error" };
  }
}
