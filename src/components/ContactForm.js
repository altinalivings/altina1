"use client";
import { useState } from "react";
import { submitLead, showToast } from "@/lib/submitLead";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  function onChange(e){ setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit(e){
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const payload = {
        name: (form.name || "").trim(),
        email: (form.email || "").trim().toLowerCase(),
        phone: (form.phone || "").trim(),
        message: (form.message || "").trim(),
        source: "contact_page",
        page: typeof window !== "undefined" ? window.location.pathname : "",
      };
      const result = await submitLead(payload);
      const ok =
        (result && result.status === "success") ||
        (result && result.ok === true) ||
        (result && result.via === "fetch" && result.ok) ||
        (result && result.body && (result.body.status === "success" || result.body.ok === true));
      if (ok) {
        showToast({ text: "Thank you! Someone from the team will get back to you at the earliest.", type: "success" });
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        const msg = (result && (result.message || (result.body && (result.body.message || result.body.msg)))) || "Submission failed";
        showToast({ text: `Failed: ${msg}`, type: "error" });
      }
    } catch {
      showToast({ text: "Submission failed — please try again later.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={form.name} onChange={onChange} placeholder="Full name" required className="w-full p-2 border rounded" />
      <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" required className="w-full p-2 border rounded" />
      <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" required className="w-full p-2 border rounded" />
      <textarea name="message" value={form.message} onChange={onChange} placeholder="Message (optional)" rows={4} className="w-full p-2 border rounded" />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? "Submitting..." : "Send Message"}
      </button>
    </form>
  );
}
