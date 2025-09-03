"use client";

import { useState } from "react";
import { submitLead } from "../lib/submitLead";

export default function ProjectEnquiryModal({ mode = "callback", onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = Object.fromEntries(new FormData(e.target).entries());

    const payload = {
      ...formData,
      mode,
      project: formData.project || "",
      utm_source: sessionStorage.getItem("utm_source") || "",
      utm_medium: sessionStorage.getItem("utm_medium") || "",
      utm_campaign: sessionStorage.getItem("utm_campaign") || "",
    };

    const res = await submitLead(payload);

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000); // 3s notification
      e.target.reset();
    } else {
      alert("❌ Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          {mode === "callback" ? "📞 Request a Callback" : "🏠 Organize a Site Visit"}
        </h2>

        {/* Success Notification */}
        {success && (
          <div className="mb-4 text-green-600 text-center font-medium">
            ✅ Thank you! We’ll contact you shortly.
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "callback" && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  name="message"
                  placeholder="Message (optional)"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </>
            )}

            {mode === "visit" && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
