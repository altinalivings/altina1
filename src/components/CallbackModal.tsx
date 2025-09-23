"use client";

import React from "react";
import dynamic from "next/dynamic";

const EnquiryForm = dynamic(() => import("./EnquiryForm"), { ssr: false });

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  projectName?: string | null;
  mode?: "callback" | "enquiry";
  source?: string;
};

export default function CallbackModal({
  open,
  onOpenChange,
  projectName = null,
  mode = "callback",
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 rounded-full bg-black/20 px-2.5 py-1 text-white hover:bg-black/40"
          >
            ✕
          </button>
          <h3 className="mb-4 text-xl font-semibold text-black/80">Request a callback</h3>
          {/* @ts-expect-error EnquiryForm might accept different modes */}
          <EnquiryForm
            mode={mode}
            projectName={projectName ?? undefined}
            onSubmitted={() => onOpenChange(false)}
          />
        </div>
      </div>
    </div>
  );
}
