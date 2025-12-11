// src/app/api/gallery/[key]/route.ts
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function naturalCompare(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

async function listImagesUnder(publicDir: string, folderAbs: string) {
  try {
    const entries = await fs.readdir(folderAbs, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && exts.has(path.extname(e.name).toLowerCase()))
      .map((e) => path.join(folderAbs, e.name));
    return files
      .map((abs) => "/" + path.relative(publicDir, abs).replace(/\\/g, "/"))
      .sort(naturalCompare);
  } catch {
    return [];
  }
}

async function collectFor(publicDir: string, cand: string) {
  const base = path.join(publicDir, "projects", cand);
  const galleryDir = path.join(base, "gallery");
  const galleryImages = await listImagesUnder(publicDir, galleryDir);
  if (galleryImages.length) return galleryImages;
  const rootImages = await listImagesUnder(publicDir, base);
  return rootImages;
}

export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
  const publicDir = path.join(process.cwd(), "public");
  const key = params.key;
  const alt = req.nextUrl.searchParams.get("alt") || "";
  const hint = req.nextUrl.searchParams.get("hint") || "";

  // Try: id, alt(slug), and a third "hint" (e.g., derived from hero path or sanitized name)
  const candidates = Array.from(new Set([key, alt, hint].filter(Boolean)));
  const all: string[] = [];

  for (const c of candidates) {
    const items = await collectFor(publicDir, c);
    if (items.length) all.push(...items);
  }

  const images = Array.from(new Set(all)).sort(naturalCompare);
  return NextResponse.json({ images });
}
