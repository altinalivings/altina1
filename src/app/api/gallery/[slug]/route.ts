// src/app/api/gallery/[slug]/route.ts
// Server API that lists images under /public/projects/<slug>/gallery (fallback to /public/projects/<slug>)
import fs from "fs";
import path from "path";

export const runtime = "nodejs"; // ensure Node (not Edge) so 'fs' works

function discover(slug: string): string[] {
  const roots = [
    path.join(process.cwd(), "public", "projects", slug, "gallery"),
    path.join(process.cwd(), "public", "projects", slug),
  ];
  const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

  for (const dir of roots) {
    try {
      const files = fs.readdirSync(dir).filter((f) => exts.has(path.extname(f).toLowerCase()));
      if (files.length) {
        files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
        // Build public URLs from the directory relative to /public
        const rel = dir.split(path.join(process.cwd(), "public"))[1].replace(/\\+/g, "/");
        return files.map((f) => `${rel}/${f}`);
      }
    } catch {
      // ignore ENOENT etc
    }
  }
  return [];
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params?.slug || "";
  const images = slug ? discover(slug) : [];
  return new Response(JSON.stringify({ images }), {
    headers: {
      "content-type": "application/json",
      // cache a bit on the CDN but allow quick updates in dev
      "cache-control": process.env.NODE_ENV === "production"
        ? "public, s-maxage=600, stale-while-revalidate=86400"
        : "no-store",
    },
  });
}
