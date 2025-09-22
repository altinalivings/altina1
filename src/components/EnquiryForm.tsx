// src/components/EnquiryForm.tsx
"use client";

import { useState } from "react";
import { trackLead, trackContact } from "@/lib/track";

type Props = {
  mode?: "callback" | "visit" | "brochure" | "contact"; // default "callback"
  source?: string;
  page?: string;
  projectId?: string | null;
  projectName?: string | null;
  submitLabel?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phone10 = (s: string) => (s || "").replace(/\D/g, "").slice(0, 10);
const phone10Re = /^\d{10}$/;

export default function EnquiryForm({
  mode = "callback",
  source = "lead-form",
  page = "",
  projectId = null,
  projectName = null,
  submitLabel,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
    preferred_date: "",
    preferred_time: "",
  });
  const [consent, setConsent] = useState(true); // ✅ auto-checked for callback
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [err, setErr] = useState<string>("");

  function onChange<K extends keyof typeof form>(k: K, v: string) {
    if (k === "phone") v = phone10(v); // live enforce 10 numeric
    setForm((s) => ({ ...s, [k]: v }));
  }

  function validate(): string | null {
    if (!phone10Re.test(form.phone)) return "Please enter a valid 10-digit phone number.";
    if (mode === "callback") {
      if (!emailRe.test(form.email.trim())) return "Please enter a valid email address.";
      if (!consent) return "Please accept the consent to proceed.";
    }
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
        name: form.name,
        phone: form.phone, // 10-digit
        email: form.email,
        message: form.note,
        mode,
        projectId: projectId || "",
        projectName: projectName || "",
        source,
        page,
        preferred_date: mode === "visit" ? form.preferred_date : "",
        preferred_time: mode === "visit" ? form.preferred_time : "",
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Unable to submit");
      }

      setOk(true);

      if (mode === "contact") {
        trackContact({ label: page, project: projectName || "", value: 1, mode });
      } else {
        trackLead({ mode, project: projectName || "", label: page || projectId || mode, value: 1 });
      }

      setForm({
        name: "",
        phone: "",
        email: "",
        note: "",
        preferred_date: "",
        preferred_time: "",
      });
      setConsent(true);
    } catch (e: any) {
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
        required={mode === "callback"}
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => onChange("email", e.target.value)}
        className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
      />

      {mode !== "brochure" && (
        <textarea
          name="note"
          placeholder={mode === "callback" ? "Any preference or query (optional)" : "Tell us a bit about your need (optional)"}
          value={form.note}
          onChange={(e) => onChange("note", e.target.value)}
          rows={3}
          className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
        />
      )}

      {mode === "visit" && (
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            type="date"
            name="preferred_date"
            value={form.preferred_date}
            onChange={(e) => onChange("preferred_date", e.target.value)}
            className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
          />
          <input
            type="time"
            name="preferred_time"
            value={form.preferred_time}
            onChange={(e) => onChange("preferred_time", e.target.value)}
            className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
          />
        </div>
      )}

      {mode === "callback" && (
        <label className="mt-1 flex items-start gap-2 text-xs text-neutral-300">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent"
          />
          <span>
            I authorize company representatives to Call, SMS, Email or WhatsApp me about its products and offers.
            This consent overrides any registration for DNC/NDNC.
          </span>
        </label>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95 disabled:opacity-60"
      >
        {submitting
          ? "Please wait…"
          : submitLabel || (mode === "visit" ? "Schedule Visit" : mode === "callback" ? "Request Callback" : mode === "brochure" ? "Get Brochure" : "Send")}
      </button>

      {ok === true && <p className="text-sm text-emerald-400">Thanks! We’ll be in touch shortly.</p>}
      {ok === false && err ? <p className="text-sm text-red-400">{err}</p> : null}
    </form>
  );
}
