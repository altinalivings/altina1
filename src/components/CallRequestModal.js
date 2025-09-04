"use client";
import { useEffect, useMemo, useState } from "react";
import { getAttribution } from "@/lib/attribution";

export default function CallRequestModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [attrib, setAttrib] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // capture attribution once when modal opens
  useEffect(() => {
    if (open) setAttrib(getAttribution());
  }, [open]);

  // flatten keys you want to send/see as hidden fields (for debugging/QA)
  const hiddenFields = useMemo(
    () => ({
      // last-touch
      utm_source: attrib.utm_source || "",
      utm_medium: attrib.utm_medium || "",
      utm_campaign: attrib.utm_campaign || "",
      utm_term: attrib.utm_term || "",
      utm_content: attrib.utm_content || "",
      gclid: attrib.gclid || "",
      fbclid: attrib.fbclid || "",
      msclkid: attrib.msclkid || "",
      last_touch_ts: attrib.last_touch_ts || "",
      last_touch_page: attrib.last_touch_page || "",

      // first-touch
      first_touch_source: attrib.first_touch_source || "",
      first_touch_medium: attrib.first_touch_medium || "",
      first_touch_campaign: attrib.first_touch_campaign || "",
      first_touch_term: attrib.first_touch_term || "",
      first_touch_content: attrib.first_touch_content || "",
      first_touch_gclid: attrib.first_touch_gclid || "",
      first_touch_fbclid: attrib.first_touch_fbclid || "",
      first_touch_msclkid: attrib.first_touch_msclkid || "",
      first_landing_page: attrib.first_landing_page || "",
      first_landing_ts: attrib.first_landing_ts || "",

      // session & client
      session_id: attrib.session_id || "",
      ga_cid: attrib.ga_cid || "",
      referrer: attrib.referrer || "",
      language: attrib.language || "",
      timezone: attrib.timezone || "",
      viewport: attrib.viewport || "",
      screen: attrib.screen || "",
      device_type: attrib.device_type || "",
      userAgent: attrib.userAgent || "",
      page: attrib.page || "",
    }),
    [attrib]
  );

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess(false);

  try {
    const payload = {
      ...form,
      source: "Request a Call",
      ...hiddenFields, // already in your component
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json().catch(async () => ({ error: await res.text() }));
    if (!res.ok || !data?.ok) {
      throw new Error(data?.error || "Submission failed");
    }

    setSuccess(true);
    setForm({ name: "", phone: "", email: "", message: "" });
  } catch (err) {
    console.error(err);
    setError(err.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Request a Call Back</h2>

        {success ? (
          <div className="text-green-600">✅ Thank you! We’ll reach out soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* visible fields */}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            />

            {/* hidden analytics/UTM fields (handy for QA; also included in payload) */}
            {Object.entries(hiddenFields).map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v} readOnly />
            ))}

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-600 text-white py-2 rounded-lg hover:bg-gold-700 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
