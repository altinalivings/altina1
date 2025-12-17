"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Props = {
  id: string;
  name: string;
  city?: string;
  location?: string;
  hero?: string;
  configuration?: string;
  price?: string;
  brochure?: string;
  images?: string[];
};

const FALLBACK = "/fallbacks/hero-fallback.jpg";

export default function ProjectHeroWithInfo({
  name,
  city,
  location,
  hero,
  configuration,
  price,
  images,
}: Props) {
  // Prefer explicit hero first, then gallery first image, then fallback.
  const initialSrc = useMemo(() => {
    const fromHero = hero?.trim();
    const fromGallery =
      Array.isArray(images) && images.length > 0 ? images[0]?.trim() : undefined;
    return fromHero || fromGallery || FALLBACK;
  }, [hero, images]);

  const [src, setSrc] = useState<string>(initialSrc);

  // Reset when route/props change
  if (src !== initialSrc) setSrc(initialSrc);

  return (
    <section className="relative h-[56vh] min-h-[360px] overflow-hidden w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <Image
        src={src}
        alt={name}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover object-center"
        onError={() => setSrc(FALLBACK)}
      />

      <div className="absolute inset-0 bg-black/15" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-10">
        <div className="golden-frame modal-surface rounded-2xl p-5">
          <h1 className="text-3xl font-semibold">{name}</h1>
          <div className="golden-divider my-2" />
          <p className="text-neutral-300">
            {configuration ? configuration : ""}
            {location ? ` • ${location}` : ""}
            {city ? ` • ${city}` : ""}
          </p>
          {price ? (
            <p className="text-altina-gold mt-1 font-medium">{price}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
