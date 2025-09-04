"use client";
import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-3Q43P5GKHK";
const LS_KEY = "altina_ga_cid";

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

// GA cookie looks like GA1.1.1234567890.1234567890 → cid is the last two segments joined by "."
function parseGaCookieToCid() {
  const c = getCookie("_ga");
  if (!c) return null;
  const parts = c.split(".");
  if (parts.length >= 4) return `${parts[2]}.${parts[3]}`;
  return null;
}

export default function AnalyticsClient() {
  useEffect(() => {
    let done = false;

    // 1) Try GA API
    function tryGetCid() {
      if (typeof window === "undefined") return;
      const gtag = window.gtag;
      if (typeof gtag !== "function") return false;

      try {
        gtag("get", GA_MEASUREMENT_ID, "client_id", (cid) => {
          if (cid && !done) {
            localStorage.setItem(LS_KEY, cid);
            done = true;
          }
        });
        return true;
      } catch {
        return false;
      }
    }

    // 2) Fallback to cookie immediately
    const cookieCid = parseGaCookieToCid();
    if (cookieCid) localStorage.setItem(LS_KEY, cookieCid);

    // 3) Keep trying a few times in case GA loads after hydration
    if (!tryGetCid()) {
      const start = Date.now();
      const t = setInterval(() => {
        if (tryGetCid() || Date.now() - start > 6000) clearInterval(t);
      }, 300);
      return () => clearInterval(t);
    }
  }, []);

  return null;
}
