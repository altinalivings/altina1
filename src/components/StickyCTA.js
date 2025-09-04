"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectEnquiryModal from "./ProjectEnquiryModal";
import { PhoneCall, Calendar } from "lucide-react";

export default function StickyCTA() {
  const pathname = usePathname();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("callback");

  const isContactPage = pathname === "/contact";
  const isProjectDetail = pathname.startsWith("/projects/");

  const open = (mode) => {
    setModalMode(mode);
    setOpenModal(true);
  };

  return (
    <>
      {!isContactPage && (
        <div className="fixed right-6 bottom-1/3 z-50 flex flex-col gap-4">
          <AnimatePresence>
            <motion.button
              key="callback"
              initial={{ x: 120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 120, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => open("callback")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg shadow-lg"
            >
              <PhoneCall size={18} />
              Request Callback
            </motion.button>

            {isProjectDetail && (
              <motion.button
                key="sitevisit"
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 120, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                onClick={() => open("sitevisit")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-lg shadow-lg"
              >
                <Calendar size={18} />
                Organize Site Visit
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {openModal && (
          <ProjectEnquiryModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            mode={modalMode}
            project={isProjectDetail ? pathname.split("/").pop() : ""}
          />
        )}
      </AnimatePresence>
    </>
  );
}
