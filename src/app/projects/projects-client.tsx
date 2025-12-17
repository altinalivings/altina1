// src/app/projects/projects-client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import projects from "@/data/projects";
import FloatingCTAs from "@/components/FloatingCTAs";
import ProjectsExplorer from "@/components/ProjectsExplorer";
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

const COMMERCIAL_KEYS = [
  "commercial",
  "office",
  "retail",
  "shop",
  "shops",
  "sco",
  "cowork",
  "co-work",
  "business",
  "showroom",
  "plaza",
  "mall",
];

const RESIDENTIAL_KEYS = [
  "residential",
  "apartment",
  "apartments",
  "residence",
  "residences",
  "flat",
  "flats",
  "villa",
  "villas",
  "plot",
  "plots",
  "bungalow",
  "row",
  "condo",
  "home",
  "homes",
  "housing",
  "floor",
  "floors",
];

function isCommercial(text: string) {
  const c = (text || "").toLowerCase();
  return COMMERCIAL_KEYS.some((k) => c.includes(k));
}

function isResidential(text: string) {
  const c = (text || "").toLowerCase();
  // Residential if it matches residential keywords OR if it is not clearly commercial
  return RESIDENTIAL_KEYS.some((k) => c.includes(k)) || !isCommercial(c);
}

export default function ProjectsClient() {
  const router = useRouter();
  const params = useSearchParams();

  const list = (projects as Project[]) || [];

  // Read URL params (source of truth on first render + when URL changes)
  const urlQ = (params.get("q") || "").trim();
  const urlCity = (params.get("city") || "").trim();
  const urlType = (params.get("type") || "").trim(); // "Residential" | "Commercial" | ""

  const [q, setQ] = useState(urlQ);
  const [city, setCity] = useState(urlCity);
  const [ptype, setPtype] = useState(urlType);

  // Keep state in sync if user uses back/forward or if URL changes externally
  useEffect(() => {
    setQ(urlQ);
    setCity(urlCity);
    setPtype(urlType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQ, urlCity, urlType]);

  const cityOptions = useMemo(() => {
    return Array.from(
      new Set(list.map((p) => (p.city || "").trim()).filter(Boolean))
    ).sort();
  }, [list]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();

    return list.filter((p) => {
      const text = [p.name, p.developer, p.location, p.configuration]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQ = !term || text.includes(term);

      const matchesCity =
        !city || (p.city || "").toLowerCase() === city.toLowerCase();

      let matchesType = true;
      if (ptype === "Commercial") matchesType = isCommercial(text);
      else if (ptype === "Residential") matchesType = isResidential(text);

      return matchesQ && matchesCity && matchesType;
    });
  }, [list, q, city, ptype]);

  function applyToUrl(next: { q?: string; city?: string; type?: string }) {
    const qs = new URLSearchParams();

    const nq = (next.q ?? q).trim();
    const nc = (next.city ?? city).trim();
    const nt = (next.type ?? ptype).trim();

    if (nq) qs.set("q", nq);
    if (nc) qs.set("city", nc);
    if (nt) qs.set("type", nt);

    const queryString = qs.toString();
    router.replace(queryString ? `/projects?${queryString}` : "/projects", {
      scroll: false,
    });
  }

  function clearAll() {
    setQ("");
    setCity("");
    setPtype("");
    router.replace("/projects", { scroll: false });
  }

  return (
    <>
      <FloatingCTAs projectId={null} projectName={null} />

      {/* Full-bleed wrapper so hero spans extreme left → right */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <ProjectHeroWithInfo
          id="projects-index"
          name="Projects"
          configuration="Search across launches in Delhi-NCR"
          hero="/hero/projects.jpg"
        />
      </div>

      {/* Filters card pulled up over hero */}
      <div className="mx-auto max-w-6xl px-4 -mt-8 relative z-10">
        <div className="golden-frame glow modal-surface rounded-2xl p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyToUrl({});
            }}
            className="grid gap-3 sm:grid-cols-6 items-center"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects, locations, developers…"
              aria-label="Search"
              className="sm:col-span-2 rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
            />

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="City"
              className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
            >
              <option value="" className="bg-[#0B0B0C] text-altina-ivory">
                City
              </option>
              {cityOptions.map((c) => (
                <option
                  key={c}
                  value={c}
                  className="bg-[#0B0B0C] text-altina-ivory"
                >
                  {c}
                </option>
              ))}
            </select>

            <select
              value={ptype}
              onChange={(e) => setPtype(e.target.value)}
              aria-label="Property Type"
              className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
            >
              <option value="" className="bg-[#0B0B0C] text-altina-ivory">
                Property Type
              </option>
              <option value="Residential" className="bg-[#0B0B0C] text-altina-ivory">
                Residential
              </option>
              <option value="Commercial" className="bg-[#0B0B0C] text-altina-ivory">
                Commercial
              </option>
            </select>

            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95"
            >
              Apply
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl px-5 py-2 text-sm font-semibold border border-altina-gold/40 text-altina-ivory hover:border-altina-gold/70"
            >
              Clear
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
