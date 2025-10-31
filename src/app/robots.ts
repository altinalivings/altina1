// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.altinalivings.com";
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
