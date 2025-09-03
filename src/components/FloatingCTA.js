"use client";

import { useState } from "react";
import ProjectEnquiryModal from "./ProjectEnquiryModal";
import { FaPhone, FaWhatsapp, FaCalendarAlt } from "react-icons/fa";

export default function FloatingCTA() {
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {/* Request Callback */}
        <button
          onClick={() => openModal("Request Callback")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <FaPhone /> Call Us
        </button>

        {/* WhatsApp */}
        <a
          href="https://wa.me/919891234195" // 🔹 replace with your number
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
        >
          <FaWhatsapp /> WhatsApp
        </a>

        {/* Organize Site Visit */}
        <button
          onClick={() => openModal("Site Visit")}
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800"
        >
          <FaCalendarAlt /> Site Visit
        </button>
      </div>

      {modalType && (
        <ProjectEnquiryModal source={modalType} onClose={closeModal} />
      )}
    </>
  );
}
