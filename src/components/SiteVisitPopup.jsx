"use client";

import { useState } from "react";
import { submitLead } from "@/lib/submitLead";

export default function SiteVisitPopup({ open, onClose, projectName, onBooked }) {
  const [form, setForm] = useState({
    intent: "Site visit",
    enquiry: "Schedule",
    name: "",
    phone: "",
    email: "",
    city: "",
    date: "",
    time: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    try {
      const payload = {
        ...form,
        project: projectName,
        need: "site_visit",
        msg: `Site visit for ${projectName} on ${form.date} at ${form.time}. ${form.message || ""}`,
      };
      const res = await submitLead(payload);
      if (res?.status === "success" || res?.ok || res?.body?.ok) {
        setDone(true);
        onBooked?.();
        setTimeout(() => {
          setDone(false);
          onClose?.();
        }, 1100);
      }
    } catch (err) {
      console.error(err);
      alert("Could not submit. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Solid premium panel with gradient border */}
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[var(--brand-gold,#c5a250)] to-sky-900 opacity-95" />
        <div className="relative rounded-2xl bg-white p-6 shadow-xl">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div
                className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                style={{
                  background:
                    "linear-gradient(90deg, var(--brand-gold,#c5a250), rgba(245,186,77,1), rgb(12,74,110))",
                  boxShadow: "0 6px 16px rgba(0,0,0,.15)",
                }}
              >
                Organize a site visit
              </div>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {projectName}
              </h3>
              <p className="mt-0.5 text-sm text-slate-600">
                We’ll confirm your slot over call/WhatsApp.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form className="mt-4 space-y-4" onSubmit={submit}>
            {/* Date & time row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Preferred date
                </label>
                <input
                  type="date"
                  className="input"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Preferred time
                </label>
                <input
                  type="time"
                  className="input"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
            </div>

            {/* Contact row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Name
                </label>
                <input
                  className="input"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Phone
                </label>
                <input
                  className="input"
                  type="tel"
                  placeholder="+91"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Optional row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Email (optional)
                </label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  City (optional)
                </label>
                <input
                  className="input"
                  placeholder="Gurugram / Delhi / Noida"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Notes (optional)
              </label>
              <textarea
                className="input"
                rows={3}
                placeholder="Any preferences or timing constraints"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            {/* Actions */}
            <div className="mt-1 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline w-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gold w-full"
                disabled={busy}
              >
                {busy ? "Booking..." : done ? "Booked ✓" : "Confirm visit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
