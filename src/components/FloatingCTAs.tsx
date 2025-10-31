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
    return () => {
      try {
        w[flagKey] = false;
      } catch {}
    };
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
  const allowed = useSingletonWinFlag();
  if (!allowed) return null;

  const common = { projectId, projectName };
  const onCallback = () => openLead("callback", common);
  const onBrochure = () => openLead("brochure", common);
  const onVisit = () => openLead("visit", common);

  const topRule = "top-1/2 -translate-y-1/2";
  const mobileRule = hideOnMobile ? "hidden sm:flex" : "flex";

  return (
    <div className={`${wrapBase} ${mobileRule} ${topRule} ${className || ""}`}>
      {/* 📞 Request Callback */}
      //<button onClick={onCallback} className={btn} aria-label="Request Callback">
	  <button type="button" className="..." onClick={() => dispatchLead('callback')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 5.5C2 4.12 3.12 3 4.5 3h2A2.5 2.5 0 0 1 9 5.5v2A2.5 2.5 0 0 1 6.5 10h-.38a.5.5 0 0 0-.47.68 12.03 12.03 0 0 0 8.67 8.67.5.5 0 0 0 .68-.47V17.5A2.5 2.5 0 0 1 17.5 15h2A2.5 2.5 0 0 1 22 17.5v2A2.5 2.5 0 0 1 19.5 22C10.94 22 2 13.06 2 4.5V5.5Z"
          />
        </svg>
        <span>Request Callback</span>
      </button>

      {/* 📄 Download Brochure */}
      <button onClick={onBrochure} className={btn} aria-label="Download Brochure">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 20h16M12 4v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
        <span>Download Brochure</span>
      </button>

      {/* 🏡 Organize Visit */}
      <button onClick={onVisit} className={btn} aria-label="Organize Visit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10.5L12 4l9 6.5v9a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5v-9Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 21V12h6v9"
          />
        </svg>
        <span>Organize Visit</span>
      </button>
    </div>
  );
}
