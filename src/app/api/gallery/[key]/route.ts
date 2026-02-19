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

function normalizeImages(projectId: string, payload: any) {
  const base = `/projects/${projectId}/gallery/`;
  const list = Array.isArray(payload) ? payload : Array.isArray(payload?.images) ? payload.images : [];

  const out: string[] = [];

  for (const x of list) {
    if (typeof x !== "string") continue;
    let src = x.trim();
    if (!src) continue;

    // allow bare filenames in manifest
    if (!src.startsWith("/")) src = base + src;

    // enforce project gallery only
    if (!src.startsWith(base)) continue;

    const lower = src.toLowerCase();
    const dot = lower.lastIndexOf(".");
    const ext = dot >= 0 ? lower.slice(dot) : "";
    if (!exts.has(ext)) continue;

    out.push(src);
  }

  return Array.from(new Set(out)).sort(naturalCompare);
}

async function readJsonIfExists(absPath: string) {
  try {
    const raw = await fs.readFile(absPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
  const publicDir = path.join(process.cwd(), "public");

  const key = decodeURIComponent(params.key || "").trim();
  if (!key) {
    return NextResponse.json({ images: [] }, { headers: { "Cache-Control": CACHE_CONTROL } });
  }

  // Primary: /public/projects/<id>/gallery/manifest.json
  const manifestAbs = path.join(publicDir, "projects", key, "gallery", "manifest.json");
  const manifest = await readJsonIfExists(manifestAbs);

  const images = normalizeImages(key, manifest || { images: [] });

  return NextResponse.json(
    { images },
    {
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
    }
  );
}
