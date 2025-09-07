"use client";

import Link from "next/link";

export default function ProjectGrid({ projects = [] }) {
  if (!projects.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-600">
        No projects match these filters. Try broadening your search.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => {
        const cr = (Number(p.priceNumeric || 0) / 100).toFixed(2);
        return (
          <article key={p.id || p.name} className="card card-hover overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden rounded-md">
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
                loading="lazy"
              />
              {/* badges */}
              {p.status && (
                <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
                  {p.status}
                </span>
              )}
              {p.type && (
                <span className="absolute left-2 bottom-2 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                  {p.type}
                </span>
              )}
              {p.priceNumeric && (
                <span className="absolute right-2 bottom-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
                  ₹ {cr} Cr onwards
                </span>
              )}
            </div>

            <div className="mt-3">
              <h3 className="h3">{p.name}</h3>
              {p.location && <p className="text-sm text-gray-600">{p.location}</p>}
              {p.possession && (
                <p className="mt-1 text-xs text-gray-500">Possession: {p.possession}</p>
              )}
              {p.amenities?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.amenities.slice(0, 4).map((a) => (
                    <span key={a} className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
                      {a}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <Link href={`/projects/${p.id || ""}`} className="text-sm text-teal-700 hover:underline">
                Details →
              </Link>
              <div className="flex items-center gap-2">
                {p.mapLink && (
                  <a href={p.mapLink} target="_blank" className="text-xs underline text-gray-600 hover:text-gray-900">
                    Map
                  </a>
                )}
                <a href="#enquire" className="btn-primary text-xs">Enquire</a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
