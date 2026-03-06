// src/app/api/gallery/[key]/route.ts
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

// Cache at the edge/CDN for 1 hour, serve stale while revalidating
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function naturalCompare(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

/**
 * Recursively list image files under folderAbs and return public URLs
 * e.g. "/projects/sobha-altus/gallery/phase1/img1.webp"
 */
async function listImagesRecursive(publicDir: string, folderAbs: string): Promise<string[]> {
  const out: string[] = [];

  async function walk(dirAbs: string) {
    let entries: any[] = [];
    try {
      entries = await fs.readdir(dirAbs, { withFileTypes: true });
    } catch {
      return;
    }

    for (const e of entries) {
      const abs = path.join(dirAbs, e.name);

      if (e.isDirectory()) {
        await walk(abs);
        continue;
      }

      if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        if (!exts.has(ext)) continue;

        // Convert absolute FS path -> public URL
        const rel = path.relative(publicDir, abs).replace(/\\/g, "/");
        out.push("/" + rel);
      }
    }
  }

  await walk(folderAbs);
  return out.sort(naturalCompare);
}

async function collectFor(publicDir: string, cand: string) {
  const base = path.join(publicDir, "projects", cand);
  const galleryDir = path.join(base, "gallery");

  // Prefer /gallery (recursive, supports subfolders)
  const galleryImages = await listImagesRecursive(publicDir, galleryDir);
  if (galleryImages.length) return galleryImages;

  // Fallback: images directly inside /projects/<cand> (exclude /gallery folder)
  const rootImages = await listImagesRecursive(publicDir, base);
  const filteredRoot = rootImages.filter((u) => !u.includes(`/projects/${cand}/gallery/`));
  return filteredRoot;
}

export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
  const publicDir = path.join(process.cwd(), "public");

  const key = decodeURIComponent(params.key || "").trim();
  const alt = (req.nextUrl.searchParams.get("alt") || "").trim();
  const hint = (req.nextUrl.searchParams.get("hint") || "").trim();

  // Try: key (id), alt (slug), hint (folder hint)
  const candidates = Array.from(new Set([key, alt, hint].filter(Boolean)));

  const all: string[] = [];
  for (const c of candidates) {
    const items = await collectFor(publicDir, c);
    if (items.length) all.push(...items);
  }

  const images = Array.from(new Set(all)).sort(naturalCompare);

  return NextResponse.json(
    { images },
    {
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
    }
  );
}
