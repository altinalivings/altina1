// src/components/ProjectHeroWithInfo.tsx
"use client";

type Props = {
  id: string;
  name: string;
  city?: string;
  location?: string;
  hero?: string;
  configuration?: string;
  price?: string;
  brochure?: string;
  images?: string[]; // optional
};

export default function ProjectHeroWithInfo({
  id,
  name,
  city,
  location,
  hero,
  configuration,
  price,
  images,
}: Props) {
  // Safely pick a hero image: images[0] → hero → fallback
  const heroSrc =
    (Array.isArray(images) && images.length > 0 ? images[0] : hero) ||
    "/fallbacks/hero-fallback.jpg"; // ensure this exists in /public/fallbacks/

  return (
    <section className="relative h-[44vh] min-h-[360px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroSrc}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
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
