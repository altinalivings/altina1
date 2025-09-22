// src/app/developers/DevsClient.tsx
"use client";

import PageHero from "@/components/PageHero";
import FloatingCTAs from "@/components/FloatingCTAs";
import FeaturedDevelopers from "@/components/FeaturedDevelopers";

// If you already have this file, great. If not, you can keep the fallback [].
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
  // Robust fallback so builds never fail if JSON is empty/missing shape
  const items = (Array.isArray(developers) ? (developers as Dev[]) : []) as Dev[];

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
