"use client";
import { useState } from "react";
import CallRequestModal from "./CallRequestModal";

export default function FloatingButtons() {
  const [modalOpen, setModalOpen] = useState(false);

  const waNumber = "918891234195"; // change if needed
  const waText = encodeURIComponent(
    "Hi Altina Livings, I'm interested in your projects."
  );

  return (
    <>
      {/* Floating action buttons */}
      <div className="fixed top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 z-[999]">
        {/* Request a Call */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-12 h-12 rounded-full bg-gold-600 text-white flex items-center justify-center shadow-lg hover:bg-gold-700"
          title="Request a Call Back"
        >
          📞
        </button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${waNumber}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:bg-green-700"
          title="Chat on WhatsApp"
        >
          💬
        </a>
      </div>

      {/* Popup form modal */}
      <CallRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
