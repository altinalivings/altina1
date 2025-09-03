"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function Toast({ show, message, type = "success", onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // auto-close after 3s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium
            ${type === "success" ? "bg-green-600" : "bg-red-600"}
          `}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
