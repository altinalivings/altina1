// src/app/projects/[id]/error.tsx
"use client";

import React, { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[projects/[id]/error.tsx]", error);
  }, [error]);
  return (
    <div style={{maxWidth: 840, margin: "40px auto", padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "ui-sans-serif, system-ui"}}>
      <h2 style={{fontSize: 20, marginBottom: 8}}>Project page error</h2>
      <pre style={{whiteSpace: "pre-wrap"}}>{String(error?.message || error)}</pre>
      {error?.stack ? (
        <details style={{marginTop: 8}}>
          <summary>stack</summary>
          <pre style={{whiteSpace: "pre-wrap"}}>{error.stack}</pre>
        </details>
      ) : null}
      <button type=\"button\" onClick={() => reset()} style={{marginTop: 12, padding: "8px 12px", borderRadius: 8, background: "#10b981", color: "white"}}>
        Try again
      </button>
    </div>
  );
}