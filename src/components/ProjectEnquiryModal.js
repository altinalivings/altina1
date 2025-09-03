"use client";

import { useState } from "react";
import { submitLead } from "../lib/submitLead";
import Toast from "./Toast";

export default function ProjectEnquiryModal({ open, onClose, mode, project }) {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const lead = Object.fromEntries(formData.entries());

    try {
      await submitLead({
        ...lead,
        project,
        type: mode === "sitevisit" ? "sitevisit" : "interested",
      });

      setToastMessage("✅ Thank you! We’ll contact you soon.");
      setToastType("success");
      setShowToast(true);

      e.target.reset();
      onClose(); // close modal
    } catch (error) {
      console.error(error);
      setToastMessage("❌ Something went wrong. Please try again.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          >
            ✖
          </button>

          <h2 className="text-xl font-semibold mb-4">
            {mode === "sitevisit" ? "Organize Site Visit" : "Request a Callback"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <input type="tel" name="phone" placeholder="Your Phone" required />

            {mode !== "sitevisit" && (
              <textarea name="message" placeholder="Message (optional)" />
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
