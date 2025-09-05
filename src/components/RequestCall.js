"use client";
import { useState } from "react";
import { submitLead, showToast } from "@/lib/submitLead"; // adjust path if needed

export default function RequestCall({ initialPhone = "" }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: initialPhone });

  function onChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleRequestCall(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const payload = {
        name: (form.name || "").trim(),
        phone: (form.phone || "").trim(),
        source: "request_call",
        page: typeof window !== "undefined" ? window.location.pathname : "",
      };
      const result = await submitLead(payload);
      const ok =
        (result && result.status === "success") ||
        (result && result.ok === true) ||
        (result && result.via === "fetch" && result.ok) ||
        (result && result.body && (result.body.status === "success" || result.body.ok === true));
      if (ok) {
        showToast({ text: "Thanks for your interest! Our team will call you shortly.", type: "success" });
        setForm({ name: "", phone: "" });
        setTimeout(() => setOpen(false), 900);
      } else {
        const msg = (result && (result.message || (result.body && (result.body.message || result.body.msg)))) || "Submission failed";
        showToast({ text: `Failed: ${msg}`, type: "error" });
      }
    } catch (err) {
      showToast({ text: "Failed to submit — please try again.", type: "error" });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn">Request a Call</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleRequestCall} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-3 relative">
            <button type="button" className="absolute top-3 right-3" onClick={() => setOpen(false)}>✖</button>
            <h3 className="text-lg font-semibold">Request a Call</h3>
            <input name="name" value={form.name} onChange={onChange} required placeholder="Full name" className="w-full p-2 border rounded" />
            <input name="phone" value={form.phone} onChange={onChange} required placeholder="Phone" className="w-full p-2 border rounded" />
            <button type="submit" disabled={sending} className="w-full bg-blue-600 text-white py-2 rounded">
              {sending ? "Sending..." : "Request Call"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
