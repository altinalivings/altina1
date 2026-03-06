"use client";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const c = localStorage.getItem("altina_cookie_consent");
    if (!c) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("altina_cookie_consent", "accepted");
    setVisible(false);
    window.dispatchEvent(new Event("altina-analytics-enable"));
  }
  function decline() {
    localStorage.setItem("altina_cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#1A1A1C] text-white border-t border-white/10 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row gap-3 items-center justify-between">
        <p className="text-sm text-neutral-300">
          We use cookies to personalize content, analyze traffic, and enhance your experience. By continuing, you agree to our{" "}
          <a href="/privacy" className="underline text-altina-gold hover:text-altina-gold/80">Privacy Policy</a>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={accept}
            className="px-4 py-1.5 rounded-md bg-altina-gold text-black text-sm font-semibold hover:bg-altina-gold/90 transition"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="px-4 py-1.5 rounded-md border border-white/20 text-neutral-300 text-sm hover:bg-white/5 transition"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
