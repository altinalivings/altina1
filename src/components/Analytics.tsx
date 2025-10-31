// src/components/Analytics.tsx
"use client";

import { useEffect } from "react";

// Accept both key styles used so far
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA4_ID;
const FB_PIXEL = process.env.NEXT_PUBLIC_FB_PIXEL;
const LI_PARTNER = process.env.NEXT_PUBLIC_LI_PARTNER || process.env.NEXT_PUBLIC_LI_PARTNER_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;
const GADS_SEND_TO = process.env.NEXT_PUBLIC_GADS_SEND_TO;
const LEADS_URL = (process.env.NEXT_PUBLIC_LEADS_SHEETS_WEBAPP_URL || "").replace(/^['"]|['"]$/g, "");

// ---------- helpers ----------
function injectScriptOnce(id: string, src: string, attrs: Record<string, string> = {}) {
  if (typeof document === "undefined") return;
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  s.id = id;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

function guardFn<T extends Function>(fn: any): T {
  if (typeof fn !== "function") return fn as T;
  try {
    if ((fn as any).__guarded) return fn as T;
    const proxy = new Proxy(fn, {
      set(target, prop, value) {
        if (prop === "length") return true;
        (target as any)[prop] = value;
        return true;
      },
      defineProperty(target, prop, desc) {
        if (prop === "length") return true;
        Object.defineProperty(target, prop, desc);
        return true;
      },
    });
    (proxy as any).__guarded = true;
    return proxy as T;
  } catch {
    return fn as T;
  }
}

// ---- Signature helpers (unify manual + auto) ----
function digits(x: any) { return String(x || "").replace(/\D+/g, ""); }
function norm(x: any) { return String(x || "").trim().toLowerCase(); }

function bodyToObject(body: any) {
  try {
    if (!body) return {};
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      const obj: Record<string, any> = {};
      (body as FormData).forEach((v, k) => (obj[k] = v as any));
      return obj;
    }
    if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
      const obj: Record<string, any> = {};
      for (const [k, v] of (body as URLSearchParams).entries()) obj[k] = v;
      return obj;
    }
    if (typeof body === "string") {
      try {
        const parsed = JSON.parse(body);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {}
      const usp = new URLSearchParams(body);
      const obj: Record<string, any> = {};
      for (const [k, v] of usp.entries()) obj[k] = v;
      return obj;
    }
    if (typeof body === "object") return body;
  } catch {}
  return {};
}

function signatureFromParams(eventName: string, params: Record<string, any> = {}) {
  // Try to lock on the person + project/mode
  const phone = digits(params.phone || params.mobile || params.contact || "");
  const email = norm(params.email);
  const project = norm(params.projectName || params.project || params.property || "");
  const mode = norm(params.mode || params.intent || "");
  const label = norm(params.event_label || params.label || "");
  // Stable priority: phone > email > project > mode > label > generic
  const sig = phone || email || project || mode || label || "generic";
  return `${eventName}|${sig}`;
}

// --- event dedupe window ---
const sentEvents = new Map<string, number>();
const EVENT_WINDOW_MS = 4000;
function shouldDropEvent(eventName: string, params: Record<string, any>, source: string) {
  const key = signatureFromParams(eventName, params);
  const now = Date.now();
  const last = sentEvents.get(key) || 0;
  if (now - last < EVENT_WINDOW_MS) {
    console.debug(`[Analytics] dedupe ${eventName} from ${source}:`, key);
    return true;
  }
  sentEvents.set(key, now);
  return false;
}

// ---- fetch dedupe to avoid double POSTs (and 429) ----
const inflight = new Map<string, Promise<Response>>();
const SUBMIT_WINDOW_MS = 3000;
const inflightExpiry = new Map<string, number>();

function leadSigFromBody(body: any) {
  const p = bodyToObject(body);
  const phone = digits(p.phone || p.mobile || p.contact || "");
  const email = norm(p.email);
  const project = norm(p.projectName || p.project || p.property || "");
  const mode = norm(p.mode || p.intent || "");
  const who = phone || email || "anon";
  const what = project || mode || "generic";
  return `${who}|${what}`;
}

function trackGenerateLead(params: Record<string, any> = {}, source = "manual") {
  if (shouldDropEvent("generate_lead", params, source)) return;
  const w: any = window;
  if (typeof w.gtag === "function") {
    w.gtag("event", "generate_lead", params);
  }
  if (typeof w.gtag === "function" && GADS_SEND_TO) {
    w.gtag("event", "conversion", { send_to: GADS_SEND_TO, ...params });
  }
  if (typeof w.fbq === "function") {
    w.fbq("track", "Lead", {
      content_name: params.event_label || params.label || params.project || params.projectName || "lead",
      value: params.value || 1,
      currency: params.currency || undefined,
    });
  }
}

function trackContact(params: Record<string, any> = {}, source = "manual") {
  if (shouldDropEvent("contact", params, source)) return;
  const w: any = window;
  if (typeof w.gtag === "function") {
    w.gtag("event", "contact", params);
  }
  if (typeof w.fbq === "function") {
    w.fbq("trackCustom", "Contact", params);
  }
}

// ---------- main component ----------
export default function Analytics() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w: any = window;

    // --- GA4 ---
    if (GA_ID) {
      injectScriptOnce("ga4-script", `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
      w.dataLayer = w.dataLayer || [];
      w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
      w.gtag = guardFn(w.gtag);
      w.gtag("js", new Date());
      w.gtag("config", GA_ID);
      console.debug("[Analytics] GA4 ready:", GA_ID);
    }

    // --- Google Ads ---
    if (GADS_ID) {
      injectScriptOnce("gads-script", `https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`);
      w.dataLayer = w.dataLayer || [];
      w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
      w.gtag = guardFn(w.gtag);
      w.gtag("config", GADS_ID);
      console.debug("[Analytics] Google Ads ready:", GADS_ID, "send_to:", GADS_SEND_TO || "(none)");
    }

    // --- Facebook Pixel (wrap local fbq before assigning) ---
    if (FB_PIXEL && !w.fbq) {
      (function (f: any, b: any, e: any, v: any) {
        if (f.fbq) return;
        let n: any;
        const raw = function() { (n.callMethod ? n.callMethod : n.queue.push).apply(n, arguments); };
        n = f.fbq = guardFn(raw);
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        const t = b.createElement(e); t.async = true;
        t.src = v || "https://connect.facebook.net/en_US/fbevents.js";
        const s = b.getElementsByTagName(e)[0];
        s.parentNode!.insertBefore(t, s);
      })(w, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    }
    if (FB_PIXEL) {
      w.fbq = guardFn(w.fbq);
      w._fbq = w.fbq;
      w.fbq("init", FB_PIXEL);
      w.fbq("track", "PageView");
      console.debug("[Analytics] FB Pixel ready:", FB_PIXEL);
    }

    // --- LinkedIn Insight Tag ---
    if (LI_PARTNER && !w.lintrk) {
      w._linkedin_data_partner_ids = w._linkedin_data_partner_ids || [];
      if (!w._linkedin_data_partner_ids.includes(LI_PARTNER)) {
        w._linkedin_data_partner_ids.push(LI_PARTNER);
      }
      injectScriptOnce("li-insight", "https://snap.licdn.com/li.lms-analytics/insight.min.js");
      console.debug("[Analytics] Linkedin Insight partner:", LI_PARTNER);
    }

    // Expose helpers globally for direct calls if desired
    w.altinaTrack = {
      lead: (p: any) => trackGenerateLead(p || {}, "manual"),
      contact: (p: any) => trackContact(p || {}, "manual"),
    };

    // ---- AUTO-TRACK + FETCH DEDUPE for the Apps Script URL ----
    if (LEADS_URL && typeof w.fetch === "function") {
      const originalFetch = w.fetch.bind(w);
      w.fetch = (...args: any[]) => {
        const req = args[0];
        const url = (typeof req === "string" ? req : req?.url) || "";
        const init = (args.length > 1 ? args[1] : undefined) as any;
        const shouldWatch =
          (LEADS_URL && url.includes(LEADS_URL)) ||
          url.includes("script.google.com/macros/s/");
        if (!shouldWatch) return originalFetch(...args);

        // --- dedupe duplicate submissions within SUBMIT_WINDOW_MS ---
        const sig = leadSigFromBody(init?.body);
        const now = Date.now();
        const expiry = inflightExpiry.get(sig) || 0;
        const stillValid = now < expiry && inflight.has(sig);
        if (stillValid) {
          console.debug("[Analytics] dedupe fetch (sharing prior promise):", sig);
          return inflight.get(sig)!;
        }

        const p = (async () => {
          const res = await originalFetch(...args);
          try {
            // allow explicit opt-out from components
            const noAuto = bodyToObject(init?.body).__no_autotrack === '1' || bodyToObject(init?.body).__no_autotrack === 1;
            if (noAuto) return res;
            // Clone might fail (opaque), so just attempt
            const eventParams = {
              event_category: "engagement",
              event_label: (bodyToObject(init?.body).projectName ||
                            bodyToObject(init?.body).project ||
                            bodyToObject(init?.body).mode ||
                            "lead"),
              value: 1,
              ...bodyToObject(init?.body),
            };
            trackGenerateLead(eventParams, "auto");
            // If contact-ish mode, also send contact (dedupe will drop if identical)
            if (["contact", "enquiry", "callback"].includes(String(eventParams.mode || "").toLowerCase())) {
              trackContact(eventParams, "auto");
            }
            console.debug("[Analytics] Auto lead tracked via fetch:", eventParams);
          } catch (e) {
            console.warn("[Analytics] Lead autotrack error:", e);
          }
          return res;
        })();

        inflight.set(sig, p);
        inflightExpiry.set(sig, now + SUBMIT_WINDOW_MS);
        // Clear after promise settles + small delay
        p.finally(() => setTimeout(() => { inflight.delete(sig); }, 1000));
        return p;
      };
      console.debug("[Analytics] fetch interceptor armed + dedupe for:", LEADS_URL);
    }
  }, []);

  return null;
}
