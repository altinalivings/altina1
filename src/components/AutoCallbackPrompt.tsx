// src/components/AutoCallbackPrompt.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import CallbackModal from "@/components/CallbackModal"; // your existing component

const SHOW_DELAY_MS = 15000; // 15 seconds
const SEEN_KEY = "altina_callback_shown";
const LEAD_KEY = "altina_lead_submitted";

export default function AutoCallbackPrompt() {
  const [open, setOpen] = useState(false);
  const armed = useRef(false);

  // 1) Mark lead submitted when our endpoints succeed (subscribe/contact/leads)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Avoid double-wrapping if something else already wrapped fetch
    if ((window as any).__altina_fetch_wrap__) return;
    (window as any).__altina_fetch_wrap__ = true;

    const orig = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      const isLeadApi =
        url.includes("/api/leads") ||
        url.includes("/api/lead") ||
        url.includes("/api/contact") ||
        url.includes("/api/subscribe");

      const res = await orig(input, init);

      if (isLeadApi && res.ok) {
        try {
          sessionStorage.setItem(LEAD_KEY, "1");
          window.dispatchEvent(new Event("altina:lead-submitted"));
        } catch {}
      }
      return res;
    };

    return () => {
      // don't unwrap; safe to leave wrapped for session
    };
  }, []);

  // 2) Arm the timeout on mount if not already shown and no lead submitted
  useEffect(() => {
    if (typeof window === "undefined") return;

    const alreadyShown = sessionStorage.getItem(SEEN_KEY) === "1";
    const leadDone = sessionStorage.getItem(LEAD_KEY) === "1";
    if (alreadyShown || leadDone) return;

    // If any lead submits later, abort the popup
    const handleLead = () => {
      armed.current = false;
      setOpen(false);
      try { sessionStorage.setItem(LEAD_KEY, "1"); } catch {}
    };
    window.addEventListener("altina:lead-submitted", handleLead);

    armed.current = true;
    const t = setTimeout(() => {
      if (!armed.current) return;
      // re-check lead status before showing
      if (sessionStorage.getItem(LEAD_KEY) === "1") return;
      setOpen(true);
      try { sessionStorage.setItem(SEEN_KEY, "1"); } catch {}
    }, SHOW_DELAY_MS);

    return () => {
      clearTimeout(t);
      window.removeEventListener("altina:lead-submitted", handleLead);
    };
  }, []);

  // 3) Render your existing modal (kept neutral—no theme changes)
  return <CallbackModal open={open} onOpenChange={setOpen} source="auto-popup" />;
}
