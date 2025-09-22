// src/app/developers/DevsClient.tsx
"use client";

import PageHero from "@/components/PageHero";
import FloatingCTAs from "@/components/FloatingCTAs";
import FeaturedDevelopers from "@/components/FeaturedDevelopers";
import developers from "@/data/developers.json";

type Dev = {
  id: string;
  name: string;
  logo?: string;
  city?: string;
  projectsCount?: number;
  description?: string;
  url?: string;
};

export default function DevsClient() {
  // developers.json example item shape (from your repo):
  // { slug, name, logo, hero, tagline, about, usps, stats, projects, map, ... }
  const raw = (Array.isArray(developers) ? (developers as any[]) : []) as any[];

  const items: Dev[] = raw.map((d) => {
    const id =
      d.id ??
      d.slug ??
      (typeof d.name === "string"
        ? d.name.toLowerCase().replace(/\s+/g, "-")
        : "developer");

    return {
      id,
      name: d.name ?? id,
      logo: d.logo,
      city: d.city, // optional in your JSON
      projectsCount: Array.isArray(d.projects) ? d.projects.length : d.projectsCount,
      description: d.tagline ?? d.about,
      url: d.url,
    } satisfies Dev;
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
