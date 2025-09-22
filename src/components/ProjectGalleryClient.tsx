"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "swiper/css";
import "swiper/css/navigation";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function ProjectGalleryClient({
  images,
  className,
  caption,
}: {
  images: string[];
  className?: string;
  caption?: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images?.length) return null;

  return (
    <div className={className ?? ""}>
      <Swiper
        modules={[Navigation, Keyboard, A11y]}
        navigation
        keyboard={{ enabled: true }}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
        }}
        loop={images.length > 3}
        className="rounded-2xl overflow-hidden border border-[rgba(197,166,87,0.35)] shadow-sm"
      >
        {images.map((src, i) => (
          <SwiperSlide key={src}>
            <button
              type="button"
              aria-label={`Open image ${i + 1} of ${images.length}`}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="block w-full h-full focus:outline-none"
            >
              <div className="relative w-full aspect-[4/3] bg-neutral-950/60 rounded-xl overflow-hidden">
                <Image
                  src={src}
                  alt="Project gallery image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {caption ? (
        <p className="mt-3 text-sm text-neutral-300/90 italic text-center">
          {caption}
        </p>
      ) : null}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((src) => ({ src }))}
        plugins={[Zoom, Thumbnails]}
        // Tweak thumbnail rail if you like
        thumbnails={{
          position: "bottom",
          width: 100,   // px per thumb
          height: 70,   // keeps a compact rail
          border: 0,
          gap: 8,
          showToggle: true,
        }}
        // Improve zoom UX
        zoom={{ scrollToZoom: true, maxZoomPixelRatio: 2.5 }}
      />
    </div>
  );
}
