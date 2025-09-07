"use client";

import Link from "next/link";
import projects from "@/data/projects.json";

export default function FeaturedProjects({ cardClass = "" }) {
  const featured = projects.filter((p) => p.featured);

  if (!featured.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-600">
        No featured projects at the moment.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((p) => {
        const cr = (Number(p.priceNumeric || 0) / 100).toFixed(2);
        return (
          <article
            key={p.id}
            className={`group card card-hover overflow-hidden ${cardClass}`}
          >
            {/* IMAGE */}
            <div className="relative h-56 w-full overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              {/* badges */}
              {p.status && (
                <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
                  {p.status}
                </span>
              )}
              {p.possession && (
                <span className="absolute left-2 bottom-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
                  Possession: {p.possession}
                </span>
              )}
              {p.priceNumeric && (
                <span className="absolute right-2 bottom-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
                  ₹ {cr} Cr onwards
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-5">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              {p.location && (
                <p className="mt-1 text-sm text-gray-600">{p.location}</p>
              )}

              {/* tags */}
              {p.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* actions */}
              <div className="mt-5 flex items-center justify-between">
                <Link
                  href={`/projects/${p.id}`}
                  className="text-sm font-medium text-teal-700 hover:text-teal-900"
                >
                  View details →
                </Link>
                <a
                  href="#enquire"
                  className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-black"
                >
                  Enquire
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
