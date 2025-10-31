// src/components/RelatedProjects.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import projectsData from "@/data/projects.json";

type Project = {
  id: string;
  name: string;
  brand?: string;
  developer?: string;
  city?: string;
  hero?: string;
  heroAlt?: string;
  featured?: boolean;
  featured_order?: number;
};

type Props = {
  currentId: string;
  projects?: Project[];
  developer?: string;
  city?: string;
};

// normalize strings for fuzzy matching (lowercase, strip brackets, punctuation, extra spaces)
function norm(s?: string) {
  return (s || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")  // remove parentheticals
    .replace(/[^a-z0-9\s]/g, " ") // remove punctuation
    .replace(/\s+/g, " ")
    .trim();
}

function includesToken(a?: string, b?: string) {
  const A = norm(a);
  const B = norm(b);
  if (!A || !B) return false;
  // token-level contains (so "dlf urban" includes "dlf")
  const tokensB = new Set(B.split(" "));
  return A.split(" ").some((t) => t && tokensB.has(t));
}

export default function RelatedProjects({
  currentId,
  projects,
  developer,
  city,
}: Props) {
  const source: Project[] = Array.isArray(projects)
    ? projects
    : (projectsData as Project[]);

  if (!Array.isArray(source) || !source.length) return null;

  const pool = source.filter((p) => p && p.id && p.id !== currentId && p.hero);

  // Score by similarity; prefer same developer/brand, then same city, then featured/order
  const devRef = developer;
  const brandRef = source.find((p) => p.id === currentId)?.brand;
  const cityRef = city;

  const scored = pool
    .map((p) => {
      let score = 0;

      // developer fuzzy match (e.g., "DLF (DLF Urban Pvt. Ltd.)" vs "DLF")
      if (includesToken(p.developer, devRef) || includesToken(devRef, p.developer)) score += 50;

      // brand fuzzy match
      if (includesToken(p.brand, brandRef) || includesToken(brandRef, p.brand)) score += 20;

      // city match (exact-ish after normalization)
      if (norm(p.city) && norm(p.city) === norm(cityRef)) score += 10;

      // featured gets a little boost
      if (p.featured) score += 5;

      // minor penalty if no hero (we filtered those out above anyway)
      if (!p.hero) score -= 1;

      // lower featured_order is better
      const orderBias = typeof p.featured_order === "number" ? (100 - Math.min(99, p.featured_order)) : 0;
      score += orderBias * 0.1;

      return { p, score };
    })
    .sort((a, b) => b.score - a.score);

  const items = scored.slice(0, 3).map((x) => x.p);
  if (!items.length) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <Link
          key={p.id}
          href={`/projects/${p.id}`}
          aria-label={`View details for ${p.name}`}
          className="group relative flex flex-col rounded-2xl border border-altina-gold/30 bg-gradient-to-b from-[#111] to-[#0b0b0b] p-4 shadow-md transition-all hover:border-altina-gold/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] min-h-[230px]"
        >
          {/* Image */}
          {p.hero && (
            <div className="relative mb-4 overflow-hidden rounded-xl aspect-[16/9]">
              <Image
                src={p.hero}
                alt={p.heroAlt || p.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          {/* Text */}
          <div className="flex flex-col flex-1 justify-between">
            <div>
              <h3 className="text-lg font-semibold text-altina-ivory transition group-hover:text-altina-gold">
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-altina-gold/70">
                {p.brand || p.developer || "Premium Developer"}
                {p.city ? ` • ${p.city}` : ""}
              </p>
            </div>

            <div className="mt-4">
              <span className="text-xs uppercase tracking-wider text-altina-gold/60">
                Explore →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}