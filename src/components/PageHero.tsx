// src/components/PageHero.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const FALLBACK = "/hero/home.jpg";

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
  const primarySrc = useMemo(() => {
    if (src) return src;
    if (projectId) return `/projects/${projectId}/hero.jpg`;
    return FALLBACK;
  }, [projectId, src]);

  const [imgSrc, setImgSrc] = useState(primarySrc);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      priority
      className={`object-cover ${className ?? ""}`}
      sizes="100vw"
      onError={() => {
        if (imgSrc !== FALLBACK) setImgSrc(FALLBACK);
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
  titleAs: TitleTag = "h1",
}: {
  title: string;
  subtitle?: string;
  image?: string;
  projectId?: string;
  height?: string;
  overlayClass?: string;
  /** Use "h2" on pages that already have their own <h1> in the content body */
  titleAs?: "h1" | "h2";
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
          <TitleTag className="text-3xl font-semibold">{title}</TitleTag>
          {subtitle && <p className="mt-2 text-neutral-300">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
