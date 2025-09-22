// src/app/developers/DevsClient.tsx
"use client";

import PageHero from "@/components/PageHero";
import FloatingCTAs from "@/components/FloatingCTAs";
import FeaturedDevelopers from "@/components/FeaturedDevelopers";
import developers from "@/data/developers.json";
import type { ComponentProps } from "react";

// Get the EXACT items type that FeaturedDevelopers expects
type FeaturedItems = ComponentProps<typeof FeaturedDevelopers>["items"];

export default function DevsClient() {
  const raw = (Array.isArray(developers) ? (developers as any[]) : []) as any[];

  const toKebab = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const items: FeaturedItems = raw.map((d) => {
    const base =
      d.id ??
      d.slug ??
      (typeof d.name === "string" ? toKebab(d.name) : "developer");

    return {
      // Ensure fields that FeaturedDevelopers requires are present
      id: base,
      slug: d.slug ?? base,
      name: d.name ?? base,
      logo: d.logo,
      city: d.city,
      projectsCount: Array.isArray(d.projects) ? d.projects.length : d.projectsCount,
      description: d.tagline ?? d.about,
      url: d.url,
    };
  });

  return (
    <div className="min-h-screen">
      <PageHero
        title="Developers"
        subtitle="Trusted partners across Delhi NCR"
        image="https://images.unsplash.com/photo-1495433324511-bf8e92934d90?q=80&w=2400&auto=format&fit=crop"
      />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <FeaturedDevelopers items={items} />
      </div>

      <FloatingCTAs projectId={null} projectName={null} />
    </div>
  );
}
