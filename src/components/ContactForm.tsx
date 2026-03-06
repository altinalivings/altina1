// src/components/ContactForm.tsx
"use client";

import { useState } from "react";
import { trackContact } from "@/lib/track";

type Props = {
  source?: string;          // e.g. "contact-page"
  page?: string;            // e.g. "/contact"
  projectName?: string | null;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phone10 = (s: string) => (s || "").replace(/\D/g, "").slice(0, 10);
const phone10Re = /^\d{10}$/;

export default function ContactForm({
  source = "contact-page",
  page = "/contact",
  projectName = null,
}: Props) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [err, setErr] = useState<string>("");

  function onChange<K extends keyof typeof form>(key: K, v: string) {
    if (key === "phone") v = phone10(v); // live restrict to 10 digits
    setForm((s) => ({ ...s, [key]: v }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Please enter your name.";
    if (!phone10Re.test(form.phone)) return "Please enter a valid 10-digit phone number.";
    if (!emailRe.test(form.email.trim())) return "Please enter a valid email address.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    setOk(null);

    const v = validate();
    if (v) {
      setSubmitting(false);
      setOk(false);
      setErr(v);
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone,
        email: form.email.trim(),
        message: form.message.trim(),
        mode: "contact",
        source,
        page,
        projectName: projectName || "",
      };

      console.log("[contact] submitting", payload);

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ __no_autotrack: 1, ...payload }),
      });

      const text = await res.text().catch(() => "");
      let json: any = null;
      try { json = text ? JSON.parse(text) : null; } catch {}

      console.log("[contact] response", res.status, json || text);

      if (!res.ok) {
        const msg = (json && (json.message || json.error)) || text || "Unable to submit";
        throw new Error(msg);
      }

      setOk(true);
      setForm({ name: "", phone: "", email: "", message: "" });

      // a) helper (Meta + GA4 via helper)
      trackContact({ label: source || "contact", project: projectName || "", value: 1 });

      // b) GA4 direct fallback so it shows in DebugView immediately
      if (typeof window.gtag === "function") {
        window.gtag("event", "contact", {
          event_category: "engagement",
          event_label: source || "contact",
          value: 1,
          debug_mode: true,
        });
        console.log("[contact] gtag fallback fired");
      }
    } catch (e: any) {
      console.error("[contact] error", e);
      setOk(false);
      setErr(e?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          required
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
        />
        <input
          required
          name="phone"
          placeholder="Phone (10 digits)"
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          inputMode="numeric"
          pattern="\d{10}"
          maxLength={10}
          className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
        />
      </div>

      <input
        required
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => onChange("email", e.target.value)}
        className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
      />

      <textarea
        name="message"
        placeholder="Message (optional)"
        value={form.message}
        onChange={(e) => onChange("message", e.target.value)}
        rows={3}
        className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
      />

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send Enquiry"}
      </button>

      {ok === true && <p className="text-sm text-emerald-400">Thanks! Our team will contact you shortly.</p>}
      {ok === false && err ? <p className="text-sm text-red-400">{err}</p> : null}
    </form>
  );
}