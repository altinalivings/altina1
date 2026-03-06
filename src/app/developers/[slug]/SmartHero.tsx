"use client";

import { useMemo, useState } from "react";

const FALLBACK = "/hero/home.jpg";

export default function SmartHero({
  slug,
  src,
  alt,
}: {
  slug: string;
  src?: string;
  alt: string;
}) {
  const candidates = useMemo(() => {
    const out: string[] = [];
    if (src) {
      out.push(src);
      if (src.startsWith("/")) out.push(src.slice(1));
    }
    const base = `/developers/${slug}/hero`;
    [".jpg", ".jpeg", ".png", ".webp"].forEach((ext) => {
      out.push(`${base}${ext}`);
      out.push(`${base}${ext}`.slice(1));
    });
    return out.length ? out : [FALLBACK];
  }, [slug, src]);

  const [idx, setIdx] = useState(0);
  const curr = candidates[Math.min(idx, candidates.length - 1)];

  return (
    <img
      src={curr}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
      loading="eager"
      decoding="async"
      fetchPriority="high"
      onError={() => {
        const next = idx + 1;
        if (next < candidates.length) {
          console.warn("[Dev Hero] 404:", curr, "→", candidates[next]);
          setIdx(next);
        } else if (curr !== FALLBACK) {
          setIdx(candidates.length - 1);
        }
      }}
    />
  );
}
