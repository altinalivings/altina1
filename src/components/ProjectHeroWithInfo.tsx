"use client";

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
    <section className="relative h-[56vh] min-h-[360px] overflow-hidden w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <Image
        src={heroSrc}
        alt={name}
        fill
  priority
  unoptimized 
        quality={100}
        sizes="100vw"
        className="absolute inset-0 object-cover object-center will-change-transform"
        style={{ imageRendering: "auto" }}
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement;
          el.src = "/fallbacks/hero-fallback.jpg";
        }}
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
