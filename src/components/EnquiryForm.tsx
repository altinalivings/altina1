// src/components/EnquiryForm.tsx
"use client";

import { useEffect, useState } from "react";
import { trackLead, trackContact } from "@/lib/track";
import { getAttribution, initAttributionOnce } from "@/lib/attribution";

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

  useEffect(() => {
    initAttributionOnce();
  }, []);

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
      const attrib = getAttribution({
        source,
        page: page || (typeof window !== "undefined" ? window.location?.pathname || "/" : "/"),
        project: projectName || "",
        mode,
      });

      const payload = {
        ...attrib,
        name: form.name,
        phone: form.phone, // 10-digit
        email: form.email,
        message: form.note,
        mode,
        projectId: projectId || "",
        projectName: projectName || "",
        source,
        page: page || attrib.page,
        preferred_date: mode === "visit" ? form.preferred_date : "",
        preferred_time: mode === "visit" ? form.preferred_time : "",
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ __no_autotrack: 1, ...payload }),
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

      {mode === "visit" ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            required
            type="date"
            value={form.preferred_date}
            onChange={(e) => onChange("preferred_date", e.target.value)}
            className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
          />
          <input
            required
            type="time"
            value={form.preferred_time}
            onChange={(e) => onChange("preferred_time", e.target.value)}
            className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
          />
        </div>
      ) : null}

      <textarea
        name="note"
        placeholder="Message (optional)"
        value={form.note}
        onChange={(e) => onChange("note", e.target.value)}
        className="min-h-[90px] rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
      />

      {mode === "callback" ? (
        <label className="flex items-start gap-2 text-xs text-neutral-300">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
          I agree to be contacted by Altina Livings via call/WhatsApp/SMS/email.
        </label>
      ) : null}

      <button
        disabled={submitting}
        className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95 disabled:opacity-60"
      >
        {submitting ? "Submitting..." : submitLabel || (mode === "visit" ? "Schedule Visit" : "Submit")}
      </button>

      {ok === true ? <p className="text-xs text-emerald-400">Submitted successfully.</p> : null}
      {ok === false ? <p className="text-xs text-red-400">{err || "Unable to submit"}</p> : null}
    </form>
  );
}
