'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-2">
      <AnimatePresence initial={false}>
        {(toasts || []).map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`px-4 py-3 rounded-xl shadow-lg text-white ${t.variant==='error'?'bg-red-600':'bg-emerald-600'}`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
