// src/components/PageHero.tsx
"use client";

import { useMemo, useState } from "react";

const FALLBACK = "/placeholder/2200x1200.jpg"; // put a branded fallback in /public/placeholder/

function SmartHeroImage({
  projectId,
  src,
  alt,
  className,
}: {
  projectId?: string;
  src?: string;
  alt: string;
  className?: string;
}) {
  const candidates = useMemo(() => {
    const list: string[] = [];
    if (src) {
      list.push(src);
      if (src.startsWith("/")) list.push(src.slice(1));
    }
    if (projectId) {
      const base = `/projects/${projectId}/hero`;
      [".jpg", ".jpeg", ".png", ".webp"].forEach((ext) => {
        list.push(`${base}${ext}`);
        list.push(`${base}${ext}`.replace(/^\//, ""));
      });
    }
    return list.length ? list : [FALLBACK];
  }, [projectId, src]);

  const [idx, setIdx] = useState(0);
  const [current, setCurrent] = useState(candidates[0]);

  // reset when candidates change
  if (current !== candidates[idx]) {
    setIdx(0);
    setCurrent(candidates[0]);
  }

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        const next = idx + 1;
        if (next < candidates.length) {
          // eslint-disable-next-line no-console
          console.warn("[PageHero] 404:", current, "→ trying:", candidates[next]);
          setIdx(next);
          setCurrent(candidates[next]);
        } else if (current !== FALLBACK) {
          console.warn("[PageHero] all candidates failed, using fallback", candidates);
          setCurrent(FALLBACK);
        }
      }}
    />
  );
}

export default function PageHero({
  title,
  subtitle,
  image,
  projectId,
  height = "h-[56vh]",
  overlayClass = "bg-black/40",
}: {
  title: string;
  subtitle?: string;
  image?: string;
  projectId?: string; // pass on project pages to enable auto hero path tries
  height?: string;
  overlayClass?: string;
}) {
  return (
    <section className={`relative ${height} min-h-[420px] overflow-hidden`}>
      <SmartHeroImage
        projectId={projectId}
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-10">
        <div className="golden-frame modal-surface rounded-2xl p-5">
          <h1 className="text-3xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-2 text-neutral-300">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
