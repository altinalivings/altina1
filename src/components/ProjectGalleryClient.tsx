// src/components/ProjectGalleryClient.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Props = {
  images?: string[];
  slug?: string;
  caption?: string;

  /**
   * Main image fit:
   * - "cover": premium look; may crop edges
   * - "contain": no crop; may show letterboxing
   */
  fit?: "cover" | "contain";

  /**
   * Main frame aspect ratio for consistent sizing.
   * - "16/9": wide hero look
   * - "4/3": more balanced for mixed galleries
   */
  aspect?: "16/9" | "4/3";
};

export default function ProjectGalleryClient({
  images = [],
  slug,
  caption,
  fit = "cover",
  aspect = "16/9",
}: Props) {
  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = useMemo(() => safeImages.map((src) => ({ src })), [safeImages]);

  if (!safeImages.length) {
    return <div className="text-sm text-neutral-400">Gallery coming soon.</div>;
  }

  const hasMany = safeImages.length > 1;
  const current = safeImages[index] || safeImages[0];

  const prev = () => setIndex((v) => (v - 1 + safeImages.length) % safeImages.length);
  const next = () => setIndex((v) => (v + 1) % safeImages.length);

  const aspectClass = aspect === "4/3" ? "aspect-[4/3]" : "aspect-[16/9]";
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div>
      {caption ? <p className="text-neutral-400 text-sm mb-3">{caption}</p> : null}

      {/* Main image frame with visible left/right arrows */}
      <div
        className={[
          "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black",
          aspectClass,
        ].join(" ")}
      >
        {/* Click anywhere to open lightbox */}
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-zoom-in"
          aria-label="Open gallery"
          onClick={() => setOpen(true)}
        />

        <Image
          src={current}
          alt={`${slug || "project"} image ${index + 1}`}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 1000px"
          className={["select-none", fitClass].join(" ")}
        />

        {hasMany && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white border border-white/10 hover:bg-black/70"
            >
              ‹
            </button>

            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white border border-white/10 hover:bg-black/70"
            >
              ›
            </button>

            <div className="absolute bottom-3 right-3 z-20 rounded-full bg-black/55 px-3 py-1 text-xs text-white border border-white/10">
              {index + 1} / {safeImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMany && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={[
                "relative h-20 w-28 flex-none overflow-hidden rounded-xl border bg-black",
                i === index ? "border-[#C5A657]" : "border-white/10 hover:border-white/20",
                "focus:outline-none focus:ring-2 focus:ring-[#C5A657]/60",
              ].join(" ")}
              aria-label={`Select image ${i + 1} ${slug ? "for " + slug : ""}`}
            >
              <Image
                src={src}
                alt={`${slug || "project"} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox (force navigation arrows visible) */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Thumbnails, Zoom]}
        carousel={{ finite: !hasMany }}
        thumbnails={{ position: "bottom" }}
        zoom={{ maxZoomPixelRatio: 2.5, scrollToZoom: true }}
        // Ensure arrows are not suppressed anywhere
        render={{
          // Strong, visible icons for prev/next
          iconPrev: () => <span style={{ fontSize: 26, lineHeight: 1 }}>‹</span>,
          iconNext: () => <span style={{ fontSize: 26, lineHeight: 1 }}>›</span>,
          // If only 1 image, hide buttons cleanly (recommended by docs)
          buttonPrev: hasMany ? undefined : () => null,
          buttonNext: hasMany ? undefined : () => null,
        }}
        // Force the navigation slots to be visible even if global CSS hides them
        styles={{
          navigationPrev: {
            display: hasMany ? "flex" : "none",
            opacity: 1,
            pointerEvents: hasMany ? "auto" : "none",
            zIndex: 9999,
          },
          navigationNext: {
            display: hasMany ? "flex" : "none",
            opacity: 1,
            pointerEvents: hasMany ? "auto" : "none",
            zIndex: 9999,
          },
          button: {
            backgroundColor: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.12)",
          },
        }}
      />
    </div>
  );
}
