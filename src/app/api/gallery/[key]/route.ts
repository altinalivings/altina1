// src/app/api/gallery/[key]/route.ts
import { NextResponse, NextRequest } from "next/server";
import projects from "@/data/projects";

export const runtime = "nodejs";
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

function norm(s: string) {
  return decodeURIComponent(s || "").trim().toLowerCase();
}

export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
  const key = norm(params.key);
  const alt = norm(req.nextUrl.searchParams.get("alt") || "");
  const hint = norm(req.nextUrl.searchParams.get("hint") || "");
  const candidates = Array.from(new Set([key, alt, hint].filter(Boolean)));

  const match =
    projects.find((p) => candidates.includes(norm(p.id))) ||
    projects.find((p) => candidates.includes(norm(p.slug))) ||
    null;

  if (!match) {
    return NextResponse.json(
      { ok: false, images: [] },
      { status: 404, headers: { "Cache-Control": CACHE_CONTROL } }
    );
  }

  // ✅ ONLY what you defined in projects.ts
  const images = (match.gallery && match.gallery.length)
    ? match.gallery
    : match.hero
      ? [match.hero]
      : [];

  return NextResponse.json(
    { ok: true, images },
    { headers: { "Cache-Control": CACHE_CONTROL } }
  );
}
