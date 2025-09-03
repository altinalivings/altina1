"use client";
import { useState } from "react";
import ContactForm from "./ContactForm";

export default function ProjectEnquiryModal({ isOpen, onClose, mode = "callback" }) {
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSuccess = () => {
    // Close popup immediately
    onClose();
    // Show thank you toast
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative p-6 transform transition-all duration-300 animate-fade-in">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-semibold mb-4 text-center">
              {mode === "sitevisit" ? "Organize Site Visit" : "Request a Callback"}
            </h2>

            {/* Form or Auto-Submit */}
            {mode === "sitevisit" ? (
              <ContactForm
                mode="sitevisit"
                fields={["name", "email", "phone"]}
                onSuccess={handleSuccess}
              />
            ) : (
              <ContactForm mode="callback" onSuccess={handleSuccess} />
            )}
          </div>
        </div>
      )}

      {/* Thank You Toast */}
      {showThankYou && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up z-[100]">
          ✅ Thank you! We’ll get back to you shortly.
        </div>
      )}
    </>
  );
}
