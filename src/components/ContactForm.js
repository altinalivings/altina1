"use client";
import { useState } from "react";
import { collectAttribution } from "@/lib/attribution";

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL;

export default function ContactForm({ defaultSource = "contact-form" }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!SHEETS_URL) {
      setStatus("SHEETS webhook URL not configured.");
      return;
    }

    try {
      const attr = collectAttribution();
      const payload = {
        ...form,
        source: defaultSource,
        page: typeof window !== "undefined" ? window.location.pathname : "",
        ...attr,
        ts: new Date().toISOString(),
      };

      const res = await fetch(SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }

      setForm({ name: "", phone: "", email: "", message: "" });
      setStatus("Thanks! We’ll get back to you shortly.");
    } catch (err) {
      setStatus(err.message || "Something went wrong. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={4} />
      {status && <div className="form-status">{status}</div>}
      <button type="submit" disabled={!SHEETS_URL}>Send</button>
    </form>
  );
}
