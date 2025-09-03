"use client";

import { useState } from "react";
import { submitLead } from "@/lib/submitLead";

export default function ProjectEnquiryModal({ project, onClose }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
      project: project || "Project Enquiry",
      utm_source: sessionStorage.getItem("utm_source") || "",
      utm_campaign: sessionStorage.getItem("utm_campaign") || "",
      utm_medium: sessionStorage.getItem("utm_medium") || "",
      utm_term: sessionStorage.getItem("utm_term") || "",
      utm_content: sessionStorage.getItem("utm_content") || "",
    };

    const result = await submitLead(formData);

    if (result.result === "success") {
      setSubmitted(true); // ✅ just show a success message inside modal
    } else {
      setError("❌ Failed to submit. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✖
        </button>

        {submitted ? (
          <p className="text-green-600 text-center font-bold">
            ✅ Thank you! We’ll contact you soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-600">{error}</p>}

            <input type="text" name="name" placeholder="Your Name" required className="w-full p-3 border rounded" />
            <input type="email" name="email" placeholder="Your Email" required className="w-full p-3 border rounded" />
            <input type="tel" name="phone" placeholder="Your Phone" required className="w-full p-3 border rounded" />
            <textarea name="message" placeholder="Message" rows="4" className="w-full p-3 border rounded"></textarea>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
            >
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
