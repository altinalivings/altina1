// src/components/FloatingCTAs.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  projectId?: string | null;
  projectName?: string | null;
  className?: string;      // e.g. 'top-[56%]' to fine-tune per page
  hideOnMobile?: boolean;  // default true
};

const wrapBase = "fixed right-4 md:right-6 z-40 flex-col gap-3";
const btn =
  "w-full flex items-center gap-2 justify-center rounded-xl border border-amber-400/45 " +
  "bg-black/65 backdrop-blur px-4 py-3 text-sm font-medium tracking-wide " +
  "shadow-[0_2px_12px_rgba(0,0,0,0.35)] hover:bg-amber-400/15 transition text-white";

// Ultra-robust singleton: use a window-scoped flag.
// Any second instance will self-disable.
function useSingletonWinFlag(flagKey = "__ALTINA_FCTAS_MOUNTED__"): boolean {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as any;
    if (w[flagKey]) {
      setAllowed(false);
      return;
    }
    w[flagKey] = true;
    setAllowed(true);
    return () => { try { w[flagKey] = false; } catch {} };
  }, [flagKey]);
  return allowed;
}

function openLead(mode: "callback" | "brochure" | "visit", payload?: any) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lead:open", { detail: { mode, ...payload } }));
  }
}

export default function FloatingCTAs({
  projectId = null,
  projectName = null,
  className,
  hideOnMobile = true,
}: Props) {
  const allowed = useSingletonWinFlag(); // prevents duplicates globally
  if (!allowed) return null;

  const common = { projectId, projectName };
  const onCallback = () => openLead("callback", common);
  const onBrochure = () => openLead("brochure", common);
  const onVisit = () => openLead("visit", common);

  const topRule = "top-1/2 -translate-y-1/2";
  const mobileRule = hideOnMobile ? "hidden sm:flex" : "flex";

  return (
    <div className={`${wrapBase} ${mobileRule} ${topRule} ${className || ""}`}>
      <button onClick={onCallback} className={btn} aria-label="Request Callback">
        <img src="/icons/phone.png" alt="" className="h-4 w-4" />
        <span>Request Callback</span>
      </button>
      <button onClick={onBrochure} className={btn} aria-label="Download Brochure">
        <img src="/icons/download.png" alt="" className="h-4 w-4" />
        <span>Download Brochure</span>
      </button>
      <button onClick={onVisit} className={btn} aria-label="Organize Visit">
        <img src="/icons/home.png" alt="" className="h-4 w-4" />
        <span>Organize Visit</span>
      </button>
    </div>
  );
}
