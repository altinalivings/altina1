// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import projects from "@/data/projects.json";
import developers from "@/data/developers.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.altinalivings.com";
  const now = new Date();

  const staticUrls = [
    "",
    "/projects",
    "/developers",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const projUrls = (projects as any[]).map((p) => ({
    url: `${base}/projects/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const devUrls = (developers as any[]).map((d) => ({
    url: `${base}/developers/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticUrls, ...projUrls, ...devUrls];
}
