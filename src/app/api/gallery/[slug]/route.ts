// src/app/api/gallery/[slug]/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = "force-static"; // cache on the edge
export const runtime = "nodejs";

const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function naturalCompare(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

async function findImagesFor(slug: string) {
  const publicDir = path.join(process.cwd(), "public");
  // Preferred: /public/projects/<slug>/gallery
  const first = path.join(publicDir, "projects", slug, "gallery");
  // Fallback: /public/projects/<slug>
  const second = path.join(publicDir, "projects", slug);

  for (const dir of [first, second]) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const candidates = entries
        .filter((e) => e.isFile() && exts.has(path.extname(e.name).toLowerCase()))
        .map((e) => `/projects/${slug}/${dir.endsWith("gallery") ? "gallery/" : ""}${e.name}`)
        .sort(naturalCompare);
      if (candidates.length) return candidates;
    } catch {
      // try next
    }
  }
  return [];
}

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const images = await findImagesFor(slug);
  return NextResponse.json({ images });
}