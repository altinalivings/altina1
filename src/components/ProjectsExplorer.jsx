"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectsList from "./ProjectsList";
import ProjectFilterBar from "./ProjectFilterBar";

/** Parse number-ish values safely (₹ Lakhs for price inputs) */
function toNum(v, fallback = 0) {
  if (v === null || v === undefined || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Read filters from URLSearchParams into a single object */
function readParams(sp) {
  return {
    type: sp.get("type") || "Any",
    location: sp.get("loc") || "Anywhere",
    min: toNum(sp.get("min"), 0),          // ₹ Lakhs
    max: toNum(sp.get("max"), 99999),      // ₹ Lakhs
    q: sp.get("q") || "",
  };
}

/** Build a normalized search string from state (only include non-defaults) */
function buildSearchString(state) {
  const p = new URLSearchParams();
  if (state.type && state.type !== "Any") p.set("type", state.type);
  if (state.location && state.location !== "Anywhere") p.set("loc", state.location);
  if (state.min !== 0) p.set("min", String(state.min));
  if (state.max !== 99999) p.set("max", String(state.max));
  if (state.q && state.q.trim()) p.set("q", state.q.trim());
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default function ProjectsExplorer({ items = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // derive locations/types
  const allLocations = useMemo(() => {
    const s = new Set();
    items.forEach((p) => p.location && s.add(p.location));
    return Array.from(s);
  }, [items]);

  const allTypes = useMemo(() => {
    const s = new Set();
    items.forEach((p) => (p.typology || p.type) && s.add(p.typology || p.type));
    return Array.from(s);
  }, [items]);

  // state from URL
  const initial = readParams(searchParams);
  const [type, setType] = useState(initial.type);
  const [location, setLocation] = useState(initial.location);
  const [min, setMin] = useState(initial.min);
  const [max, setMax] = useState(initial.max);
  const [q, setQ] = useState(initial.q);

  // keep state in sync if URL changes (shareable/bookmarkable)
  useEffect(() => {
    const urlState = readParams(searchParams);
    if (urlState.type !== type) setType(urlState.type);
    if (urlState.location !== location) setLocation(urlState.location);
    if (urlState.min !== min) setMin(urlState.min);
    if (urlState.max !== max) setMax(urlState.max);
    if (urlState.q !== q) setQ(urlState.q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // write state back to URL (without amenity)
  useEffect(() => {
    const current = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const next = buildSearchString({ type, location, min, max, q });
    if (next !== current) {
      router.replace(`/projects${next}`, { scroll: false });
    }
  }, [type, location, min, max, q, router, searchParams]);

  // filtering (no amenity condition)
  const filtered = useMemo(() => {
    return items.filter((p) => {
      const priceLakh = toNum(p.priceNumeric, NaN);

      const matchType =
        type === "Any" ||
        ((p.typology || p.type || "").toLowerCase() === type.toLowerCase());

      const matchLoc =
        location === "Anywhere" ||
        (p.location || "").toLowerCase() === location.toLowerCase();

      const matchPrice =
        (Number.isNaN(priceLakh) && min === 0) ||
        (!Number.isNaN(priceLakh) && priceLakh >= min && priceLakh <= max);

      const hay = `${p.name || ""} ${p.developer || ""} ${p.location || ""} ${
        p.typology || p.configuration || ""
      }`.toLowerCase();
      const matchQ = !q.trim() || hay.includes(q.trim().toLowerCase());

      return matchType && matchLoc && matchPrice && matchQ;
    });
  }, [items, type, location, min, max, q]);

  const reset = () => {
    setType("Any");
    setLocation("Anywhere");
    setMin(0);
    setMax(99999);
    setQ("");
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Sharable link copied!");
    } catch {}
  };

  return (
    <section className="space-y-6">
      <ProjectFilterBar
        type={type}
        setType={setType}
        typeOptions={["Any", ...allTypes]}
        location={location}
        setLocation={setLocation}
        locationOptions={["Anywhere", ...allLocations]}
        min={min}
        setMin={(v) => setMin(toNum(v, 0))}
        max={max}
        setMax={(v) => setMax(toNum(v, 99999))}
        q={q}
        setQ={setQ}
        onReset={reset}
        onShare={share}
      />

      {filtered.length > 0 ? (
        <ProjectsList items={filtered} />
      ) : (
        <div className="rounded-xl border p-6 text-center text-gray-600">
          No projects match your filters.{" "}
          <button onClick={reset} className="underline">Reset filters</button>
        </div>
      )}
    </section>
  );
}
