// src/components/ProjectGallery.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  /** Project id: folder = /public/projects/<id>/gallery */
  id: string;
  /** Optional explicit list. If provided, no API fetch. */
  images?: string[];
  caption?: string;
};

function normalizeSrc(src: string) {
  const s = String(src || "").trim();
  if (!s) return "";
  if (/^(https?:)?\/\//i.test(s)) return s;
  if (/^(data:|blob:)/i.test(s)) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

export default function ProjectGallery({ id, images: imagesProp, caption = "Click any image to zoom" }: Props) {
  const [images, setImages] = useState<string[]>(
    Array.isArray(imagesProp) ? imagesProp.map(normalizeSrc).filter(Boolean) : []
  );

  // Keep in sync if parent passes images
  useEffect(() => {
    if (imagesProp?.length) setImages(imagesProp.map(normalizeSrc).filter(Boolean));
  }, [imagesProp]);

  // Auto-fetch from server folder listing (ONE request)
  useEffect(() => {
    if (!id) return;
    if (imagesProp?.length) return;

    let alive = true;

    fetch(`/api/gallery/${encodeURIComponent(id)}`, { cache: "force-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive) return;
        const arr = Array.isArray(d?.images) ? d.images : [];
        setImages(arr.map(normalizeSrc).filter(Boolean));
      })
      .catch(() => {
        /* ignore */
      });

    return () => {
      alive = false;
    };
  }, [id, imagesProp]);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const top = images.slice(0, 4);
  const rest = images.slice(4);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("overflow-hidden");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("overflow-hidden");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, images.length]);

  if (!images.length) return null;

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Gallery</h3>
      {caption && <p className="text-sm text-white/70">{caption}</p>}

      {/* First row: 4 tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {top.map((src, i) => (
          <button
            key={src + i}
            onClick={() => openAt(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/10 focus:outline-none focus-visible:ring-2"
          >
            <img
              src={src}
              alt={`Gallery image ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {/* Rest */}
      {rest.length > 0 && (
        <RowSwiper
          images={rest}
          startIndex={4}
          onOpen={(absoluteIndex) => openAt(absoluteIndex)}
        />
      )}

      {open && (
        <Lightbox
          images={images}
          index={index}
          onClose={() => setOpen(false)}
          onPrev={prev}
          onNext={next}
          onSelect={setIndex}
        />
      )}
    </section>
  );
}

function RowSwiper({
  images,
  startIndex,
  onOpen,
}: {
  images: string[];
  startIndex: number;
  onOpen: (absoluteIndex: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) => scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <div className="relative">
      <div ref={scrollerRef} className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar py-1">
        {images.map((src, idx) => (
          <button
            key={src + idx}
            onClick={() => onOpen(startIndex + idx)}
            className="group shrink-0 relative h-44 w-[20rem] overflow-hidden rounded-xl ring-1 ring-white/10"
          >
            <img
              src={src}
              alt={`Gallery image ${startIndex + idx + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/70 to-transparent rounded-l-xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/70 to-transparent rounded-r-xl" />

      <button
        aria-label="Previous"
        onClick={() => scrollBy(-320)}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur px-3 py-2 hover:bg-white/20 focus:outline-none"
      >
        ‹
      </button>
      <button
        aria-label="Next"
        onClick={() => scrollBy(320)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur px-3 py-2 hover:bg-white/20 focus:outline-none"
      >
        ›
      </button>
    </div>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm">
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">
        ✕
      </button>
      <button onClick={onPrev} aria-label="Prev" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">
        ‹
      </button>
      <button onClick={onNext} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">
        ›
      </button>

      <div className="flex h-full flex-col items-center justify-center gap-4 px-4 pb-24">
        <img
          src={images[index]}
          alt=""
          className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl border border-altina-gold/30 shadow-[0_0_30px_rgba(255,215,0,0.20)]"
          decoding="async"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto no-scrollbar">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => onSelect(i)}
              className={`shrink-0 rounded-md overflow-hidden ring-2 transition-all duration-200 ${
                i === index ? "ring-altina-gold scale-[1.05]" : "ring-white/10 hover:ring-altina-gold/40"
              }`}
            >
              <img src={src} alt={`thumb ${i + 1}`} className="h-16 w-24 object-cover" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
