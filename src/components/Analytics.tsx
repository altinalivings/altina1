// src/components/Analytics.tsx
"use client";

import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA4_ID;
const FB_PIXEL = process.env.NEXT_PUBLIC_FB_PIXEL;
const LI_PARTNER = process.env.NEXT_PUBLIC_LI_PARTNER || process.env.NEXT_PUBLIC_LI_PARTNER_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;
const GADS_SEND_TO = process.env.NEXT_PUBLIC_GADS_SEND_TO;

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

export default function Analytics() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as any;

    // --- GA4 ---
    if (GA_ID) {
      injectScriptOnce("ga4-script", `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
      w.dataLayer = w.dataLayer || [];
      w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
      w.gtag = guardFn(w.gtag);
      w.gtag("js", new Date());
      w.gtag("config", GA_ID);
    }

    // --- Google Ads ---
    if (GADS_ID) {
      injectScriptOnce("gads-script", `https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`);
      w.dataLayer = w.dataLayer || [];
      w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
      w.gtag = guardFn(w.gtag);
      // Basic config is enough; conversion "send_to" is used during event calls
      w.gtag("config", GADS_ID);
      // Optionally prime a site-wide page-view for Ads, harmless if duplicate with GA4
      if (GADS_SEND_TO) {
        w.gtag("event", "page_view", { send_to: GADS_SEND_TO });
      }
    }

    // --- Facebook Pixel (guard local before assign) ---
    if (FB_PIXEL && !w.fbq) {
      (function (f: any, b: any, e: any, v: any) {
        if (f.fbq) return;
        var n: any;
        var raw = function() { (n.callMethod ? n.callMethod : n.queue.push).apply(n, arguments); };
        n = f.fbq = guardFn(raw);
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        var t = b.createElement(e); t.async = true;
        t.src = v || "https://connect.facebook.net/en_US/fbevents.js";
        var s = b.getElementsByTagName(e)[0];
        s.parentNode!.insertBefore(t, s);
      })(w, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    }
    if (FB_PIXEL) {
      w.fbq = guardFn(w.fbq);
      w._fbq = w.fbq;
      w.fbq("init", FB_PIXEL);
      w.fbq("track", "PageView");
    }

    // --- LinkedIn Insight Tag ---
    if (LI_PARTNER && !w.lintrk) {
      w._linkedin_data_partner_ids = w._linkedin_data_partner_ids || [];
      if (!w._linkedin_data_partner_ids.includes(LI_PARTNER)) {
        w._linkedin_data_partner_ids.push(LI_PARTNER);
      }
      injectScriptOnce("li-insight", "https://snap.licdn.com/li.lms-analytics/insight.min.js");
    }
  }, []);

  return null;
}
