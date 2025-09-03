"use client";
import { useState } from "react";
import ProjectEnquiryModal from "./ProjectEnquiryModal";

export default function StickyCTA() {
  const [modalOpen, setModalOpen] = useState(false);
  const [purpose, setPurpose] = useState("");

  return (
    <>
      <div className="fixed right-4 top-1/3 flex flex-col gap-3 z-50">
        <button
          onClick={() => { setPurpose("Request Callback"); setModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700"
        >
          📞 Request Callback
        </button>
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700"
        >
          💬 WhatsApp
        </a>
        <button
          onClick={() => { setPurpose("Organize Site Visit"); setModalOpen(true); }}
          className="bg-orange-600 text-white px-4 py-2 rounded shadow-md hover:bg-orange-700"
        >
          🏠 Organize Site Visit
        </button>
      </div>

      {modalOpen && (
        <ProjectEnquiryModal purpose={purpose} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
