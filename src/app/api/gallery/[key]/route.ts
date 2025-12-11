// src/app/api/gallery/[key]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { galleryManifest } from "@/data/galleryManifest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  const key = params.key;
  const alt = req.nextUrl.searchParams.get("alt") || "";
  const hint = req.nextUrl.searchParams.get("hint") || "";

  // Try key first, then alt, then hint
  const candidates = [key, alt, hint].filter(Boolean);

  let images: string[] = [];

  for (const c of candidates) {
    if (galleryManifest[c]) {
      images = galleryManifest[c];
      break;
    }
  }

  // Fallback: if nothing matched, return empty array
  return NextResponse.json({
    images,
  });
}
