"use client";
import { useState } from "react";
import ProjectEnquiryModal from "./ProjectEnquiryModal";
import { usePathname } from "next/navigation";

export default function StickyCTA() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("callback");
  const pathname = usePathname();

  // Hide on contact page
  if (pathname.startsWith("/contact")) return null;

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {/* Request Callback */}
        <button
          onClick={() => {
            setMode("callback");
            setModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition flex items-center gap-2"
        >
          📞 Request Callback
        </button>

        {/* WhatsApp */}
        <a
          href="https://wa.me/919999999999?text=Hi%20Altina%20Livings%20Team!"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-lg transition flex items-center gap-2"
        >
          💬 Chat on WhatsApp
        </a>
      </div>

      {/* Modal */}
      <ProjectEnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={mode}
      />
    </>
  );
}
