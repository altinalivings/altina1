
import PageHero from "@/components/PageHero";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import projects from "@/data/projects.json";
import { Suspense } from "react";

export const metadata = {
  title: "Projects | ALTINA™ Livings",
  description: "Curated launches across Delhi NCR.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Projects"
        subtitle="Curated launches across Delhi NCR"
        image="https://images.unsplash.com/photo-1495433324511-bf8e92934d90?q=80&w=2400&auto=format&fit=crop"
      />

      {/* Pull the explorer up so its filter sits on the hero bottom */}
      <div className="-mt-20 sm:-mt-24 lg:-mt-28 relative z-10">
        <main className="mx-auto max-w-6xl px-4 pb-12">
          <ProjectsExplorer items={projects} />
        </main>
      </div>
    </div>
	<Suspense
      fallback={
        <div className="altina-container py-10">
          <div className="rounded-xl border p-6">Loading projects…</div>
        </div>
      }
    >
      <div className="altina-container py-8">
        <h1 className="mb-4 text-2xl font-semibold">Explore Projects</h1>
        <ProjectsExplorer items={data ?? []} />
      </div>
    </Suspense>
  );
}
