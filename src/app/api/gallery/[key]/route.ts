// src/app/api/gallery/[key]/route.ts
import { NextResponse, NextRequest } from "next/server";

// You can keep this as nodejs or switch to "edge".
// The important part is: no fs/path, no touching the filesystem.
export const runtime = "nodejs";
// export const runtime = "edge"; // <- optional, also works
export const dynamic = "force-dynamic";

/**
 * Optional: in the future you can define a small in-memory manifest like:
 *
 * const galleryManifest: Record<string, string[]> = {
 *   "dlf-one-midtown": [
 *     "/projects/dlf-one-midtown/1.jpg",
 *     "/projects/dlf-one-midtown/2.jpg",
 *   ],
 *   "sobha-aurum": [
 *     "/projects/sobha-aurum/1.jpg",
 *     "/projects/sobha-aurum/2.jpg",
 *   ],
 * };
 *
 * and then return galleryManifest[key] instead of [] below.
 */

// For now, we keep it simple and do NOT read the filesystem.
// This keeps the serverless function very small.
export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  const key = params.key;
  const alt = req.nextUrl.searchParams.get("alt") || "";
  const hint = req.nextUrl.searchParams.get("hint") || "";

  // In the old version, you were using [key, alt, hint] to look up folders.
  // Here we just expose them back for debugging if you ever need that.
  const candidates = Array.from(new Set([key, alt, hint].filter(Boolean)));

  // ✅ IMPORTANT: no fs, no path, no process.cwd(), no touching public/projects
  // For now, return an empty list of images.
  // Frontend should handle "no images" gracefully.
  const images: string[] = [];

  return NextResponse.json({
    images,
    candidates, // optional, you can remove this if not needed
  });
}
