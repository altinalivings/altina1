// src/app/error.tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // optional: log to analytics
    // console.error(error);
  }, [error]);

  return (
    <div style={{ maxWidth: 840, margin: "40px auto", padding: 24, borderRadius: 16,
      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
      fontFamily: "ui-sans-serif, system-ui" }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Something went wrong</h2>
      {error?.message && (
        <p style={{ opacity: 0.8, marginBottom: 16 }}>{String(error.message)}</p>
      )}
      <button
        type="button"
        onClick={() => reset()}
        style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)" }}
      >
        Try again
      </button>
    </div>
  );
}
