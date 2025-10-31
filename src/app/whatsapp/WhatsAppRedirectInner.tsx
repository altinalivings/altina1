"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const WHATSAPP_BASE =
  "https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%27m%20interested%20in%20DLF%20Midtown.%20Please%20share%20details.";

export default function WhatsAppRedirectInner() {
  const sp = useSearchParams();
  const [seconds, setSeconds] = useState(5);

  // Preserve ?src= or UTM values if present
  const waUrl = useMemo(() => {
    const src = sp.get("src");
    const utm_source = sp.get("utm_source");
    const utm_campaign = sp.get("utm_campaign");
    const utm_medium = sp.get("utm_medium");

    let url = WHATSAPP_BASE;
    const params: Record<string, string> = {};
    if (src) params.ref = src;
    if (utm_source) params.utm_source = utm_source;
    if (utm_medium) params.utm_medium = utm_medium;
    if (utm_campaign) params.utm_campaign = utm_campaign;

    const extra = new URLSearchParams(params).toString();
    return extra ? `${url}&${extra}` : url;
  }, [sp]);

  // Countdown + redirect logic
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);

    // Fire GA4 / GTM event
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", "whatsapp_click", {
          event_category: "engagement",
          event_label: waUrl,
        });
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "whatsapp_click", wa_href: waUrl });
    } catch (err) {
      console.warn("Event tracking error:", err);
    }

    // Redirect to WhatsApp after 5 seconds
    const redirect = setTimeout(() => {
      window.location.href = waUrl;
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [waUrl]);

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl md:text-3xl font-semibold">Connecting you to WhatsApp…</h1>
      <p className="opacity-80 mt-2">
        You’ll be redirected automatically in{" "}
        <strong>{seconds}</strong> second{seconds === 1 ? "" : "s"}.
      </p>

      <a
        href={waUrl}
        className="mt-6 inline-flex items-center justify-center rounded-2xl px-5 py-3 border border-white/20 hover:border-white/40 transition"
      >
        Open WhatsApp now
      </a>

      {/* Optional: embed preview of homepage while waiting */}
      <div className="w-full max-w-5xl mt-8 rounded-2xl overflow-hidden border border-white/10">
        <iframe
          src="https://www.altinalivings.com/"
          title="ALTINA™ Livings"
          style={{ width: "100%", height: "60vh", border: "0" }}
        />
      </div>
    </main>
  );
}