import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

function naturalSort(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const root = process.cwd();
  const primary = path.join(root, "public", "projects", slug, "gallery");
  const fallback = path.join(root, "public", "projects", slug);

  const tryList = (dir: string): string[] => {
    try {
      const files = fs.readdirSync(dir);
      const imgs = files.filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f));
      imgs.sort(naturalSort);
      return imgs.map((f) => `projects/${slug}/${dir.endsWith("gallery") ? "gallery/" : ""}${f}`);
    } catch {
      return [];
    }
  };

  let list = tryList(primary);
  if (!list.length) list = tryList(fallback);

  return NextResponse.json({ images: list });
}
