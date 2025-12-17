// src/app/projects/projects-client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import projects from "@/data/projects";
import FloatingCTAs from "@/components/FloatingCTAs";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import ProjectHeroWithInfo from "@/components/ProjectHeroWithInfo";

type PropertyType = "Residential" | "Commercial" | "Mixed";

type Project = {
  id: string;
  name: string;
  developer?: string;
  location?: string;
  city?: string;
  configuration?: string;
  price?: string;
  hero?: string;
  propertyType?: PropertyType;
};

export default function ProjectsClient() {
  const router = useRouter();
  const params = useSearchParams();

  const list = (projects as Project[]) || [];

  /* --------------------------------------------
   * URL → STATE (single source of truth)
   * ------------------------------------------ */
  const urlQ = (params.get("q") || "").trim();
  const urlCity = (params.get("city") || "").trim();
  const urlType = (params.get("type") || "").trim() as PropertyType | "";

  const [q, setQ] = useState(urlQ);
  const [city, setCity] = useState(urlCity);
  const [ptype, setPtype] = useState<PropertyType | "">(urlType);

  // Sync state if URL changes (back/forward, shared links)
  useEffect(() => {
    setQ(urlQ);
    setCity(urlCity);
    setPtype(urlType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQ, urlCity, urlType]);

  /* --------------------------------------------
   * CITY OPTIONS
   * ------------------------------------------ */
  const cityOptions = useMemo(() => {
    return Array.from(
      new Set(list.map((p) => (p.city || "").trim()).filter(Boolean))
    ).sort();
  }, [list]);

  /* --------------------------------------------
   * FILTERED RESULTS (CORRECT LOGIC)
   * ------------------------------------------ */
  const filtered = useMemo(() => {
    const term = q.toLowerCase();

    return list.filter((p) => {
      const searchableText = [
        p.name,
        p.developer,
        p.location,
        p.configuration,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !term || searchableText.includes(term);

      const matchesCity =
        !city || (p.city || "").toLowerCase() === city.toLowerCase();

      let matchesType = true;

      if (ptype === "Residential") {
        matchesType =
          p.propertyType === "Residential" || p.propertyType === "Mixed";
      } else if (ptype === "Commercial") {
        matchesType =
          p.propertyType === "Commercial" || p.propertyType === "Mixed";
      }

      return matchesSearch && matchesCity && matchesType;
    });
  }, [list, q, city, ptype]);

  /* --------------------------------------------
   * URL UPDATE (NO PAGE RELOAD)
   * ------------------------------------------ */
  function applyToUrl() {
    const qs = new URLSearchParams();

    if (q.trim()) qs.set("q", q.trim());
    if (city.trim()) qs.set("city", city.trim());
    if (ptype) qs.set("type", ptype);

    const query = qs.toString();
    router.replace(query ? `/projects?${query}` : "/projects", {
      scroll: false,
    });
  }

  function clearAll() {
    setQ("");
    setCity("");
    setPtype("");
    router.replace("/projects", { scroll: false });
  }

  /* --------------------------------------------
   * RENDER
   * ------------------------------------------ */
  return (
    <>
      <FloatingCTAs projectId={null} projectName={null} />

      {/* HERO */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <ProjectHeroWithInfo
          id="projects-index"
          name="Projects"
          configuration="Explore Residential & Commercial launches across Delhi NCR"
          hero="/hero/projects.jpg"
        />
      </div>

      {/* FILTER BAR */}
      <div className="mx-auto max-w-6xl px-4 -mt-8 relative z-10">
        <div className="golden-frame glow modal-surface rounded-2xl p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyToUrl();
            }}
            className="grid gap-3 sm:grid-cols-6 items-center"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects, developers, locations…"
              className="sm:col-span-2 rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
            />

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory"
            >
              <option value="">City</option>
              {cityOptions.map((c) => (
                <option key={c} value={c} className="bg-[#0B0B0C]">
                  {c}
                </option>
              ))}
            </select>

            <select
              value={ptype}
              onChange={(e) => setPtype(e.target.value as PropertyType | "")}
              className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory"
            >
              <option value="">Property Type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>

            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad"
            >
              Apply
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl px-5 py-2 text-sm font-semibold border border-altina-gold/40 text-altina-ivory"
            >
              Clear
            </button>
          </form>
        </div>
      </div>

      {/* RESULTS */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        <ProjectsExplorer items={filtered as any[]} hideFilters />
      </main>
    </>
  );
}
