"use client";
import ContactForm from "./ContactForm";

export default function ProjectEnquiryModal({ isOpen, onClose, mode = "callback", onSuccess }) {
  if (!isOpen) return null;

  return (
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

        {/* Form */}
        {mode === "sitevisit" ? (
          <ContactForm mode="sitevisit" fields={["name", "email", "phone"]} onSuccess={onSuccess} />
        ) : (
          <ContactForm mode="callback" onSuccess={onSuccess} />
        )}
      </div>
    </div>
  );
}
