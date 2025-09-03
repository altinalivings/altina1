"use client";
import { useState } from "react";
import ProjectEnquiryModal from "@/components/ProjectEnquiryModal";
import Notification from "@/components/Notification";

export default function StickyCTA({ showSiteVisit = false }) {
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [siteVisitOpen, setSiteVisitOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-4 z-40">
        {/* Request Callback */}
        <button
          onClick={() => setCallbackOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          📞 Request Callback
        </button>

        {/* WhatsApp */}
        <a
          href="https://wa.me/919891234195?text=I%20am%20interested%20in%20Altina%20Livings"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition"
        >
          💬 Chat on WhatsApp
        </a>

        {/* Organize Site Visit (only on project details) */}
        {showSiteVisit && (
          <button
            onClick={() => setSiteVisitOpen(true)}
            className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition"
          >
            🏡 Organize Site Visit
          </button>
        )}
      </div>

      {/* Request Callback Modal */}
      {callbackOpen && (
        <ProjectEnquiryModal
          isOpen={callbackOpen}
          onClose={() => setCallbackOpen(false)}
          mode="callback"
          onSuccess={() => {
            setMessage("✅ Thank you! We will call you back soon.");
            setCallbackOpen(false);
          }}
        />
      )}

      {/* Site Visit Modal */}
      {siteVisitOpen && (
        <ProjectEnquiryModal
          isOpen={siteVisitOpen}
          onClose={() => setSiteVisitOpen(false)}
          mode="sitevisit"
          onSuccess={() => {
            setMessage("✅ Site visit request submitted!");
            setSiteVisitOpen(false);
          }}
        />
      )}

      {/* Global Notification */}
      <Notification message={message} onClose={() => setMessage("")} />
    </>
  );
}

