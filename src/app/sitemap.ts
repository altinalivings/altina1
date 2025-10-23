// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import projects from "@/data/projects.json";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

/**
 * Generates a clean XML sitemap:
 *  - Homepage, /projects listing
 *  - One URL per project from data/projects.json
 *  - Weekly change frequency; priorities tuned for listing & detail pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages (add more routes here if needed)
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

  // Project detail pages
  const projectEntries: MetadataRoute.Sitemap = (projects as any[])
    .filter(Boolean)
    .map((p) => ({
      url: `${SITE}/projects/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...base, ...projectEntries];
}
