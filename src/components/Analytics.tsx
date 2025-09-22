// src/components/Analytics.tsx
"use client";

import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;
const FB_PIXEL = process.env.NEXT_PUBLIC_FB_PIXEL;
const LI_PARTNER = process.env.NEXT_PUBLIC_LI_PARTNER_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

// Helper to inject a script only once
function injectScriptOnce(id: string, src: string, attrs: Record<string, string> = {}) {
  if (typeof document === "undefined") return;
  if (document.getElementById(id)) return; // already injected
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  s.id = id;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

export default function Analytics() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as any;

    // --- GA4 ---
    if (GA_ID) {
      // gtag.js
      injectScriptOnce("ga4-script", `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);

      // init dataLayer & gtag without typing globals
      w.dataLayer = w.dataLayer || [];
      w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
      w.gtag("js", new Date());
      w.gtag("config", GA_ID);
    }

    // --- Google Ads (optional) ---
    if (GADS_ID) {
      injectScriptOnce("gads-script", `https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`);
      w.dataLayer = w.dataLayer || [];
      w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
      w.gtag("config", GADS_ID);
    }

    // --- Facebook Pixel ---
    if (FB_PIXEL && !w.fbq) {
      (function (f: any, b, e, v, n?, t?, s?) {
        if (f.fbq) return;
        n = f.fbq = function () {
          (n.callMethod ? n.callMethod : n.queue.push).apply(n, arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = "https://connect.facebook.net/en_US/fbevents.js";
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(w, document, "script");
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

  // No visible UI; this component only manages script injection
  return null;
}
