// src/components/ContactForm.js
"use client";

import { useState } from "react";

export default function ContactForm({ projectId }) {
  const [status, setStatus] = useState("idle");

  async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    if (projectId) payload.projectId = projectId;

    try {
      setStatus("loading");
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input name="name" placeholder="Your name" className="border rounded w-full p-2" required />
      <input name="phone" placeholder="Phone" className="border rounded w-full p-2" required />
      <input name="email" type="email" placeholder="Email" className="border rounded w-full p-2" />
      <textarea name="message" placeholder="Message" className="border rounded w-full p-2" rows={3} />
      <button disabled={status==="loading"} className="px-4 py-2 rounded bg-black text-white">
        {status==="loading" ? "Sending..." : "Send"}
      </button>
      {status==="success" && <p className="text-green-600 text-sm">Thanks! We’ll be in touch.</p>}
      {status==="error" && <p className="text-red-600 text-sm">Something went wrong. Try again.</p>}
    </form>
  );
}
