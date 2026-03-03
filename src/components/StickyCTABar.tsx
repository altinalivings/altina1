// src/components/StickyCTABar.tsx
"use client";

/**
 * Mobile bottom CTA bar.
 * Always hidden on screens ≥ sm (desktop/tablet), visible only on mobile.
 */
export default function StickyCTABar() {
  const open = (mode: "callback" | "brochure" | "visit") =>
    window.dispatchEvent(new CustomEvent("lead:open", { detail: { mode } }));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden border-t border-white/10 bg-[#0B0B0C]/95 backdrop-blur-md px-3 py-2 safe-area-bottom">
      <div className="mx-auto flex max-w-6xl gap-2">
        <button
          onClick={() => open("callback")}
          className="flex-1 flex flex-col items-center gap-0.5 rounded-xl border border-amber-400/45 bg-black/70 backdrop-blur px-2 py-2.5 text-xs font-medium text-white hover:bg-amber-400/10 transition active:scale-95"
          aria-label="Request a callback"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/>
          </svg>
          Callback
        </button>
        <button
          onClick={() => open("brochure")}
          className="flex-1 flex flex-col items-center gap-0.5 rounded-xl border border-amber-400/45 bg-black/70 backdrop-blur px-2 py-2.5 text-xs font-medium text-white hover:bg-amber-400/10 transition active:scale-95"
          aria-label="Download brochure"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400" fill="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM8 17l2-2.5 1.5 2 2-3 2.5 3.5H8z"/>
          </svg>
          Brochure
        </button>
        <button
          onClick={() => open("visit")}
          className="flex-1 flex flex-col items-center gap-0.5 rounded-xl border border-amber-400/45 bg-black/70 backdrop-blur px-2 py-2.5 text-xs font-medium text-white hover:bg-amber-400/10 transition active:scale-95"
          aria-label="Schedule a site visit"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400" fill="currentColor">
            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
          </svg>
          Visit
        </button>

      </div>
    </div>
  );
}
