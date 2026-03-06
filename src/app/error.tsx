// src/app/error.tsx
"use client";

import React, { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app/error.tsx]", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <html>
      <body>
        <div style={{maxWidth: 840, margin: "40px auto", padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "ui-sans-serif, system-ui"}}>
          <h2 style={{fontSize: 20, marginBottom: 8}}>Something went wrong</h2>
          <p style={{color: "#999", fontSize: 14, marginBottom: 16}}>
            We're sorry — an unexpected error occurred. Please try again or contact us if this persists.
          </p>
          {isDev && (
            <>
              <pre style={{whiteSpace: "pre-wrap", fontSize: 12, color: "#f87171"}}>{String(error?.message || error)}</pre>
              {error?.stack ? (
                <details style={{marginTop: 8}}>
                  <summary>stack</summary>
                  <pre style={{whiteSpace: "pre-wrap", fontSize: 11}}>{error.stack}</pre>
                </details>
              ) : null}
            </>
          )}
          <button onClick={() => reset()} style={{marginTop: 12, padding: "8px 12px", borderRadius: 8, background: "#BF953F", color: "black", fontWeight: 600}}>
            Try again
          </button>
          <a href="/" style={{marginLeft: 12, padding: "8px 12px", borderRadius: 8, background: "transparent", border: "1px solid #555", color: "white", textDecoration: "none", fontSize: 14}}>
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
