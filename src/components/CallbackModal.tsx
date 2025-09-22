// src/components/CallbackModal.tsx
"use client";

import { useEffect, useState } from "react";
import EnquiryForm from "@/components/EnquiryForm";

type CallbackModalProps = {
  projectName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  source?: string;
};

export default function CallbackModal({
  projectName,
  open,
  onOpenChange,
  source,
}: CallbackModalProps) {
  const [internalOpen, setInternalOpen] = useState<boolean>(!!open);

  useEffect(() => {
    if (typeof open === "boolean") setInternalOpen(open);
  }, [open]);

  // Support legacy "open-callback" custom event
  useEffect(() => {
    const h = () => setInternalOpen(true);
    window.addEventListener("open-callback", h as any);
    return () => window.removeEventListener("open-callback", h as any);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  if (!internalOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 grid place-items-center p-4">
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0B0C] p-6 text-[#F7F7F5]"
        data-source={source || undefined}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => handleOpenChange(false)}
          className="absolute right-3 top-3 text-white/70 hover:text-white"
        >
          ✕
        </button>
        <h3 className="text-xl font-semibold mb-3">Request a callback</h3>

        {/* NOTE: Spread-cast the extra prop so TypeScript stops complaining on Vercel */}
        <EnquiryForm
          mode="callback"
          projectName={projectName}
          {...({ onSubmitted: () => handleOpenChange(false) } as any)}
        />
      </div>
    </div>
  );
}
