// src/components/ProjectPicker.tsx
"use client";

import { useMemo } from "react";
import projectsData from "@/data/projects.json";

type Project = {
  id: string;
  name: string;
  location?: string;
  brochure?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** Called when a user picks a project */
  onPick?: (p: Project) => void;
};

export default function ProjectPicker({ open, onClose, onPick }: Props) {
  const projects: Project[] = useMemo(
    () => (Array.isArray(projectsData) ? (projectsData as Project[]) : []),
    []
  );

  if (!open) return null;

  const choose = (p: Project) => {
    try {
      onPick?.(p); // notify parent (LeadBus sets selected project)
    } finally {
      onClose();   // close the picker either way
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-16 mx-auto max-w-xl rounded-2xl border border-white/15 bg-neutral-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Select a project</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-white/70 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => choose(p)}
              className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-left hover:bg-white/5"
            >
              <div>
                <div className="font-medium">{p.name}</div>
                {p.location ? (
                  <div className="text-xs text-white/60">{p.location}</div>
                ) : null}
              </div>
              <span className="text-xs text-white/60">Choose</span>
            </button>
          ))}
          {projects.length === 0 && (
            <div className="rounded-lg border border-white/10 px-3 py-4 text-sm text-white/70">
              No projects found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
