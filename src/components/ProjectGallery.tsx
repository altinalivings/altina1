// src/components/ProjectGallery.tsx
"use client";

import { useEffect, useState } from "react";
import ProjectGalleryClient from "@/components/ProjectGalleryClient";

export default function ProjectGallery({
  slug,
  className,
  caption,
}: {
  slug: string;
  className?: string;
  caption?: string;
}) {
  const [images, setImages] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/gallery/${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!cancelled) setImages(Array.isArray(data.images) ? data.images : []);
      } catch {
        if (!cancelled) setImages([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!images) return null;           // or a skeleton if you prefer
  if (images.length === 0) return null;

  return (
    <ProjectGalleryClient
      images={images}
      className={className}
      caption={caption}
    />
  );
}
