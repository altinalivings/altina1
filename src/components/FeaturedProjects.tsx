// src/components/FeaturedProjects.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type Project = {
  id: string;
  name: string;
  developer?: string;
  developerSlug?: string;
  location?: string;
  price?: string;
  status?: string;
  hero?: string;
};

const FALLBACK = "/hero/projects.jpg";

function SmartImage({
  id,
  src,
  alt,
  className,
}: {
  id: string;
  src?: string;
  alt: string;
  className?: string;
}) {
  const primarySrc = src || `/projects/${id}/hero.jpg`;
  const [imgSrc, setImgSrc] = useState(primarySrc);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={`object-cover ${className ?? ""}`}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      onError={() => {
        if (imgSrc !== FALLBACK) setImgSrc(FALLBACK);
      }}
    />
  );
}

export default function FeaturedProjects({ items }: { items: Project[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="featured-projects-heading">
      <div className="flex items-end justify-between mb-1">
        <h2 id="featured-projects-heading" className="text-2xl font-semibold gold-text">Featured Projects</h2>
        <Link href="/projects" className="text-sm text-altina-gold hover:underline hidden sm:block">
          View all projects →
        </Link>
      </div>
      <div className="golden-divider my-4" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="group overflow-hidden rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(191,149,63,0.15)] bg-[#0E0E10]"
          >
            <div className="relative h-52 overflow-hidden">
              <SmartImage
                id={p.id}
                src={p.hero}
                alt={`${p.name}${p.location ? ` in ${p.location}` : ""} – luxury property`}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {(p.developer || p.developerSlug) && (
                <div className="absolute top-3 left-3 rounded-full bg-black/60 border border-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                  {p.developer || p.developerSlug?.toUpperCase()}
                </div>
              )}
              {p.status && (
                <div className="absolute top-3 right-3 rounded-full bg-altina-gold/90 text-black px-2.5 py-1 text-xs font-semibold">
                  {p.status}
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="font-semibold text-white group-hover:text-altina-gold transition-colors">{p.name}</div>
              {p.location && (
                <div className="flex items-center gap-1 text-sm text-neutral-400 mt-1">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="currentColor">
                    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
                  </svg>
                  {p.location}
                </div>
              )}
              <div className="flex items-center justify-between mt-3">
                {p.price && (
                  <div className="text-sm font-semibold text-altina-gold">{p.price}</div>
                )}
                <span className="ml-auto text-xs text-altina-gold/70 group-hover:text-altina-gold transition-colors flex items-center gap-1">
                  View Details
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center sm:hidden">
        <Link href="/projects" className="inline-block rounded-xl border border-altina-gold/50 text-altina-gold px-6 py-2.5 text-sm font-semibold hover:bg-altina-gold/10 transition">
          View All Projects
        </Link>
      </div>
    </section>
  );
}
