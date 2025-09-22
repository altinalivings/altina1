"use client";

import { useEffect, useState } from "react";

// Make TypeScript aware of gtag on the window (when GA is present)
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function DebugAnalyticsPage() {
  // Replace the old 'payload' (which wasn't defined) with explicit state
  const [label, setLabel] = useState<string>("lead");
  const [mode, setMode] = useState<string>("manual");
  const [value, setValue] = useState<number>(1);

  // Hydrate defaults from query params if present: ?label=&mode=&value=
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const l = sp.get("label");
    const m = sp.get("mode");
    const v = sp.get("value");
    if (l) setLabel(l);
    if (m) setMode(m);
    if (v && !Number.isNaN(Number(v))) setValue(Number(v));
  }, []);

  const sendTestEvent = () => {
    // Guard in case gtag isn't initialized
    if (!window.gtag) {
      console.warn("window.gtag is not available. Is GA4 installed on this page?");
      alert("gtag() not found. Is GA4 installed on this page?");
      return;
    }

    window.gtag("event", "generate_lead", {
      event_category: "engagement",
      // Use the chosen label or fallback values
      event_label: label || mode || "lead",
      value: typeof value === "number" && !Number.isNaN(value) ? value : 1,
      debug_mode: true,
    });

    alert("Sent 'generate_lead' event to GA4. Check Realtime → Events.");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        Debug Analytics
      </h1>
      <p style={{ marginBottom: "1rem" }}>
        This page sends a <code>generate_lead</code> event to GA4 using <code>gtag</code>.
        You can also pass query params like <code>?label=test&amp;mode=cta&amp;value=5</code>.
      </p>

      <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
        <label>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Label</div>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: 8 }}
            placeholder="lead"
          />
        </label>

        <label>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Mode</div>
          <input
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: 8 }}
            placeholder="manual"
          />
        </label>

        <label>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Value</div>
          <input
            type="number"
            value={String(value)}
            onChange={(e) => setValue(Number(e.target.value))}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: 8 }}
            placeholder="1"
          />
        </label>
      </div>

      <button
        onClick={sendTestEvent}
        style={{
          padding: "0.75rem 1rem",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Send generate_lead
      </button>
    </div>
  );
}
