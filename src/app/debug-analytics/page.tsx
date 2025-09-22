// src/app/debug-analytics/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function DebugAnalyticsPage() {
  const sp = useSearchParams();
  const [fired, setFired] = useState(false);

  // Derive a "payload" from URL params to keep behavior flexible
  const params = useMemo(() => {
    const label = sp.get("label") ?? sp.get("mode") ?? "lead";
    const valueRaw = sp.get("value");
    const value = Number.isFinite(Number(valueRaw)) ? Number(valueRaw) : 1;
    const category = sp.get("category") ?? "engagement";
    return { label, value, category };
  }, [sp]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;

    window.gtag("event", "generate_lead", {
      event_category: params.category,
      event_label: params.label,
      value: params.value,
      debug_mode: true,
    });

    setFired(true);
  }, [params]);

  return (
    <main className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Debug Analytics</h1>
      <p className="text-sm opacity-80">
        Fires <code>gtag('event','generate_lead')</code> using URL params:
        <br />
        <code>?label=Brochure&amp;value=3&amp;mode=cta&amp;category=engagement</code>
      </p>
      <div className="rounded-lg border p-4">
        <div><strong>Fired:</strong> {fired ? "Yes" : "No"}</div>
        <div><strong>event_category:</strong> {params.category}</div>
        <div><strong>event_label:</strong> {params.label}</div>
        <div><strong>value:</strong> {params.value}</div>
      </div>
    </main>
  );
}
