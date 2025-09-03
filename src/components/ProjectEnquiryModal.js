"use client";
import { useState } from "react";
import { submitLead } from "@/lib/submitLead";
import Notification from "@/components/Notification";

export default function ProjectEnquiryModal({ isOpen, onClose, mode }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      name: e.target.name?.value || "",
      email: e.target.email?.value || "",
      phone: e.target.phone?.value || "",
      project: mode === "sitevisit" ? "Organize Site Visit" : "Project Enquiry",
    };

    const res = await submitLead(formData);

    if (res.success) {
	  setMessage("✅ Enquiry submitted successfully!");
	  onClose();
	  e.target.reset?.();
	  if (onSuccess) onSuccess();   // 🔹 trigger success for StickyCTA
	} else {
	  setMessage("❌ Failed to submit enquiry!");
	}

    setLoading(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            ✖
          </button>

          <h2 className="text-xl font-bold mb-4">
            {mode === "sitevisit" ? "Organize Site Visit" : "Enquiry Form"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode !== "sitevisit" && (
              <textarea
                name="message"
                placeholder="Your Message"
                rows="3"
                className="w-full border rounded p-2"
              ></textarea>
            )}

            {/* Site Visit requires basic info */}
            {mode === "sitevisit" && (
              <>
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full border rounded p-2"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  required
                  className="w-full border rounded p-2"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Your Phone"
                  required
                  className="w-full border rounded p-2"
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <Notification message={message} onClose={() => setMessage("")} />
    </>
  );
}
