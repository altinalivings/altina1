// src/app/projects/ProjectsSchema.tsx
"use client";

import Script from "next/script";
import projects from "@/data/projects.json";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

const abs = (u?: string) => {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  return `${SITE}${u.startsWith("/") ? u : `/${u}`}`;
};

export default function ProjectsSchema() {
  const items = Array.isArray(projects) ? projects : [];

  const graph = items.map((p: any) => {
    const price = (p?.price || "").toString().replace(/[^\d.]/g, "") || undefined;
    return {
      "@type": "Product",
      name: p?.name || "",
      brand: p?.developer || "ALTINA™",
      description: [p?.configuration, p?.location, p?.city || "Delhi NCR"]
        .filter(Boolean)
        .join(" • "),
      image: p?.hero ? [abs(p.hero)] : undefined,
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "INR",
        url: abs(`/projects/${p?.id}`),
        availability: "https://schema.org/InStock",
      },
    };
  });

  const schema = { "@context": "https://schema.org", "@graph": graph };

  return (
    <Script
      id="projects-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
