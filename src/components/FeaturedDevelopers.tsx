// src/components/FeaturedDevelopers.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Dev = {
  slug: string;
  name: string;
  hero?: string;  // optional explicit path
  logo?: string;
  tagline?: string;
};

const FALLBACK = "/placeholder/1200x800.jpg";

function SmartDevImage({
  slug,
  src,
  alt,
  className,
}: {
  slug: string;
  src?: string;
  alt: string;
  className?: string;
}) {
  const candidates = useMemo(() => {
    const list: string[] = [];
    if (src && src !== "/") {
      list.push(src);
      if (src.startsWith("/")) list.push(src.slice(1));
    }
    const base = `/developers/${slug}/hero`;
    [".jpg", ".jpeg", ".png", ".webp"].forEach((ext) => {
      list.push(`${base}${ext}`);
      list.push(`${base}${ext}`.slice(1));
    });
    return list.length ? list : [FALLBACK];
  }, [slug, src]);

  const [idx, setIdx] = useState(0);
  const curr = candidates[Math.min(idx, candidates.length - 1)];

  return (
    <img
      src={curr}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        const next = idx + 1;
        if (next < candidates.length) {
          console.warn("[FeaturedDevelopers] 404:", curr, "→", candidates[next]);
          setIdx(next);
        } else if (curr !== FALLBACK) {
          setIdx(candidates.length - 1);
        }
      }}
    />
  );
}

export default function FeaturedDevelopers({ items }: { items: Dev[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-semibold">Featured Developers</h2>
      <div className="golden-divider my-4" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((d) => (
          <Link
            key={d.slug}
            href={`/developers/${d.slug}`}
            className="group overflow-hidden rounded-2xl border border-white/10 hover:border-amber-400/40 transition"
          >
            <div className="relative h-40">
              <SmartDevImage
                slug={d.slug}
                src={d.hero}
                alt={d.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
              {d.logo && (
                <img
                  src={d.logo}
                  alt={`${d.name} logo`}
                  className="absolute left-3 bottom-3 h-8 w-auto object-contain"
                />
              )}
            </div>
            <div className="p-4">
              <div className="font-medium">{d.name}</div>
              {d.tagline && (
                <div className="text-sm text-neutral-400">{d.tagline}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}