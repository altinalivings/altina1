// src/components/ProjectGallery.tsx
"use client";
import React from "react";

type Props = {
  images?: string[];
  caption?: string;
};

export default function ProjectGallery({ images = [], caption }: Props) {
  if (!images || images.length === 0) return null;

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Gallery</h3>
      {caption && <p className="text-sm text-white/70">{caption}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Gallery image ${i + 1}`}
            className="w-full h-auto rounded-lg border border-white/10"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
