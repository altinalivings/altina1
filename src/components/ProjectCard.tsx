// src/components/ProjectCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export type ProjectCardProps = {
  id: string;
  name: string;
  brand?: string;
  developer?: string;
  city?: string;
  hero?: string;
  heroAlt?: string;
};

export default function ProjectCard(p: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${p.id}`}
      aria-label={`View details for ${p.name}`}
      className="group relative flex flex-col rounded-2xl border border-altina-gold/30 bg-gradient-to-b from-[#111] to-[#0b0b0b] p-4 shadow-md transition-all hover:border-altina-gold/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] min-h-[260px]"
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
          <h3 className="text-base sm:text-lg font-semibold text-altina-ivory transition group-hover:text-altina-gold">
            {p.name}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-altina-gold/70">
            {p.brand || p.developer || "Premium Developer"}
            {p.city ? ` • ${p.city}` : ""}
          </p>
        </div>

        <div className="mt-4">
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-altina-gold/60">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}