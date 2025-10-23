// src/components/RelatedProjects.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import projectsData from "@/data/projects.json"; // fallback source

type Project = {
  id: string;
  name: string;
  brand?: string;
  developer?: string;
  city?: string;
  hero?: string;
  heroAlt?: string;
};

type Props = {
  currentId: string;
  // Optional props (backward compatible)
  projects?: Project[];
  developer?: string;
  city?: string;
};

export default function RelatedProjects({
  currentId,
  projects,
  developer,
  city,
}: Props) {
  // ✅ Fallback to JSON if projects prop is not provided
  const source: Project[] = Array.isArray(projects)
    ? projects
    : (projectsData as Project[]);

  // Safety: if still not an array, render nothing
  if (!Array.isArray(source) || !source.length) return null;

  // Prefer similarity by developer/city, else just show any others with images
  let pool = source.filter((p) => p && p.id && p.id !== currentId);

  const similar =
    (developer || city)
      ? pool.filter(
          (p) =>
            (developer && p.developer && p.developer === developer) ||
            (city && p.city && p.city === city)
        )
      : [];

  const candidates = (similar.length ? similar : pool).filter((p) => !!p.hero);

  const items = candidates.slice(0, 3);
  if (!items.length) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <Link
          key={p.id}
          href={`/projects/${p.id}`}
          className="group relative flex flex-col rounded-2xl border border-altina-gold/30 bg-gradient-to-b from-[#111] to-[#0b0b0b] p-4 shadow-md transition-all hover:border-altina-gold/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]"
        >
          {/* Image */}
          {p.hero && (
            <div className="relative mb-4 overflow-hidden rounded-xl">
              <Image
                src={p.hero}
                alt={p.heroAlt || p.name}
                width={500}
                height={280}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          {/* Text */}
          <div className="flex flex-col flex-1 justify-between">
            <div>
              <h3 className="text-lg font-semibold text-altina-ivory group-hover:text-altina-gold transition">
                {p.name}
              </h3>
              <p className="text-sm text-altina-gold/70 mt-1">
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
