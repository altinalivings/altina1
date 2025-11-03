// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import projects from "@/data/projects";
import posts from "@/data/posts.json";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

function getLastModified(): string {
  try {
    const gitPath = path.join(process.cwd(), ".git");
    const stat = fs.statSync(gitPath);
    return new Date(stat.mtime).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

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
    {
      url: `${SITE}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // 🔹 Project detail entries
  const projectEntries: MetadataRoute.Sitemap = (projects as any[])
    .filter(Boolean)
    .map((p) => ({
      url: `${SITE}/projects/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      images: p.hero
        ? [
            {
              loc: p.hero.startsWith("http")
                ? p.hero
                : `${SITE}${p.hero.startsWith("/") ? p.hero : `/${p.hero}`}`,
              title: `${p.name} by ${p.developer || "Altina™ Livings"}`,
            },
          ]
        : undefined,
    }));

  // 🔹 Blog post entries
  const blogEntries: MetadataRoute.Sitemap = (posts as any[])
    .filter(Boolean)
    .map((b) => ({
      url: `${SITE}/blog/${b.slug}`,
      lastModified: b.lastmod || now,
      changeFrequency: "monthly",
      priority: 0.6,
      images: b.coverImage
        ? [
            {
              loc: b.coverImage.startsWith("http")
                ? b.coverImage
                : `${SITE}${b.coverImage.startsWith("/") ? b.coverImage : `/${b.coverImage}`}`,
              title: b.title,
            },
          ]
        : undefined,
    }));

  return [...base, ...projectEntries, ...blogEntries];
}
