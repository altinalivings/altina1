"use client";

import React from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Props = {
  slug: string;
  images?: string[];
  caption?: string;
  className?: string;
};

const stripBtn =
  "rounded-full w-10 h-10 grid place-items-center border border-white/20 bg-black/40 hover:bg-black/60 text-white";

export default function ProjectGallery({ slug, images, caption, className }: Props) {
  const [list, setList] = React.useState<string[]>(images ?? []);
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const stripRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let ignore = false;
    async function run() {
      if (images && images.length) return;
      try {
        const res = await fetch(`/api/gallery/${encodeURIComponent(slug)}`, { cache: "no-store" });
        if (!res.ok) return;
        const data: { images: string[] } = await res.json();
        if (!ignore && data?.images?.length) setList(data.images);
      } catch {}
    }
    run();
    return () => { ignore = true; };
  }, [slug, images]);

  const scrollStrip = (delta: number) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const thumbs = list.map((src) => (src.startsWith("/") ? src : `/${src}`));

  return (
    <section className={className ?? ""}>
      <p className="text-sm text-white/70 mb-3">{caption ?? "Click any image to zoom"}</p>

      <div className="relative flex items-center gap-2">
        <button type="button" onClick={() => scrollStrip(-400)} aria-label="Previous"
          className={stripBtn}>‹</button>

        <div
          ref={stripRef}
          className="flex-1 overflow-x-auto scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          <ul className="flex gap-3 snap-x snap-mandatory">
            {thumbs.map((src, i) => (
              <li key={i} className="snap-start shrink-0">
                <button
                  type="button"
                  className="block rounded-xl overflow-hidden border border-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  onClick={() => { setIndex(i); setOpen(true); }}
                >
                  <img
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    width={320}
                    height={200}
                    className="h-44 w-[20rem] object-cover"
                    loading="lazy"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button type="button" onClick={() => scrollStrip(400)} aria-label="Next"
          className={stripBtn}>›</button>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={thumbs.map((src) => ({ src }))}
        plugins={[Thumbnails, Zoom]}
        carousel={{ finite: false }}
      />
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
  
}
