// src/components/ProjectPickerDialog.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import projectsData from "@/data/projects";

export type Project = {
  id: string;
  name: string;
  location?: string;
  developer?: string;
  brochure?: string; // e.g., "/brochures/dlf-arbour.pdf"
  image?: string;
};

export default function ProjectPickerDialog({
  open,
  onClose,
  onSelect,
  mode, // "brochure" | "visit" | null
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (project: Project) => void;
  mode: "brochure" | "visit" | null;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const items = projectsData as Project[];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 30);
    return items.filter((p) =>
      [p.name, p.location, p.developer].some((v) => (v || "").toLowerCase().includes(q))
    );
  }, [items, query]);

  if (!open) return null;

  const heading =
    mode === "brochure"
      ? "Select a Project to View Brochure"
      : mode === "visit"
      ? "Select a Project to Organize a Visit"
      : "Select a Project";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-auto px-4">
        <div className="golden-frame glow modal-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">{heading}</h3>
            <button onClick={onClose} className="rounded-md border border-white/15 px-3 py-1 text-sm">
              Close
            </button>
          </div>

          <div className="mt-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, location, developer..."
              className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 outline-none focus:border-white/40"
            />
          </div>

          <div className="mt-4 max-h-80 overflow-auto divide-y divide-white/10">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="w-full text-left py-3 hover:bg-white/5 transition flex items-center gap-3"
              >
                <div className="h-12 w-16 rounded overflow-hidden border border-white/10 bg-white/5 shrink-0">
                  <img src={p.image || "/projects/placeholder.jpg"} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-neutral-400">{p.location || p.developer || "—"}</div>
                  {mode === "brochure" && p?.brochure ? (
                    <div className="text-[11px] text-emerald-300/80 mt-0.5">Brochure available</div>
                  ) : null}
                </div>
              </button>
            ))}
            {filtered.length === 0 && <div className="text-center text-neutral-400 py-10">No projects found.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
