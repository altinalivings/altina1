// src/components/StickyCTABar.tsx
"use client";

/**
 * Mobile bottom CTA bar.
 * Always hidden on screens ≥ sm (desktop/tablet), visible only on mobile.
 */
export default function StickyCTABar() {
  const btn =
    "flex-1 rounded-xl border border-amber-400/45 bg-black/70 backdrop-blur px-3 py-2 text-sm";

  const open = (mode: "callback" | "brochure" | "visit") => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("lead:open", { detail: { mode } }));
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden border-t border-white/10 bg-black/80 backdrop-blur px-3 py-2">
      <div className="mx-auto flex max-w-6xl gap-2">
        {/* Example of old button kept for reference:
            <button className={btn} onClick={() => open("callback")}>Callback</button>
        */}

        <button
          type="button"
          className={btn}
          onClick={() => open("callback")}
        >
          Callback
        </button>

        <button
          type="button"
          className={btn}
          onClick={() => open("brochure")}
        >
          Brochure
        </button>

        <button
          type="button"
          className={btn}
          onClick={() => open("visit")}
        >
          Visit
        </button>
      </div>
    </div>
  );
}
