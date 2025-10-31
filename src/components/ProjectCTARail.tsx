// src/components/ProjectCTARail.tsx
"use client";

import { useCallback } from "react";

type Mode = "callback" | "visit" | "brochure";

export default function ProjectCTARail({ project }: { project: any }) {
  const projectId = project?.id || project?.projectId || "";
  const projectName = project?.name || project?.projectName || "";

  const openLead = useCallback(
    (mode: Mode) => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("lead:open", { detail: { mode, projectId, projectName } })
        );
      }
    },
    [projectId, projectName]
  );

  return (
    <aside className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
      {/* 🗓️ Organize a Visit */}
      <button
        type="button"
        onClick={() => openLead("visit")}
        className="btn btn-gold"
        aria-label="Organize a Visit"
      >
        Organize a Visit
      </button>

      {/* 📞 Request a Call */}
      {/* <button type="button\" onClick={() => openLead('callback')} className="btn btn-emerald">Request a Call</button> */}
      <button
        type="button"
        onClick={() => openLead("callback")}
        className="btn btn-emerald"
        aria-label="Request a Call"
      >
        Request a Call
      </button>

      {/* 🧾 Download Brochure (only if available) */}
      {project?.brochure && (
        <button
          type="button"
          onClick={() => openLead("brochure")}
          className="btn btn-gold"
          aria-label="Download Brochure"
        >
          Download Brochure
        </button>
      )}
    </aside>
  );
}