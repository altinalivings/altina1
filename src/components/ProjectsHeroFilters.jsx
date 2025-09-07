"use client";
import { useMemo, useState } from "react";

/**
 * Glass filter panel for Projects hero.
 * Props (all optional):
 *  - types: string[]          e.g. ["Apartment","Villa","Office"]
 *  - locations: string[]      e.g. ["Gurugram","Noida","Delhi"]
 *  - onSubmit: (filters) => void   // hook up later to filter the grid
 */
export default function ProjectsHeroFilters({
  types = ["Any", "Apartment", "Villa", "Office", "Retail"],
  locations = ["Anywhere", "Gurugram", "Noida", "Delhi NCR"],
  onSubmit,
}) {
  const [type, setType] = useState("Any");
  const [loc, setLoc] = useState("Anywhere");
  const [min, setMin] = useState("0");
  const [max, setMax] = useState("950");
  const [q, setQ] = useState("");

  const canSubmit = useMemo(() => true, []);

  const reset = () => {
    setType("Any");
    setLoc("Anywhere");
    setMin("0");
    setMax("950");
    setQ("");
    // Optional: notify parent
    onSubmit?.({ type: "Any", loc: "Anywhere", min: "0", max: "950", q: "" });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.({ type, loc, min, max, q });
    // For now it's a visual UI; parent can hook to filter later
  };

  return (
    <div className="pointer-events-auto mx-auto w-[92%] max-w-5xl">
      <div className="rounded-2xl border border-white/35 bg-white/12 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,.35)]">
        <div className="grid gap-3 p-4 sm:p-5">
          {/* Row: labels */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <LabelChip>Property Type</LabelChip>
            <LabelChip>Location</LabelChip>
            <LabelChip>Budget Min (₹ Lakhs)</LabelChip>
            <LabelChip>Budget Max (₹ Lakhs)</LabelChip>
            <LabelChip>Search</LabelChip>
          </div>

          {/* Row: fields */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {/* Type */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="glass-input"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Location */}
            <select
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="glass-input"
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            {/* Min */}
            <input
              value={min}
              onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              inputMode="numeric"
              className="glass-input"
            />

            {/* Max */}
            <input
              value={max}
              onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))}
              placeholder="950"
              inputMode="numeric"
              className="glass-input"
            />

            {/* Search */}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Project / developer / keyword"
              className="glass-input"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-teal-200/70 bg-transparent px-4 py-2 text-sm font-semibold text-white/95 hover:bg-white/10"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-teal-600"
            >
              Show Projects
            </button>
          </div>
        </div>
      </div>

      {/* local styles for the “glass” inputs + labels */}
      <style jsx>{`
        .glass-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.4);
          background: rgba(0, 0, 0, 0.35);
          color: #fff;
          padding: 0.55rem 0.75rem;
          outline: none;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        .glass-input:focus {
          box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.35); /* teal focus */
        }
      `}</style>
    </div>
  );
}

function LabelChip({ children }) {
  return (
    <span className="inline-block w-fit rounded-full bg-teal-700 px-3 py-1 text-[12px] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]">
      {children}
    </span>
  );
}
