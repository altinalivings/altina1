// src/components/ProjectGallery.tsx
// Server wrapper: auto-discovers images from /public/projects/<slug>/gallery
import path from "path";
import fs from "fs";
import ProjectGalleryClient from "./ProjectGalleryClient";

type Props = {
  slug?: string;
  images?: string[]; // if provided, overrides auto-discover
  caption?: string;
};

function listImagesFromPublic(slug: string): string[] {
  const roots = [
    path.join(process.cwd(), "public", "projects", slug, "gallery"),
    path.join(process.cwd(), "public", "projects", slug),
  ];
  const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

  for (const dir of roots) {
    try {
      const files = fs.readdirSync(dir)
        .filter((f) => exts.has(path.extname(f).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: True, sensitivity: "base" }));
      if (files.length) {
        // turn into public URLs
        const rel = dir.split(path.join(process.cwd(), "public"))[1].replace(/\\+/g, "/");
        return files.map((f) => `${rel}/${f}`);
      }
    } catch {
      // ignore missing dirs
    }
  }
  return [];
}

export default async function ProjectGallery({ slug, images, caption }: Props) {
  const discovered = slug ? listImagesFromPublic(slug) : [];
  const list = (images && images.length ? images : discovered) ?? [];

  return (
    <ProjectGalleryClient
      slug={slug}
      images={list}
      caption={caption}
    />
  );
}
