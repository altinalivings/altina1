// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import projects from "@/data/projects.json";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

/**
 * Helper: get approximate last modified date of your repo (fallback to current time).
 * In Vercel builds, we'll use the current deployment date if git data isn't available.
 */
function getLastModified(): string {
  try {
    // Try reading the .git directory mtime if exists
    const gitPath = path.join(process.cwd(), ".git");
    const stat = fs.statSync(gitPath);
    return new Date(stat.mtime).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Generate XML sitemap entries for:
 *  - Home
 *  - /projects listing
 *  - All individual projects
 *  - Includes <image:image> tags for hero images (Image SEO)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = getLastModified();

  const base: MetadataRoute.Sitemap = [
    {
      url: `${SITE}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const projectEntries: MetadataRoute.Sitemap = (projects as any[])
    .filter(Boolean)
    .map((p) => ({
      url: `${SITE}/projects/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      // 🖼️ Include hero image for Google Images
      images: p.hero
        ? [
            {
              loc: p.hero.startsWith("http")
                ? p.hero
                : `${SITE}${p.hero.startsWith("/") ? p.hero : `/${p.hero}`}`,
              title: `${p.name} by ${p.developer || "Altina Livings"}`,
            },
          ]
        : undefined,
    }));

  return [...base, ...projectEntries];
}
