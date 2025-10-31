// src/app/developers/DevsClient.tsx
"use client";

import PageHero from "@/components/PageHero";
import FeaturedDevelopers from "@/components/FeaturedDevelopers";
import FloatingCTAs from "@/components/FloatingCTAs";
import devs from "@/data/developers.json";

export default function DevsClient() {
  return (
    <main>
      <PageHero
        title="Our Developers"
        subtitle="DLF, Sobha, M3M, Godrej & more"
        image="/hero/developers.jpg"
        height="h-[44vh]"
      />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Pass required items prop to satisfy TypeScript */}
        <FeaturedDevelopers items={devs as any} />
      </div>

      <FloatingCTAs projectId={null} projectName={null} />
    </main>
  );
}