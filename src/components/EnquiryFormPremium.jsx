"use client";

import { useState } from "react";

function Field({ name, label, type="text", placeholder="", icon=null, children }) {
  return (
    <div className="relative">
      {icon ? <div className="pointer-events-none absolute left-3 top-2.5 text-gray-400">{icon}</div> : null}
      <input
        name={name}
        type={type}
        placeholder=" "
        className={`peer w-full rounded-xl border border-gray-300 bg-white/90 px-3 py-2 pl-${icon ? "9" : "3"} text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-brand-gold/40`}
        required={name === "name" || name === "phone"}
        aria-label={label}
      />
      <label className="pointer-events-none absolute left-3 top-2.5 block origin-left -translate-y-0.5 transform bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:text-[11px] peer-focus:text-brand-gold/90">
        {label}
      </label>
    </div>
  );
}

export default function EnquiryFormPremium({ projectTitle="", projectId="" }) {
  const [submitting, setSubmitting] = useState(false);
  const [wa, setWa] = useState(true);

  return (
    <form
      className="rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-black/5 transition focus-within:shadow-[0_10px_25px_rgba(197,162,80,0.18)] focus-within:ring-[#c5a250]"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const form = e.currentTarget;
        const payload = {
          name: form.name.value || "",
          phone: form.phone.value || "",
          email: form.email.value || "",
          need: form.need.value || "",
          msg: form.msg.value || "",
          project: projectTitle || projectId || "",
          whatsapp_optin: wa ? "yes" : "no",
          page: typeof window !== "undefined" ? window.location.href : "",
          source: "website",
          mode: process.env.NODE_ENV,
        };

        try {
          await fetch("https://script.google.com/macros/s/AKfycbyaT79B9lI8SQRKMT92dxvJGBIHvuV1SOhjCszEocDUqqkwdnOYmI9pG5bhfBfXdf8H2g/exec", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          try { window.trackLead && window.trackLead(); } catch {}
          alert("✅ Thank you! We will contact you shortly.");
          form.reset();
        } catch (err) {
          console.error(err);
          alert("❌ Something went wrong. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <input type="hidden" name="project" value={projectTitle || projectId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="name"
          label="Full Name"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" stroke="currentColor" strokeWidth="1.6"/></svg>}
        />
        <Field
          name="phone"
          label="Phone"
          type="tel"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.1 12.81 19.79 19.79 0 0 1 .03 4.18 2 2 0 0 1 2 2h3a2 2 0 0 1 2 1.72c.12.9.3 1.78.54 2.63a2 2 0 0 1-.45 2.11L6.1 9.91a16 16 0 0 0 8 8l1.45-1.45a2 2 0 0 1 2.11-.45c.85.24 1.73.42 2.63.54A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="1.6"/></svg>}
        />
        <div className="sm:col-span-2">
          <Field name="email" label="Email (optional)" type="email" />
        </div>

        <div className="sm:col-span-2">
          <div className="relative">
            <select
              name="need"
              className="peer w-full rounded-xl border border-gray-300 bg-white/90 px-3 py-2 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-brand-gold/40"
              defaultValue=""
              aria-label="Looking for"
            >
              <option value="" disabled>Choose requirement</option>
              <option>3 BHK</option>
              <option>4+ BHK</option>
              <option>Villa</option>
              <option>Office / Retail</option>
            </select>
            <span className="pointer-events-none absolute left-3 top-2.5 text-xs text-gray-500 peer-focus:text-brand-gold/90">
              Looking for
            </span>
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="relative">
            <textarea
              name="msg"
              rows={4}
              placeholder=" "
              className="peer w-full rounded-xl border border-gray-300 bg-white/90 px-3 py-2 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-brand-gold/40"
              aria-label="Message"
            />
            <label className="pointer-events-none absolute left-3 top-2.5 block origin-left -translate-y-0.5 transform bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:text-[11px] peer-focus:text-brand-gold/90">
              Message
            </label>
          </div>
        </div>
      </div>

      {/* WhatsApp opt-in & submit */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={wa} onChange={() => setWa(!wa)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-400" />
          Contact me on WhatsApp
        </label>

        <button type="submit" disabled={submitting} className="btn-gold w-full sm:w-auto disabled:opacity-60">
          {submitting ? "Submitting..." : "Request Shortlist"}
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-gray-500">
        By submitting, you agree to our Privacy Policy.
      </p>
    </form>
  );
}
