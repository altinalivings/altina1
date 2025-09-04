"use client";
import React from "react";

export default function Testimonials() {
  const data = [
    { name: "Rahul S.", text: "Altina helped me find the perfect home. Smooth process and great support." },
    { name: "Neha P.", text: "Professional team and curated listings. Highly recommended." },
  ];

  return (
    <section style={{ marginTop: 40 }}>
      <h2>What our clients say</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        {data.map((t, i) => (
          <blockquote
            key={i}
            style={{
              background: "#081018",
              padding: 16,
              borderRadius: 12,
              color: "#cbd5e1",
            }}
          >
            <p style={{ marginBottom: 8 }}>"{t.text}"</p>
            <footer style={{ fontWeight: 700, color: "#fff" }}>- {t.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
