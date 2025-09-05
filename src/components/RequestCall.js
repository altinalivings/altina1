// components/RequestCall.jsx
"use client";
import { useState } from "react";
import { submitLead, showToast } from "@/lib/submitLead"; // adjust import path

export default function RequestCall({ initialPhone = "" }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: initialPhone });

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRequestCall(e) {
    e?.preventDefault?.();
    if (sending) return;
    setSending(true);

    const payload = {
      name: (form.name || "").trim(),
      phone: (form.phone || "").trim(),
      source: "request_call",
      page: typeof window !== "undefined" ? window.location.pathname : "",
    };

    try {
      const result = await submitLead(payload);
      const ok =
        (result && result.status === "success") ||
        (result && result.ok === true) ||
        (result && result.body && (result.body.status === "success" || result.body.ok === true));

      if (ok) {
        showToast({ text: "Thanks! Someone from our team will call you shortly.", type: "success" });
        setForm({ name: "", phone: "" });
        // Close modal immediately on success
        setOpen(false);
      } else {
        const msg = (result && (result.message || (result.body && (result.body.message || result.body.msg)))) || "Submission failed";
        showToast({ text: `Failed: ${msg}`, type: "error" });
      }
    } catch (err) {
      console.error("request-call error", err);
      showToast({ text: "Failed to submit — please try again.", type: "error" });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Compact button — container controls fixed positioning */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Request a Call"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          background: "linear-gradient(90deg,#06b6d4,#0ea5a4)",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          cursor: "pointer",
          fontWeight: 600,
          minWidth: 44,
        }}
      >
        📞 Request Call
      </button>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.45)",
            zIndex: 2147483648,
            padding: 20,
          }}
        >
          <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", width: "100%", maxWidth: 420, padding: 20, position: "relative" }}>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{ position: "absolute", right: 12, top: 12, border: "none", background: "transparent", cursor: "pointer", fontSize: 18 }}
            >
              ✖
            </button>

            <h3 style={{ margin: "0 0 12px 0" }}>Request a Call</h3>
            <form onSubmit={handleRequestCall} style={{ display: "grid", gap: 10 }}>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Full name"
                required
                style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="Phone"
                required
                style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="submit"
                  disabled={sending}
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", background: "#10b981", color: "#fff", cursor: "pointer" }}
                >
                  {sending ? "Sending..." : "Request Call"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
