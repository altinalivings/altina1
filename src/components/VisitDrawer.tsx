// src/components/VisitDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import { trackLead } from "@/lib/track";
import { getAttribution, initAttributionOnce } from "@/lib/attribution";

type Props = {
  open: boolean;
  onClose: () => void;
  projectName?: string | null;
  page?: string;
};

const phone10 = (s: string) => (s || "").replace(/\D/g, "").slice(0, 10);
const phone10Re = /^\d{10}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function VisitDrawer({ open, onClose, projectName, page }: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
    preferred_date: "",
    preferred_time: "",
  });
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    initAttributionOnce();
  }, []);

  function onChange<K extends keyof typeof form>(k: K, v: string) {
    if (k === "phone") v = phone10(v);
    setForm((s) => ({ ...s, [k]: v }));
  }

  function validate(): string | null {
    if (!phone10Re.test(form.phone)) return "Please enter a valid 10-digit phone number.";
    if (form.email && !emailRe.test(form.email.trim())) return "Please enter a valid email address.";
    if (!consent) return "Please accept the consent to proceed.";
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
      const label =
        page ||
        (() => {
          try {
            return window.location?.pathname || "/";
          } catch {
            return "/";
          }
        })();

      const attrib = getAttribution({
        source: "visit-drawer",
        page: label,
        project: projectName || "",
        mode: "visit",
      });

      const payload = {
        ...attrib,
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.note,
        mode: "visit" as const,
        projectName: projectName || "",
        page: label,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ __no_autotrack: 1, ...payload }),
      });
      if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Unable to submit");

      setOk(true);

      trackLead({ mode: "visit", project: projectName || "", label, value: 1 });

      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          event_category: "engagement",
          event_label: label,
          value: 1,
          mode: "visit",
          project: projectName || "",
          debug_mode: true,
        });
      }

      setForm({ name: "", phone: "", email: "", note: "", preferred_date: "", preferred_time: "" });

      setTimeout(onClose, 9000);
    } catch (e: any) {
      setOk(false);
      setErr(e?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60">
      <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-[#0B0B0C] p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Schedule a Site Visit</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input
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
          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
          />

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

          <textarea
            name="note"
            placeholder="Message (optional)"
            value={form.note}
            onChange={(e) => onChange("note", e.target.value)}
            className="min-h-[90px] rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
          />

          <label className="flex items-start gap-2 text-xs text-neutral-300">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
            I agree to be contacted by Altina Livings via call/WhatsApp/SMS/email.
          </label>

          <button
            disabled={submitting}
            className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Schedule Visit"}
          </button>

          {ok === true ? <p className="text-xs text-emerald-400">Submitted successfully.</p> : null}
          {ok === false ? <p className="text-xs text-red-400">{err || "Unable to submit"}</p> : null}
        </form>
      </div>
    </div>
  );
}
