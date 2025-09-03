"use client";
import { useState } from "react";
import ContactForm from "./ContactForm";

export default function ProjectEnquiryModal({ isOpen, onClose, mode = "enquiry" }) {
  const [showThankYou, setShowThankYou] = useState(false);

  if (!isOpen && !showThankYou) return null;

  const handleSuccess = () => {
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      onClose();
    }, 3000); // hide thank you after 3s
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative p-6 animate-fade-in">
        {/* Close Button */}
        {!showThankYou && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
          >
            ✕
          </button>
        )}

        {/* Thank You State */}
        {showThankYou ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              ✅ Thank You!
            </h2>
            <p className="text-gray-700">
              Your enquiry has been received. We’ll get back to you shortly.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              {mode === "sitevisit" ? "Organize Site Visit" : "Project Enquiry"}
            </h2>
            <ContactForm mode={mode} onSuccess={handleSuccess} />
          </>
        )}
      </div>
    </div>
  );
}
