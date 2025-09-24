import projects from "@/data/projects.json";
import ProjectCard from "@/components/ProjectCard";

export const metadata = {
  title: "Luxury Properties in Noida | Altina™ Livings",
  description: "Discover luxury apartments, villas, and independent floors in Noida by top developers. Curated by Altina™ Livings.",
};

export default function CityPage() {
  const items = (projects as any[]).filter(p => (p.city||"").toLowerCase().includes("noida") || (p.city||"").toLowerCase().includes("noida"));
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Luxury Projects in Noida</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(p => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </main>
  );
}
