// src/components/RelatedProjects.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import projectsData from "@/data/projects.json"; // fallback

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
  projects?: Project[];     // optional (fallback to JSON)
  developer?: string;       // for similarity
  city?: string;            // for similarity
};

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

  const pool = source.filter((p) => p && p.id && p.id !== currentId);

  const similar =
    (developer || city)
      ? pool.filter(
          (p) =>
            (developer && p.developer && p.developer === developer) ||
            (city && p.city && p.city === city)
        )
      : [];

  const items = (similar.length ? similar : pool)
    .filter((p) => !!p.hero)
    .slice(0, 3);

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
                priority={false}
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
