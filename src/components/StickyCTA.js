"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ContactForm from "./ContactForm";
import ProjectEnquiryModal from "./ProjectEnquiryModal";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";

export default function StickyCTA() {
  const pathname = usePathname();
  const [modalType, setModalType] = useState(null);

  // Hide CTAs on Contact page
  if (pathname === "/contact") return null;

  // Check if we are on a project detail page (/projects/[id])
  const isProjectDetail = pathname.startsWith("/projects/");

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed right-4 top-1/3 flex flex-col gap-3 z-50">
        {/* Request Callback */}
        <button
          onClick={() => setModalType("callback")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300"
          title="Request a Callback"
        >
          <FaPhoneAlt size={22} />
        </button>

        {/* WhatsApp */}
        <a
          href="https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%20am%20interested%20in%20your%20projects"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp size={24} />
        </a>

        {/* Organize Site Visit (only project detail pages) */}
        {isProjectDetail && (
          <button
            onClick={() => setModalType("sitevisit")}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300"
            title="Organize Site Visit"
          >
            <MdEventAvailable size={24} />
          </button>
        )}
      </div>

      {/* Modal Logic */}
      {modalType === "callback" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[95%] max-w-md relative">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">Request a Callback</h2>
            <ContactForm />
          </div>
        </div>
      )}

      {modalType === "sitevisit" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[95%] max-w-md relative">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">Organize a Site Visit</h2>
            <ProjectEnquiryModal mode="sitevisit" />
          </div>
        </div>
      )}
    </>
  );
}
