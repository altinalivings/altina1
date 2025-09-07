"use client";

export default function ProjectFilterBar({
  type,
  setType,
  typeOptions = [],

  location,
  setLocation,
  locationOptions = [],

  min,
  setMin,
  max,
  setMax,

  q,
  setQ,

  onReset,
  onShare,
}) {
  return (
    <div
      className={[
        // Glass card
        "rounded-2xl border backdrop-blur-md shadow-2xl",
        "bg-white/10 border-white/15",
        // Text / spacing
        "text-white p-4 sm:p-5",
      ].join(" ")}
    >
      <div className="grid gap-3 md:grid-cols-12">
        {/* Property Type */}
        <div className="md:col-span-2">
          
           <label className="label-chip mb-1 block text-[11px] font-medium text-white/80">
            Property Type
          </label>
          
          <select
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/60"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {typeOptions.map((t) => (
              <option key={t} value={t} className="bg-gray-900 text-white">
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="md:col-span-2 ">
          
		  <label className="label-chip mb-1 block text-[11px] font-medium text-white/80">
            Location
          </label>
          <select
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white-white/60  focus:outline-none focus:ring-2 focus:ring-teal-400/60"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {locationOptions.map((loc) => (
              <option key={loc} value={loc} className="bg-gray-900 text-white">
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Min (₹ Lakhs) */}
        <div className="md:col-span-2">
          <label className="label-chip mb-1 block text-[11px] font-medium text-white/80">
            Budget Min (₹ Lakhs)
          </label>
          <input
            type="number"
            inputMode="numeric"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/60"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            min={0}
            placeholder="0"
          />
        </div>

        {/* Budget Max (₹ Lakhs) */}
        <div className="md:col-span-2">
          <label className="label-chip mb-1 block text-[11px] font-medium text-white/80">
            Budget Max (₹ Lakhs)
          </label>
          <input
            type="number"
            inputMode="numeric"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/60"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            min={0}
            placeholder="99999"
          />
        </div>

        {/* Search */}
        <div className="md:col-span-3">
          <label className="label-chip mb-1 block text-[11px] font-medium text-white/80">
            Search
          </label>
          <input
            type="text"
            placeholder="Project / developer / keyword"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400/60"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2 md:col-span-1">
          <button
            onClick={onReset}
            className="w-full rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Subtext to echo compliance/USP if needed */}
      <div className="mt-2 hidden text-[11px] text-white/70 sm:block">
        RERA Verified • 100% Transparent Process
      </div>
    </div>
  );
}
