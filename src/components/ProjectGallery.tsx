// src/components/ProjectGallery.tsx
"use client";
import React from "react";

type ImageItem = { src: string; alt?: string };
type Props = {
  images?: ImageItem[];
  caption?: string;
};

export default function ProjectGallery({ images = [], caption }: Props) {
  if (!images.length) return null;

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Gallery</h3>
      {caption ? <p className="text-sm text-white/70">{caption}</p> : null}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {images.map((it, i) => (
          <img
            key={i}
            src={it.src}
            alt={it.alt || `Gallery ${i + 1}`}
            className="h-40 w-full rounded-lg object-cover"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
