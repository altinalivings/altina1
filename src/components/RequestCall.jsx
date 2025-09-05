// components/RequestCall.jsx (portal version)
"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { submitLead, showToast } from "@/lib/submitLead";

export default function RequestCall({ buttonText = "Request a Call" }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function onChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    const payload = {
      name: (form.name || "").trim(),
      phone: (form.phone || "").trim(),
      email: (form.email || "").trim().toLowerCase(),
      message: (form.message || "").trim(),
      source: "request_call",
      page: typeof window !== "undefined" ? window.location.pathname : "",
    };
    try {
      const result = await submitLead(payload);
      const ok = (result && result.status === "success") || (result && result.ok === true) || (result && result.body && (result.body.status === "success" || result.body.ok === true));
      if (ok) {
        showToast({ text: "Thanks! Someone from our team will call you shortly.", type: "success" });
        setForm({ name: "", phone: "", email: "", message: "" });
        setOpen(false);
      } else {
        const msg = (result && (result.message || (result.body && (result.body.message || result.body.msg)))) || "Submission failed";
        showToast({ text: `Failed: ${msg}`, type: "error" });
      }
    } catch (err) {
      console.error("RequestCall error", err);
      showToast({ text: "Failed to submit — please try again.", type: "error" });
    } finally {
      setSending(false);
    }
  }

  // Modal markup
  const modal = (
    <div role="dialog" aria-modal="true" style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.45)",
      zIndex: 2147483648,
      padding: 20,
    }}>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", width: "100%", maxWidth: 520, padding: 20, position: "relative" }}>
        <button onClick={() => setOpen(false)} aria-label="Close" style={{ position: "absolute", right: 12, top: 12, border: "none", background: "transparent", cursor: "pointer", fontSize: 18 }}>✖</button>
        <h3 style={{ margin: "0 0 12px 0" }}>Request a Call</h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <input name="name" value={form.name} onChange={onChange} placeholder="Full name" required style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" required style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          <input type="email" name="email" value={form.email} onChange={onChange} placeholder="Email" required style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          <textarea name="message" value={form.message} onChange={onChange} placeholder="Message (optional)" rows={4} style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={sending} style={{ flex: 1, padding: 12, borderRadius: 8, border: "none", background: "#10b981", color: "#fff", cursor: "pointer" }}>{sending ? "Submitting..." : "Confirm Request"}</button>
            <button type="button" onClick={() => setOpen(false)} style={{ padding: 12, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Request a Call" className="inline-flex items-center gap-2 px-3 py-2 rounded shadow" style={{ background: "linear-gradient(90deg,#06b6d4,#0ea5a4)", color: "#fff", fontWeight: 600 }}>
        📞 {buttonText}
      </button>

      {mounted && open && createPortal(modal, document.body)}
    </>
  );
}
