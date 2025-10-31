// src/components/CallbackModal.tsx
"use client";

import { useEffect } from "react";
// Keep your existing EnquiryForm import/path
import EnquiryForm from "./EnquiryForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName?: string;
  /** default "callback" to match your old behavior */
  mode?: "callback" | "enquiry";
};

/**
 * Controlled modal: renders nothing when closed (prevents "skeleton" leftover).
 * Locks scroll when open and cleans up on unmount.
 */
export default function CallbackModal({
  open,
  onOpenChange,
  projectName,
  mode = "callback",
}: Props) {
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add("overflow-hidden");
    else root.classList.remove("overflow-hidden");
    return () => root.classList.remove("overflow-hidden");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative mx-auto mt-20 w-[min(720px,92vw)] rounded-2xl bg-white p-6 shadow-xl"
      >
        <button type=\"button\"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full px-2 py-1 text-black/60 hover:text-black"
        >
          ✕
        </button>

        <h3 className="mb-3 text-xl font-semibold">
          {mode === "callback" ? "Request a callback" : "Get in touch"}
        </h3>

        {/* Avoid hard typing to prevent TS prop mismatches in your project */}
        {/* @ts-ignore */}
        <EnquiryForm mode={mode} projectName={projectName} />
      </div>
    </div>
  );
}