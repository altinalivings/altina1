"use client";

import { useEffect } from "react";

/**
 * Guards analytics globals against illegal writes (e.g. fbq.length = 0)
 * without disabling analytics.
 */
export default function AnalyticsGuards() {
  useEffect(() => {
    const w = window as any;

    const guard = (fn: any) => {
      if (typeof fn !== "function") return fn;
      try {
        if ((fn as any).__guarded) return fn;
        const proxy = new Proxy(fn, {
          set(target, prop, value) {
            if (prop === "length") return true; // ignore illegal writes
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
        return proxy;
      } catch {
        return fn;
      }
    };

    // Guard any pre-existing globals immediately
    if (typeof (w as any).fbq === "function") (w as any).fbq = guard((w as any).fbq);
    if (typeof (w as any).gtag === "function") (w as any).gtag = guard((w as any).gtag);
  }, []);

  return null;
}
