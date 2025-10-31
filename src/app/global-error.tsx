// src/app/global-error.tsx
"use client";
import React from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.error("[app/global-error.tsx]", error);
  return (
    <html>
      <body>
        <div style={{maxWidth: 840, margin: "40px auto", padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "ui-sans-serif, system-ui"}}>
          <h2 style={{fontSize: 20, marginBottom: 8}}>Global error</h2>
          <pre style={{whiteSpace: "pre-wrap"}}>{String(error?.message || error)}</pre>
          <button type=\"button\" onClick={() => reset()} style={{marginTop: 12, padding: "8px 12px", borderRadius: 8, background: "#10b981", color: "white"}}>
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
