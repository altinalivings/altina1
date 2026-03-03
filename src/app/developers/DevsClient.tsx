// src/app/developers/DevsClient.tsx
"use client";

import PageHero from "@/components/PageHero";
import FeaturedDevelopers from "@/components/FeaturedDevelopers";
import FloatingCTAs from "@/components/FloatingCTAs";
import { getDevelopersWithProjects } from "@/data/unified";

export default function DevsClient() {
  // ✅ Developers + their projects are derived from projects.ts
  const devs = getDevelopersWithProjects();

  return (
    <main>
      <PageHero
        title="Our Developers"
        subtitle={`${devs.length} premium developers across Delhi NCR`}
        image="/hero/developers.jpg"
        height="h-[44vh]"
      />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <FeaturedDevelopers items={devs as any} />

        {/* Show project counts per developer */}
        <section className="mt-12 golden-frame p-6">
          <h2 className="text-2xl font-semibold gold-text mb-4">
            Developer Portfolio
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {devs.map((d) => (
              <div
                key={d.slug}
                className="flex items-center justify-between border border-altina-gold/20 rounded-xl p-3"
              >
                <span className="font-medium">{d.name}</span>
                <span className="text-sm text-altina-gold">
                  {d.projectCount} {d.projectCount === 1 ? "project" : "projects"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <FloatingCTAs projectId={null} projectName={null} />
    </main>
  );
}
