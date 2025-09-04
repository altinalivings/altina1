"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import projects from "@/data/projects.json";
import Link from "next/link";

function Grid({ filter }) {
  const list = useMemo(() => {
    const items = Array.isArray(projects) ? projects : [];
    if (!filter || filter === "all") return items;
    const f = filter.toLowerCase();
    return items.filter(p =>
      (p.type || "").toLowerCase() === f ||
      (p.developer || "").toLowerCase() === f
    );
  }, [filter]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map(p => (
        <Link key={p.id} href={`/projects/${p.id}`} className="block border rounded-lg p-4 hover:shadow">
          <div className="font-semibold mb-1">{p.title}</div>
          <div className="text-sm text-gray-600">{p.location} • {(p.developer||"")}</div>
        </Link>
      ))}
    </div>
  );
}

export default function ProjectsClient() {
  const searchParams = useSearchParams();
  const initial = (searchParams?.get("developer") || "all").toLowerCase();
  const [filter, setFilter] = useState(initial);

  return (
    <Suspense fallback={<div className="p-6">Loading projects…</div>}>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex gap-2 items-center">
            <label htmlFor="filter" className="text-sm text-gray-700">Filter:</label>
            <select id="filter" value={filter} onChange={e=>setFilter(e.target.value)} className="border rounded px-2 py-1">
              <option value="all">All</option>
              <option value="dlf">DLF</option>
              <option value="m3m group">M3M Group</option>
              <option value="godrej">Godrej</option>
              <option value="commercial">Commercial</option>
              <option value="residential">Residential</option>
            </select>
          </div>
          <Grid filter={filter} />
        </div>
      </section>
    </Suspense>
  );
}
