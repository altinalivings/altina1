"use client";
import { useState } from "react";

export default function CallRequestModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // Try to post to an API route if the project has one
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "Request a Call" }),
      });
      if (!res.ok) throw new Error("No API route available");
      setDone(true);
    } catch (err) {
      // Fallback – open mail client
      const mailto = `mailto:info@altinalivings.com?subject=Request%20a%20Call%20from%20${encodeURIComponent(form.name)}&body=${encodeURIComponent(
        `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nMessage: ${form.message}`
      )}`;
      window.location.href = mailto;
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        <button onClick={onClose} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700" aria-label="Close">✕</button>
        <div className="px-6 pt-6 pb-5">
          <h3 className="text-lg font-semibold">Request a Call</h3>
          {!done ? (
            <form onSubmit={submit} className="mt-4 space-y-3 text-sm">
              <div>
                <label className="block mb-1">Name</label>
                <input name="name" value={form.name} onChange={update} required className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block mb-1">Phone</label>
                <input name="phone" value={form.phone} onChange={update} required className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={update} className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block mb-1">Message</label>
                <textarea name="message" rows={3} value={form.message} onChange={update} className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" disabled={submitting} className="w-full rounded-lg bg-amber-600 text-white py-2 hover:bg-amber-700 disabled:opacity-60">
                {submitting ? "Sending..." : "Send Request"}
              </button>
              <p className="text-[11px] text-gray-500">By submitting, you agree to our terms & privacy policy.</p>
            </form>
          ) : (
            <div className="mt-4 text-sm">
              <p>Thanks! We’ve received your request. We’ll contact you shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
