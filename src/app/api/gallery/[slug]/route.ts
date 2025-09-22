// src/app/api/gallery/[slug]/route.ts
import path from "path";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // IMPORTANT: ensure Node APIs are available
export const dynamic = "force-dynamic"; // always read current files

function isAllowed(name: string) {
  const ext = path.extname(name).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const dir = path.join(process.cwd(), "public", "projects", slug, "gallery");

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter(isAllowed)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((name) => `/projects/${slug}/gallery/${name}`);

    return NextResponse.json({ images: files });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
