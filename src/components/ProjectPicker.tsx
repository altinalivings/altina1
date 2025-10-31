"use client";
import { useEffect, useMemo, useState } from "react";
import projects from "@/data/projects.json";

export default function ProjectPicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (p: { id: string; name: string }) => void;
}) {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    try {
      const items = projects as any[];
      if (!q) return items;
      const s = q.toLowerCase();
      return items.filter(
        (p) => p.name.toLowerCase().includes(s) || (p.developer || "").toLowerCase().includes(s)
      );
    } catch {
      return [];
    }
  }, [q]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-16 mx-auto max-w-xl rounded-2xl border border-white/15 bg-neutral-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Select a project</h3>
          <button type=\"button\" onClick={onClose} className="text-sm opacity-80 hover:opacity-100">Close</button>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or developer…"
          className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"
        />

        <div className="mt-3 max-h-80 overflow-auto space-y-2">
          {list.map((p: any) => (
            <button type=\"button\"
              key={p.id}
              onClick={() => onPick({ id: p.id, name: p.name })}
              className="w-full text-left rounded-xl border border-white/10 px-3 py-2 hover:border-white/30"
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-neutral-400">{p.developer} • {p.location}</div>
            </button>
          ))}
          {!list.length && <div className="text-sm text-neutral-400">No projects found or projects.json missing.</div>}
        </div>
      </div>
    </div>
  );
}