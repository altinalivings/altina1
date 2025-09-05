// components/RequestCall.jsx
"use client";
import { useState } from "react";
import { submitLead, showToast } from "@/lib/submitLead";

export default function RequestCall({ buttonText = "Request a Call" }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

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
      const ok =
        (result && result.status === "success") ||
        (result && result.ok === true) ||
        (result && result.body && (result.body.status === "success" || result.body.ok === true));

      if (ok) {
        showToast({ text: "Thanks! Someone from our team will call you shortly.", type: "success" });
        setForm({ name: "", phone: "", email: "", message: "" });
        setOpen(false); // ✅ close modal after success
      } else {
        const msg =
          (result && (result.message || (result.body && (result.body.message || result.body.msg)))) ||
          "Submission failed";
        showToast({ text: `Failed: ${msg}`, type: "error" });
      }
    } catch (err) {
      console.error("RequestCall error", err);
      showToast({ text: "Failed to submit — please try again.", type: "error" });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* ✅ Only a button in floating area */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Request a Call"
        className="inline-flex items-center gap-2 px-3 py-2 rounded shadow"
        style={{
          background: "linear-gradient(90deg,#06b6d4,#0ea5a4)",
          color: "#fff",
          fontWeight: 600,
        }}
      >
        📞 {buttonText}
      </button>

      {/* ✅ Full form in centered modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[2147483647] p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h3 className="text-lg font-semibold mb-4">Request a Call</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Full name"
                required
                className="w-full p-2 border rounded"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="Phone"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email"
                required
                className="w-full p-2 border rounded"
              />
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Message (optional)"
                rows={4}
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                {sending ? "Submitting..." : "Confirm Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
