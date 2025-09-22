// src/components/CallbackModal.tsx
"use client";

import { useState } from "react";
import EnquiryForm from "@/components/EnquiryForm";

type Props = {
  projectName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  source?: string;
};

export default function CallbackModal({
  projectName,
  open: controlledOpen,
  onOpenChange,
  source,
}: Props) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = typeof controlledOpen === "boolean";
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v);
    if (!isControlled) setUncontrolledOpen(v);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 text-white/70 hover:text-white"
        >
          ✕
        </button>
        <h3 className="text-xl font-semibold mb-3">Request a callback</h3>
        {/* Removed onSubmitted prop to satisfy current EnquiryForm types */}
        <EnquiryForm mode="callback" projectName={projectName || ""} />
      </div>
    </div>
  );
}
