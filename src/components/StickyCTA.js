'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectEnquiryModal from '@/components/ProjectEnquiryModal';

export default function StickyCTA() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('callback'); // 'callback' or 'sitevisit'

  const openModal = (m) => { setMode(m); setOpen(true); };
  const closeModal = () => setOpen(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
        <motion.button
          onClick={() => openModal('callback')}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-2xl px-4 py-3 bg-black text-white shadow-xl hover:shadow-2xl"
        >
          Request a Call
        </motion.button>

        <motion.button
          onClick={() => openModal('sitevisit')}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-2xl px-4 py-3 bg-white text-black border shadow-xl hover:shadow-2xl"
        >
          Organize Site Visit
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <ProjectEnquiryModal mode={mode} onClose={closeModal} />
        )}
      </AnimatePresence>
    </>
  );
}
