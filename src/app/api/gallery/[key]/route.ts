// src/app/api/gallery/[key]/route.ts
import { NextResponse, NextRequest } from "next/server";
import projects from "@/data/projects";

export const runtime = "nodejs";

const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function isImagePath(p: string) {
  const clean = (p || "").split("?")[0].toLowerCase();
  const dot = clean.lastIndexOf(".");
  if (dot === -1) return false;
  return exts.has(clean.slice(dot));
}

function naturalCompare(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

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
      { ok: false, key: null, images: [] },
      { status: 404, headers: { "Cache-Control": CACHE_CONTROL } }
    );
  }

  const gallery = (match.gallery || []).filter(isImagePath).slice().sort(naturalCompare);
  const images = gallery.length ? gallery : match.hero && isImagePath(match.hero) ? [match.hero] : [];

  return NextResponse.json(
    { ok: true, key: match.id, images },
    { headers: { "Cache-Control": CACHE_CONTROL } }
  );
}
