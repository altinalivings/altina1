"use client";
import { useEffect, useState } from "react";
import { collectAttribution } from "@/lib/attribution";

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL; // <— public env var

export default function CallRequestModal({ open, onClose, defaultSource = "request-callback" }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) return;
    setErr("");
  }, [open]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!SHEETS_URL) {
      setErr("SHEETS webhook URL not configured.");
      return;
    }

    try {
      setSubmitting(true);
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

      // clear + close
      setForm({ name: "", phone: "", email: "", message: "" });
      onClose?.();
    } catch (e) {
      setErr(e.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="crm-backdrop">
      <div className="crm-modal">
        <button className="crm-close" onClick={onClose} aria-label="Close">×</button>
        <h3 className="crm-title">Request a Call Back</h3>

        <form onSubmit={handleSubmit} className="crm-form">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={4} />

          {err && <div className="crm-error">{err}</div>}
          {!SHEETS_URL && <div className="crm-error">NEXT_PUBLIC_SHEETS_WEBHOOK_URL is not set.</div>}

          <button type="submit" disabled={submitting || !SHEETS_URL}>
            {submitting ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
