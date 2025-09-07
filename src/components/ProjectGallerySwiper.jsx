"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProjectGallerySwiper({ images = [] }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) return null;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <section className="space-y-4">
      {/* Main */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
        <Image
          src={images[index]}
          alt={`Gallery ${index + 1}`}
          fill
          sizes="(min-width: 1024px) 960px, 100vw"
          className="cursor-zoom-in object-cover"
          onClick={() => setLightbox(true)}
          priority={index === 0}
        />

        {/* counter pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
          {index + 1} / {images.length}
        </div>

        {/* controls */}
        <button
          aria-label="Previous image"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white backdrop-blur hover:bg-black/60"
        >
          ‹
        </button>
        <button
          aria-label="Next image"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white backdrop-blur hover:bg-black/60"
        >
          ›
        </button>
      </div>

      {/* Thumbs */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setIndex(i)}
            className={`relative aspect-[4/3] overflow-hidden rounded-lg ring-2 ${
              i === index ? "ring-black" : "ring-transparent"
            }`}
            aria-label={`Open image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`Thumb ${i + 1}`}
              fill
              sizes="200px"
              className="object-cover"
              loading={i > 3 ? "lazy" : undefined}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-white backdrop-blur"
            aria-label="Close lightbox"
          >
            ✕
          </button>

          <div className="absolute inset-0 mx-auto flex max-w-6xl items-center justify-center px-4">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={images[index]}
                alt={`Large ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white backdrop-blur"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white backdrop-blur"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
