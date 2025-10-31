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

// Parse INR like "₹4.7 Cr", "85 Lakh", or plain numbers
function priceNumber(p?: string) {
  if (!p) return undefined;
  const str = p.toLowerCase().replace(/[₹,\s]/g, "").trim();
  const cr = str.match(/^([\d.]+)(cr|crore)$/);
  if (cr) return String(Math.round(parseFloat(cr[1]) * 10000000));
  const lk = str.match(/^([\d.]+)(l|lakh)$/);
  if (lk) return String(Math.round(parseFloat(lk[1]) * 100000));
  const n = parseFloat(str);
  if (!isNaN(n)) {
    if (n < 1000) return String(Math.round(n * 10000000)); // treat small like "4.7" as Cr
    return String(Math.round(n));
  }
  return undefined;
}

export default function ProjectsSchema() {
  const items = Array.isArray(projects) ? projects : [];

  const graph = items
    .map((p: any) => {
      const priceValue = priceNumber(p?.price);
      if (!priceValue) return null; // ⟵ SKIP items without numeric price

      return {
        "@type": "Product",
        name: p?.name || "",
        sku: p?.id || "",
        brand: p?.developer
          ? { "@type": "Brand", name: p.developer }
          : { "@type": "Brand", name: "ALTINA™ Livings" },
        description: [p?.configuration, p?.location, p?.city || "Delhi NCR"]
          .filter(Boolean)
          .join(" • "),
        image: p?.hero ? [abs(p.hero)] : undefined,
        category: "Real Estate",
        url: abs(`/projects/${p?.slug || p?.id}`),
        offers: {
          "@type": "Offer",
          price: priceValue,
          priceCurrency: "INR",
          url: abs(`/projects/${p?.slug || p?.id}`),
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/InStock",
          priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
            .toISOString()
            .slice(0, 10),
          seller: {
            "@type": "Organization",
            name: "ALTINA™ Livings",
            url: SITE,
            telephone: "+91-9891234195",
          },
        },
      };
    })
    .filter(Boolean); // remove null entries

  if (!graph.length) return null; // nothing to output

  const schema = { "@context": "https://schema.org", "@graph": graph };

  return (
    <Script
      id="projects-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
