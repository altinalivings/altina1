// src/app/robots.ts
import type { MetadataRoute } from "next";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

/**
 * Robots rules:
 *  - In production: index everything and point to the sitemap
 *  - In non-production (preview/dev): noindex to avoid duplicate indexing
 */
export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV === "production";

  if (!isProd) {
    // Prevent preview/dev builds from being indexed
    return {
      rules: [
        { userAgent: "*", disallow: "/" },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // (Optionally disallow private internals; harmless to leave allowed)
        disallow: ["/api/*", "/_next/", "/static/"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
