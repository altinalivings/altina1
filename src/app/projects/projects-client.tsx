"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import projects from "@/data/projects.json";
import FloatingCTAs from "@/components/FloatingCTAs";
import ProjectsExplorer from "@/components/ProjectsExplorer";

type Project = {
  id: string;
  name: string;
  developer?: string;
  location?: string;
  city?: string;
  configuration?: string;
  price?: string;
  hero?: string;
};

const COMMERCIAL_KEYS = ["commercial", "office", "retail", "shop", "sco", "cowork", "co-work", "business", "showroom"];
const RESIDENTIAL_KEYS = ["residential", "apartment", "residence", "residences", "flat", "villa", "villas", "plot", "plots", "bungalow", "row", "condo", "homes", "housing"];

function isCommercial(conf: string) {
  const c = conf.toLowerCase();
  return COMMERCIAL_KEYS.some((k) => c.includes(k));
}
function isResidential(conf: string) {
  const c = conf.toLowerCase();
  return RESIDENTIAL_KEYS.some((k) => c.includes(k)) || !isCommercial(c);
}

export default function ProjectsClient() {
  const list = (projects as Project[]) || [];
  const params = useSearchParams();
  const initialCity = (params.get("city") || "").trim();
  const initialType = (params.get("type") || "").trim();

  const [q, setQ] = useState(params.get("q") || "");
  const [city, setCity] = useState(initialCity);
  const [ptype, setPtype] = useState(initialType);

  const cityOptions = useMemo(
    () => Array.from(new Set(list.map((p) => (p.city || "").trim()).filter(Boolean))).sort(),
    [list]
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return list.filter((p) => {
      const conf = (p.configuration || "").toLowerCase();
      const matchesQ =
        !term ||
        (p.name || "").toLowerCase().includes(term) ||
        (p.developer || "").toLowerCase().includes(term) ||
        (p.location || "").toLowerCase().includes(term);
      const matchesCity = !city || (p.city || "").toLowerCase() === city.toLowerCase();
      let matchesType = true;
      if (ptype === "Commercial") matchesType = isCommercial(conf);
      else if (ptype === "Residential") matchesType = isResidential(conf);
      return matchesQ && matchesCity && matchesType;
    });
  }, [list, q, city, ptype]);

  return (
    <>
      <FloatingCTAs projectId={null} projectName={null} />

      {/* Hero */}
      <section className="relative h-[44vh] min-h-[360px] overflow-hidden">
        <img
          src="/hero/projects.jpg"
          alt="Projects"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-10">
          <div className="golden-frame modal-surface rounded-2xl p-5">
            <h1 className="text-3xl font-semibold">Projects</h1>
            <div className="golden-divider my-2" />
            <p className="mt-1 text-neutral-300">Search across launches in Delhi NCR</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="mx-auto max-w-6xl px-4 -mt-8 relative z-10">
        <div className="golden-frame glow modal-surface rounded-2xl p-4">
          <form action="/projects" method="get" className="grid gap-3 sm:grid-cols-5 items-center">
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects, locations, developers…"
              aria-label="Search"
              className="sm:col-span-2 rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
            />
            <select
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="City"
              className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
            >
              <option value="" className="bg-[#0B0B0C] text-altina-ivory">City</option>
              {cityOptions.map((c) => (
                <option key={c} value={c} className="bg-[#0B0B0C] text-altina-ivory">{c}</option>
              ))}
            </select>
            <select
              name="type"
              value={ptype}
              onChange={(e) => setPtype(e.target.value)}
              aria-label="Property Type"
              className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
            >
              <option value="" className="bg-[#0B0B0C] text-altina-ivory">Property Type</option>
              <option value="Residential" className="bg-[#0B0B0C] text-altina-ivory">Residential</option>
              <option value="Commercial" className="bg-[#0B0B0C] text-altina-ivory">Commercial</option>
            </select>
            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95"
            >
              Apply
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        <ProjectsExplorer items={filtered as any[]} hideFilters />
      </main>
    </>
  );
}