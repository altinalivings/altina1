"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const WHATSAPP_BASE =
  "https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%27m%20interested%20in%20DLF%20Midtown.%20Please%20share%20details.";

export default function WhatsAppRedirectPage() {
  const sp = useSearchParams();
  const [seconds, setSeconds] = useState(5);

  // (Optional) pass through a basic src param (e.g., ?src=youtube_ad) for your own logging
  const waUrl = useMemo(() => {
    const src = sp.get("src");
    return src ? `${WHATSAPP_BASE}&ref=${encodeURIComponent(src)}` : WHATSAPP_BASE;
  }, [sp]);

  useEffect(() => {
    // countdown
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);

    // fire GA4 event immediately (layout loads GA4/gtag.js)
    try {
      // @ts-ignore
      if (typeof window.gtag === "function") {
        // @ts-ignore
        window.gtag("event", "whatsapp_click", {
          event_category: "engagement",
          event_label: waUrl,
        });
      }
      // also push to dataLayer for GTM users
      // @ts-ignore
      window.dataLayer = window.dataLayer || [];
      // @ts-ignore
      window.dataLayer.push({ event: "whatsapp_click", wa_href: waUrl });
    } catch {}

    // redirect after 5s
    const r = setTimeout(() => {
      window.location.href = waUrl;
    }, 5000);

    return () => {
      clearInterval(t);
      clearTimeout(r);
    };
  }, [waUrl]);

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl md:text-3xl font-semibold">Connecting you to WhatsApp…</h1>
      <p className="opacity-80 mt-2">
        You’ll be redirected automatically in <strong>{seconds}</strong> second{seconds === 1 ? "" : "s"}.
      </p>

      <a
        className="mt-6 inline-flex items-center justify-center rounded-2xl px-5 py-3 border border-white/20 hover:border-white/40 transition"
        href={waUrl}
      >
        Open WhatsApp now
      </a>

      {/* optional: small preview of your homepage to keep users engaged */}
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
