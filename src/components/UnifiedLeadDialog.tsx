// src/components/UnifiedLeadDialog.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { trackLead, trackContact } from "@/lib/track";
import { getAttribution, initAttributionOnce } from "@/lib/attribution";

type Mode = "callback" | "visit" | "brochure" | "contact";

type Props = {
  open?: boolean;
  onClose?: () => void;
  mode?: Mode;
  projectId?: string | null;
  projectName?: string | null;
  source?: string;
  page?: string;
  endpoint?: string;
  title?: string;
  submitLabel?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phone10 = (s: string) => (s || "").replace(/\D/g, "").slice(0, 10);
const phone10Re = /^\d{10}$/;

export default function UnifiedLeadDialog({
  open: openProp,
  onClose,
  mode = "callback",
  projectId = null,
  projectName = null,
  source = "lead-dialog",
  page,
  endpoint = "/api/leads",
  title,
  submitLabel,
}: Props) {
  const [open, setOpen] = useState(Boolean(openProp));
  useEffect(() => setOpen(Boolean(openProp)), [openProp]);

  useEffect(() => {
    initAttributionOnce();
  }, []);

  const label = useMemo(() => {
    if (page) return page;
    try {
      return window.location?.pathname || "/";
    } catch {
      return "/";
    }
  }, [page]);

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

  const heading =
    title ||
    (mode === "visit"
      ? "Schedule a Site Visit"
      : mode === "brochure"
      ? "Get Brochure"
      : mode === "contact"
      ? "Send an Enquiry"
      : "Request a Callback");

  const buttonText =
    submitLabel ||
    (mode === "visit"
      ? "Schedule Visit"
      : mode === "brochure"
      ? "Get Brochure"
      : mode === "contact"
      ? "Send"
      : "Request Callback");

  function onChange<K extends keyof typeof form>(k: K, v: string) {
    if (k === "phone") v = phone10(v);
    setForm((s) => ({ ...s, [k]: v }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Please enter your name.";
    if (!phone10Re.test(form.phone)) return "Please enter a valid 10-digit phone number.";
    if (mode === "callback" && !emailRe.test(form.email.trim())) return "Please enter a valid email address.";
    if (!consent) return "Please accept the consent to proceed.";
    if (mode === "visit") {
      if (!form.preferred_date) return "Please select a preferred date.";
      if (!form.preferred_time) return "Please select a preferred time.";
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
        page: label,
        project: projectName || "",
        mode,
      });

      const payload = {
        ...attrib,
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.note,
        mode,
        projectId: projectId || "",
        projectName: projectName || "",
        source,
        page: label,
        preferred_date: mode === "visit" ? form.preferred_date : "",
        preferred_time: mode === "visit" ? form.preferred_time : "",
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ __no_autotrack: 1, ...payload }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Unable to submit");
      }

      setOk(true);

      if (mode === "contact") {
        trackContact({ label, project: projectName || "", value: 1 });
      } else {
        trackLead({ mode, project: projectName || "", label, value: 1 });
      }

      if (typeof window.gtag === "function") {
        if (mode === "contact") {
          window.gtag("event", "contact", {
            event_category: "engagement",
            event_label: label,
            value: 1,
            debug_mode: true,
          });
        } else {
          window.gtag("event", "generate_lead", {
            event_category: "engagement",
            event_label: label,
            value: 1,
            mode,
            project: projectName || "",
            debug_mode: true,
          });
        }
      }

      setForm({ name: "", phone: "", email: "", note: "", preferred_date: "", preferred_time: "" });
      setConsent(true);
      setTimeout(() => {
        onClose?.();
        setOpen(false);
      }, 9000);
    } catch (e: any) {
      setOk(false);
      setErr(e?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0B0C] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{heading}</h3>
            {projectName ? <p className="text-xs text-neutral-400 mt-1">{projectName}</p> : null}
          </div>
          <button onClick={() => (onClose?.(), setOpen(false))} className="text-neutral-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
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

          <label className="flex items-start gap-2 text-xs text-neutral-300">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
            I agree to be contacted by Altina Livings via call/WhatsApp/SMS/email.
          </label>

          <button
            disabled={submitting}
            className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : buttonText}
          </button>

          {ok === true ? <p className="text-xs text-emerald-400">Submitted successfully.</p> : null}
          {ok === false ? <p className="text-xs text-red-400">{err || "Unable to submit"}</p> : null}
        </form>
      </div>
    </div>
  );
}
