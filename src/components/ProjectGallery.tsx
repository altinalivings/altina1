"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  /** Project ID → maps to /public/projects/<id>/gallery */
  projectId: string;
  caption?: string;
};

export default function ProjectGallery({
  projectId,
  caption = "Click any image to zoom",
}: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch from API ---------------- */
  useEffect(() => {
    let alive = true;

    setLoading(true);
    fetch(`/api/gallery/${encodeURIComponent(projectId)}`, {
      cache: "force-cache",
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!alive) return;
        if (Array.isArray(d?.images)) {
          setImages(d.images);
        }
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [projectId]);

  /* ---------------- Lightbox ---------------- */
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!loading && images.length === 0) return null;

  const top = images.slice(0, 4);
  const rest = images.slice(4);

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-altina-gold">Gallery</h3>
      {caption && <p className="text-sm text-neutral-400">{caption}</p>}

      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {top.map((src, i) => (
            <button
              key={src}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/10"
            >
              <img
                src={src}
                alt={`Gallery image ${i + 1}`}
                className="h-full w-full object-cover"
                loading={i < 2 ? "eager" : "lazy"}
              />
            </button>
          ))}
        </div>
      )}

      {/* Horizontal strip */}
      {rest.length > 0 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
          {rest.map((src, i) => (
            <button
              key={src}
              onClick={() => {
                setIndex(i + 4);
                setOpen(true);
              }}
              className="h-44 w-[20rem] shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10"
            >
              <img
                src={src}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {open && (
        <Lightbox
          images={images}
          index={index}
          onClose={() => setOpen(false)}
          onSelect={setIndex}
        />
      )}
    </section>
  );
}

/* ---------------- Lightbox ---------------- */

function Lightbox({
  images,
  index,
  onClose,
  onSelect,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onSelect: (i: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] bg-black/90">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-2"
      >
        ✕
      </button>

      <div className="flex h-full items-center justify-center px-4">
        <img
          src={images[index]}
          className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl border border-altina-gold/30"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => onSelect(i)}
              className={`h-16 w-24 overflow-hidden rounded-md border ${
                i === index
                  ? "border-altina-gold"
                  : "border-white/10"
              }`}
            >
              <img src={src} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
