\
// src/components/Analytics.tsx
"use client";

import { useEffect } from "react";

// Accept both key styles used so far
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA4_ID;
const FB_PIXEL = process.env.NEXT_PUBLIC_FB_PIXEL;
const LI_PARTNER = process.env.NEXT_PUBLIC_LI_PARTNER || process.env.NEXT_PUBLIC_LI_PARTNER_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;
const GADS_SEND_TO = process.env.NEXT_PUBLIC_GADS_SEND_TO;
const LEADS_URL = (process.env.LEADS_SHEETS_WEBAPP_URL || "").replace(/^["']|["']$/g, "");

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

function extractLeadFieldsFromBody(body: any) {
  try {
    if (!body) return {};
    // Body could be: FormData, URLSearchParams, stringified JSON
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      const obj: any = {};
      body.forEach((v, k) => (obj[k] = v));
      return obj;
    }
    if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
      const obj: any = {};
      for (const [k, v] of (body as URLSearchParams).entries()) obj[k] = v;
      return obj;
    }
    if (typeof body === "string") {
      try {
        const parsed = JSON.parse(body);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {}
      // handle querystring
      const usp = new URLSearchParams(body);
      const obj: any = {};
      for (const [k, v] of usp.entries()) obj[k] = v;
      return obj;
    }
    if (typeof body === "object") return body;
  } catch {}
  return {};
}

function trackGenerateLead(params: Record<string, any> = {}) {
  const w: any = window;
  // GA4
  if (typeof w.gtag === "function") {
    w.gtag("event", "generate_lead", params);
  }
  // Google Ads conversion
  if (typeof w.gtag === "function" && GADS_SEND_TO) {
    w.gtag("event", "conversion", { send_to: GADS_SEND_TO, ...params });
  }
  // Facebook Pixel
  if (typeof w.fbq === "function") {
    w.fbq("track", "Lead", {
      content_name: params.event_label || params.label || params.project || "lead",
      value: params.value || 1,
      currency: params.currency || undefined,
    });
  }
  // LinkedIn – if Insight tag present, a page-view is already sent; specific conversions usually require a pixel code
  // If you have a specific conversion ID, we could call lintrk("track", { conversion_id: "1234" })
  // but we keep generic here to avoid misfires.
}

function trackContact(params: Record<string, any> = {}) {
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
      lead: (p: any) => trackGenerateLead(p || {}),
      contact: (p: any) => trackContact(p || {}),
    };

    // ---- AUTO-TRACK LEADS: intercept fetch to the Apps Script URL ----
    if (LEADS_URL) {
      const originalFetch = w.fetch?.bind(w);
      if (originalFetch) {
        w.fetch = async (...args: any[]) => {
          const req = args[0];
          const url = (typeof req === "string" ? req : req?.url) || "";
          const shouldWatch =
            (LEADS_URL && url.includes(LEADS_URL)) ||
            url.includes("script.google.com/macros/s/");
          let bodySnapshot: any = {};
          try {
            const init = (args.length > 1 ? args[1] : undefined) as any;
            bodySnapshot = extractLeadFieldsFromBody(init?.body);
          } catch {}
          const res = await originalFetch(...args);
          try {
            if (shouldWatch) {
              // Try clone and parse JSON; if it fails, still fire generic lead
              let ok = res.ok;
              try {
                const clone = res.clone();
                const json = await clone.json().catch(() => null);
                ok = ok && (!!json || typeof json === "object");
              } catch {}
              if (ok) {
                const eventParams = {
                  event_category: "engagement",
                  event_label: bodySnapshot?.projectName || bodySnapshot?.project || bodySnapshot?.mode || "lead",
                  value: 1,
                  ...bodySnapshot,
                };
                trackGenerateLead(eventParams);
                // Also fire a "contact" as you requested
                trackContact(eventParams);
                console.debug("[Analytics] Auto lead tracked via fetch:", eventParams);
              }
            }
          } catch (e) {
            console.warn("[Analytics] Lead autotrack error:", e);
          }
          return res;
        };
        console.debug("[Analytics] fetch interceptor armed for:", LEADS_URL);
      }
    }
  }, []);

  return null;
}
