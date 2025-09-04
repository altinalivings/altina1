"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProjectsClient({ projects }) {
  const router = useRouter();
  const sp = useSearchParams();

  const q = sp.get("q")?.toLowerCase() || "";
  const loc = sp.get("loc") || "";
  const type = sp.get("type") || "";

  const unique = (arr) => Array.from(new Set((arr || []).filter(Boolean))).sort();
  const locations = unique((projects || []).map(p => p.location));
  const types = unique((projects || []).map(p => p.type));

  const filtered = useMemo(() => {
    let list = Array.isArray(projects) ? projects : [];
    if (q) list = list.filter(p => (p.title || "").toLowerCase().includes(q) || (p.location || "").toLowerCase().includes(q));
    if (loc) list = list.filter(p => (p.location || "") === loc);
    if (type) list = list.filter(p => (p.type || "") === type);
    return list;
  }, [projects, q, loc, type]);

  function onChangeParam(name, value) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(name, value); else params.delete(name);
    router.push(`/projects?${params.toString()}`);
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:items-end mb-6">
        <div className="flex-1">
          <label className="block text-sm mb-1">Search</label>
          <input
            defaultValue={q}
            onKeyDown={(e) => {
              if (e.key === "Enter") onChangeParam("q", e.currentTarget.value.trim());
            }}
            placeholder="Search by name or location"
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Location</label>
          <select
            value={loc}
            onChange={(e) => onChangeParam("loc", e.target.value)}
            className="border rounded p-2 min-w-[180px]"
          >
            <option value="">All</option>
            {(locations || []).map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => onChangeParam("type", e.target.value)}
            className="border rounded p-2 min-w-[180px]"
          >
            <option value="">All</option>
            {(types || []).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => router.push("/projects")}
          className="px-4 py-2 rounded border"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(filtered || []).map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`} className="block border rounded-lg p-4 hover:shadow">
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">{p.location}</div>
            {p.type && <div className="mt-1 text-xs text-gray-500">{p.type}</div>}
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-gray-600">No projects found. Try different filters.</div>
        )}
      </div>
    </div>
  );
}
