// src/components/AutoCallbackPrompt.tsx
"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** How long before we pop the modal (ms) */
  delayMs?: number;
  /** Optional name of the current project to pass through */
  projectName?: string | null;
  /** Disable auto-show (useful on pages you don't want it) */
  disabled?: boolean;
};

/**
 * Auto-open the **UnifiedLeadDialog** (the gold themed modal) once per session after a delay.
 * We do this by dispatching the global `lead:open` event consumed by LeadBus.
 * All duplicate timers are prevented with a global + session guard.
 */
export default function AutoCallbackPrompt({ delayMs = 15000, projectName, disabled }: Props) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (disabled) return;
    if (typeof window === "undefined") return;

    // signal presence so other components (like SiteFooter) know to skip their auto timers
    (window as any).__ALTINA_HAS_AUTOPROMPT__ = true;

    // If we've already shown the popup this session, don't schedule again
    if (sessionStorage.getItem("altina_auto_prompt_shown") === "1" ||
        sessionStorage.getItem("altina_autopopup_done") === "1") {
      return;
    }

    // Avoid arming multiple timers on route changes
    const w: any = window;
    if (w.__ALTINA_POPUP_SCHEDULED__ || w.__ALTINA_POPUP_OPEN__) return;
    w.__ALTINA_POPUP_SCHEDULED__ = true;

    const fire = () => {
      if (sessionStorage.getItem("altina_auto_prompt_shown") === "1") return;
      // mark as opened
      w.__ALTINA_POPUP_OPEN__ = true;
      sessionStorage.setItem("altina_auto_prompt_shown", "1");
      sessionStorage.setItem("altina_autopopup_done", "1");
      // Open the THEMED modal via LeadBus
      window.dispatchEvent(
        new CustomEvent("lead:open", {
          detail: {
            mode: "callback",
            projectId: projectName ? projectName.toLowerCase().replace(/\s+/g,"-") : "auto",
            projectName: projectName || "ALTINA",
            source: "auto-prompt",
            page: typeof location !== "undefined" ? location.pathname : "/",
          },
        })
      );
    };

    const arm = () => {
      if (timerRef.current) return;
      timerRef.current = window.setTimeout(fire, Math.max(0, delayMs));
    };

    if (document.visibilityState === "visible") arm();
    else {
      const onVis = () => {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", onVis);
          arm();
        }
      };
      document.addEventListener("visibilitychange", onVis);
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [delayMs, projectName, disabled]);

  // No local modal — UnifiedLeadDialog will handle the UI
  return null;
}
