// src/components/ProjectGallery.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Props = {
  /** Optional: if omitted, the component will fetch from /api/gallery/<slug> */
  images?: string[];
  /** Used for autodiscovery and accessibility text */
  slug?: string;
  caption?: string;
};

export default function ProjectGallery({ images, slug, caption }: Props) {
  const [list, setList] = useState<string[]>(images ?? []);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Auto-fetch if images not provided but slug is
  useEffect(() => {
    let isMounted = true;
    async function load() {
      if ((!images || images.length === 0) && slug) {
        try {
          const res = await fetch(`/api/gallery/${encodeURIComponent(slug)}`, { cache: "force-cache" });
          if (!res.ok) return;
          const data = await res.json();
          if (isMounted && Array.isArray(data?.images)) setList(data.images);
        } catch {}
      }
    }
    load();
    return () => { isMounted = false; };
  }, [slug, images]);

  const slides = useMemo(() => list.map((src) => ({ src })), [list]);

  if (!list?.length) {
    return <div className="text-sm text-neutral-400">Gallery coming soon.</div>;
  }

  return (
    <div>
      {caption ? <p className="text-neutral-400 text-sm mb-3">{caption}</p> : null}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {list.map((src, i) => (
          <button
            key={src + i}
            type="button"
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-altina-gold/60"
            onClick={() => { setIndex(i); setOpen(true); }}
            aria-label={`Open image ${i + 1} ${slug ? "for " + slug : ""}`}
          >
            <Image
              src={src}
              alt={`${slug || "project"} image ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 960px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Thumbnails, Zoom]}
        carousel={{ finite: false }}
        thumbnails={{ position: "bottom" }}
        zoom={{ maxZoomPixelRatio: 2.5, scrollToZoom: true }}
      />
    </div>
  );
}
