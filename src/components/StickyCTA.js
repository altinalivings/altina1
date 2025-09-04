"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectEnquiryModal from "./ProjectEnquiryModal";
import { FaPhoneAlt, FaWhatsapp, FaCalendarCheck } from "react-icons/fa";

export default function StickyCTA({ showSiteVisit = false, projectName }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(null);

  // Disable CTA on contact page
  const [isContactPage, setIsContactPage] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsContactPage(window.location.pathname === "/contact");
    }
  }, []);

  if (isContactPage) return null;

  const openModal = (selectedMode) => {
    setMode(selectedMode);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setMode(null);
  };

  return (
    <>
      {/* Floating CTA Buttons */}
      <div className="fixed right-6 bottom-1/3 z-50 flex flex-col gap-4">
        <AnimatePresence>
          <motion.button
            key="callback"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            onClick={() => openModal("callback")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            <FaPhoneAlt />
            Request Callback
          </motion.button>

          <motion.a
            key="whatsapp"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            href="https://wa.me/919876543210" // 🔹 replace with your number
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-700 transition"
          >
            <FaWhatsapp />
            Chat on WhatsApp
          </motion.a>

          {showSiteVisit && (
            <motion.button
              key="sitevisit"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={() => openModal("sitevisit")}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-purple-700 transition"
            >
              <FaCalendarCheck />
              Organize Site Visit
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <ProjectEnquiryModal
            isOpen={modalOpen}
            onClose={closeModal}
            mode={mode}
            projectName={projectName}
          />
        )}
      </AnimatePresence>
    </>
  );
}
