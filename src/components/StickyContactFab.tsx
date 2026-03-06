// src/components/StickyContactFab.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  phone?: string;                 // e.g. +919891234195
  whatsappHref?: string;          // optional WA deep link
  submitUrl?: string;             // your Apps Script/Webhook URL
  defaultProject?: string;        // optional project name to include
  zIndexClass?: string;           // override if needed (e.g. "z-[1200]")
};

export default function StickyContactFab({
  phone = "+91 98912 34195",
  whatsappHref,
  submitUrl = "/api/lead",  // change to your Apps Script URL if you prefer direct
  defaultProject,
  zIndexClass = "z-[1200]",
}: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy]   = useState(false);
  const [ok, setOk]       = useState<string | null>(null);
  const [err, setErr]     = useState<string | null>(null);

  const wa = useMemo(() => {
    if (whatsappHref) return whatsappHref;
    // build a simple WA link from phone
    const digits = phone.replace(/\D/g, "");
    return `https://wa.me/${digits}?text=Hi%20Altina%20Livings%2C%20I%27m%20interested%20in%20projects.`;
  }, [phone, whatsappHref]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setOk(null);
    setErr(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: (fd.get("name") || "").toString().trim(),
      phone: (fd.get("phone") || "").toString().trim(),
      message: (fd.get("message") || "").toString().trim(),
      project: (fd.get("project") || defaultProject || "").toString().trim(),
      source: "StickyContactFab",
      page_url: typeof window !== "undefined" ? window.location.href : "",
      consent: !!fd.get("consent"),
    };

    try {
      const res = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setOk("Thanks! We’ll reach out shortly.");
      (e.target as HTMLFormElement).reset();
      // optionally close after a delay
      setTimeout(() => setOpen(false), 1200);
    } catch (error: any) {
      setErr("Couldn’t submit. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating button bar */}
      <div
        className={`fixed top-8 right-12 ${zIndexClass} flex gap-2 items-end`}
        aria-live="polite"
      >
      

        {/* Open form */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full px-4 py-3 text-sm font-semibold border border-altina-gold/60 text-[#0D0D0D] shadow-altina bg-gold-grad hover:opacity-95"
          aria-expanded={open}
          aria-controls="altina-contact-form"
        >
          Enquiry
        </button>
      </div>

      {/* Slide-up card */}
      <div
        className={`fixed right-4 bottom-20 w-[92vw] max-w-sm ${zIndexClass} transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-[120%]"
        }`}
        id="altina-contact-form"
      >
        <div className="modal-surface golden-frame rounded-2xl border border-altina-gold/30 bg-[#0B0B0C]/95 backdrop-blur p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-altina-gold">Quick Enquiry</h3>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-altina-ivory/70 hover:bg-white/10"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <input
              name="name"
              required
              placeholder="Your name"
              className="w-full rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
            />
            <input
              name="phone"
              required
              inputMode="tel"
              placeholder="Phone number"
              className="w-full rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
            />
            <input
              name="project"
              defaultValue={defaultProject || ""}
              placeholder="Project (optional)"
              className="w-full rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
            />
            <textarea
              name="message"
              rows={3}
              placeholder="Message (optional)"
              className="w-full rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
            />
            <label className="flex items-start gap-2 text-[12px] text-neutral-300">
              <input
                type="checkbox"
                name="consent"
                defaultChecked
                className="mt-0.5"
              />
              <span>
                I authorize company representatives to Call, SMS, Email or WhatsApp me about its
                products and offers. This consent overrides any registration for DNC/NDNC.
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95 disabled:opacity-60"
              >
                {busy ? "Submitting…" : "Submit"}
              </button>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-300 underline underline-offset-2 hover:opacity-90"
              >
                or chat on WhatsApp →
              </a>
            </div>

            {ok && <p className="text-sm text-green-400">{ok}</p>}
            {err && <p className="text-sm text-red-400">{err}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
