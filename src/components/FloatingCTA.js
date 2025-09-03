"use client";

import { useState } from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import ProjectEnquiryModal from "./ProjectEnquiryModal";

export default function FloatingCTA() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="fixed right-4 top-1/3 flex flex-col gap-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          <FaPhoneAlt size={20} />
        </button>
        <a
          href="https://wa.me/919891234195"
          target="_blank"
          rel="noreferrer"
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
        >
          <FaWhatsapp size={20} />
        </a>
      </div>
      {open && <ProjectEnquiryModal onClose={() => setOpen(false)} source="Floating CTA" />}
    </div>
  );
}
