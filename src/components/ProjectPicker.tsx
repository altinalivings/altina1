// src/components/ProjectPicker.tsx
"use client";
import React from "react";

type Project = { id: string; name: string };
type Props = {
  open: boolean;
  projects?: Project[];
  onClose: () => void;
  onSelect: (p: Project) => void;
};

export default function ProjectPicker({
  open,
  projects = [],
  onClose,
  onSelect,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-16 mx-auto max-w-xl rounded-2xl border border-white/15 bg-neutral-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Select a project</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/15 px-2 py-1 text-sm"
          >
            Close
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="w-full rounded-lg border border-white/10 px-3 py-2 text-left hover:bg-white/5"
                onClick={() => onSelect(p)}
              >
                {p.name}
              </button>
            </li>
          ))}
          {!projects.length && (
            <li className="opacity-70 text-sm">No projects available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
