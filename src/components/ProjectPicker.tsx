// src/components/ProjectPicker.tsx
"use client";
import React from "react";

type Project = { id: string; name: string };
type Props = {
  open: boolean;
  projects: Project[];
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
            className="px-2 py-1 rounded-md border border-white/10"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          {projects.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => onSelect(p)}
              className="text-left px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
