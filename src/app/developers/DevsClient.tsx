"use client";

import PageHero from "@/components/PageHero";
import FeaturedDevelopers from "@/components/FeaturedDevelopers";
import FloatingCTAs from "@/components/FloatingCTAs";

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
        <FeaturedDevelopers />
      </div>

      <FloatingCTAs projectId={null} projectName={null} />
    </main>
  );
}
