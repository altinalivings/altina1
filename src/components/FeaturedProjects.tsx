// src/components/FeaturedProjects.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Project = {
  id: string;
  name: string;
  developer?: string;
  developerSlug?: string;
  location?: string;
  price?: string;
  hero?: string; // expected /projects/<id>/hero.jpg
};

const FALLBACK = "/placeholder/800x500.jpg"; // put any on-brand image here

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
  const candidates = useMemo(() => {
    const list: string[] = [];
    if (src) {
      // given path (with and without leading slash)
      list.push(src);
      if (src.startsWith("/")) list.push(src.substring(1));
    }
    // standard hero patterns
    const base = `/projects/${id}/hero`;
    [".jpg", ".jpeg", ".png", ".webp"].forEach((ext) => {
      list.push(`${base}${ext}`);
      list.push(`${base}${ext}`.replace(/^\//, "")); // without leading slash
    });
    return list;
  }, [id, src]);

  const [idx, setIdx] = useState(0);
  const [current, setCurrent] = useState(candidates[0] || FALLBACK);

  // When candidates change (different project), reset
  if (current !== candidates[idx]) {
    setIdx(0);
    setCurrent(candidates[0] || FALLBACK);
  }

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        const next = idx + 1;
        if (next < candidates.length) {
          // Log the one that just failed to help you fix path/filename
          // You’ll see exactly which URL 404’d in DevTools console.
          // eslint-disable-next-line no-console
          console.warn("[FeaturedProjects] 404 image:", current, "→ trying:", candidates[next]);
          setIdx(next);
          setCurrent(candidates[next]);
        } else if (current !== FALLBACK) {
          console.warn("[FeaturedProjects] all candidates failed, using fallback", candidates);
          setCurrent(FALLBACK);
        }
      }}
    />
  );
}

export default function FeaturedProjects({ items }: { items: Project[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-semibold">Featured Projects</h2>
      <div className="golden-divider my-4" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="group overflow-hidden rounded-2xl border border-white/10 hover:border-amber-400/40 transition"
          >
            <div className="relative h-48">
              <SmartImage
                id={p.id}
                src={p.hero}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              {(p.developer || p.developerSlug) && (
                <div className="absolute bottom-3 left-3 rounded bg-black/50 px-2 py-1 text-xs">
                  {p.developer || p.developerSlug?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="font-medium">{p.name}</div>
              {p.location && <div className="text-sm text-neutral-400">{p.location}</div>}
              {p.price && <div className="mt-1 text-sm text-neutral-300">{p.price}</div>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
