// src/app/projects/projects-client.tsx
"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import projects from "@/data/projects";
import FloatingCTAs from "@/components/FloatingCTAs";
import ProjectsExplorer from "@/components/ProjectsExplorer";
// ⬇️ use the same hero component as detail pages
import ProjectHeroWithInfo from "@/components/ProjectHeroWithInfo";

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

const COMMERCIAL_KEYS = ["commercial","office","retail","shop","sco","cowork","co-work","business","showroom"];
const RESIDENTIAL_KEYS = ["residential","apartment","residence","residences","flat","villa","villas","plot","plots","bungalow","row","condo","homes","housing"];

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

      {/* Full-bleed wrapper so hero spans extreme left → right, even inside containers */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <ProjectHeroWithInfo
          id="projects-index"
          name="Projects"
          configuration="Search across launches in Delhi-NCR"
          // You can provide a banner here; if omitted, component falls back to /fallbacks/hero-fallback.jpg
          hero="/hero/projects.jpg"   // or /hero/projects.webp
		  
          // images={["/hero/projects.webp"]} // (optional) this takes precedence over `hero`
        />
      </div>

      {/* Filters card pulled up over hero */}
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
