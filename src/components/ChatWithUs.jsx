// components/ChatWithUs.jsx
"use client";
import React from "react";

export default function ChatWithUs({ phone = "919891234195", prefill = "Hello, I would like to chat about your project." }) {
  const url = `https://wa.me/${String(phone).replace(/\D/g, "")}?text=${encodeURIComponent(prefill)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        background: "#25D366",
        color: "#fff",
        borderRadius: 10,
        textDecoration: "none",
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        fontWeight: 600,
      }}
    >
      💬 Chat with us
    </a>
  );
}
