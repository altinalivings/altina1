// src/app/debug-analytics/page.tsx
"use client";

export default function Page() {
  const rows = [
    { key: "GA loaded", value: String(!!(globalThis as any).__ga_loaded) },
    { key: "FB loaded", value: String(!!(globalThis as any).__fb_loaded) },
    { key: "LI loaded", value: String(!!(globalThis as any).__li_loaded) },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        Debug Analytics
      </h1>

      <ul style={{ lineHeight: 1.8 }}>
        {rows.map(r => (
          <li key={r.key}>
            <strong>{r.key}:</strong> {r.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
