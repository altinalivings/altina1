// src/components/UnifiedLeadDialog.tsx
"use client";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: "callback" | "visit" | "brochure";
  projectId?: string;
  projectName?: string;
  children?: React.ReactNode;
};

export default function UnifiedLeadDialog({
  open,
  onClose,
  mode = "callback",
  projectId,
  projectName,
  children,
}: Props) {
  if (!open) return null;

  const title =
    mode === "brochure"
      ? "Download Brochure"
      : mode === "visit"
      ? "Schedule a Visit"
      : "Request a Callback";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0B0C] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {(projectName || projectId) && (
              <p className="text-sm opacity-70">{projectName || projectId}</p>
            )}
          </div>
          <button
            type="button"
            className="px-2 py-1 rounded-md border border-white/10"
            onClick={onClose}
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
