"use client";
import { useState } from "react";
import { submitLead } from "@/lib/submitLead"; // adjust path if your project structure differs

export default function SiteVisitPopup({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // normalize & build payload
      const payload = {
        name: (formData.name || "").trim(),
        phone: (formData.phone || "").trim(),
        email: (formData.email || "").trim().toLowerCase(),
        source: "site_visit",
        project: project?.title || "General Enquiry",
        page: window.location.pathname || "",
      };

      // call the robust submitLead (uses hidden form -> iframe + postMessage, with fetch fallback)
      const result = await submitLead(payload);
      console.info("[sitevisit] submit result:", result);

      // determine success from multiple possible shapes
      const ok =
        (result && result.status === "success") ||
        (result && result.ok === true) ||
        (result && result.via === "fetch" && result.ok) ||
        (result && result.body && (result.body.status === "success" || result.body.ok === true)) ||
        (result && result.body && result.body.status === "success");

      if (ok) {
        setSuccess("✅ Your site visit request has been submitted!");
        setFormData({ name: "", phone: "", email: "" });
        // optionally close modal after a delay
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(null);
        }, 1600);
      } else {
        // try to extract message
        const msg =
          (result && (result.message || (result.body && (result.body.message || result.body.msg)))) ||
          "Submission failed";
        setError(`❌ Failed: ${msg}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(`❌ Failed: ${err && err.message ? err.message : String(err)}`);
    } finally {
      setLoading(false);
      // small debounce to avoid accidental immediate resubmits
      setTimeout(() => {
        setSubmitting(false);
      }, 400);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-1/3 bg-blue-600 text-white px-4 py-2 rounded-l-lg shadow-lg hover:bg-blue-700"
      >
        Organize Site Visit
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Book a Site Visit</h2>

            <form onSubmit={handleSubmit} className="space-y-4" id="siteVisitForm">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full p-3 border rounded"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full p-3 border rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full p-3 border rounded"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                {loading ? "Submitting..." : "Confirm Site Visit"}
              </button>
            </form>

            {/* Messages */}
            {success && <p className="text-green-600 mt-3">{success}</p>}
            {error && <p className="text-red-600 mt-3">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
