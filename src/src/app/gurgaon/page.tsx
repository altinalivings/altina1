import Link from "next/link";
import projects from "@/data/projects.json";

export const metadata = {
  title: "Luxury Properties in Gurugram | Altina™ Livings",
  description: "Discover luxury apartments, villas, and independent floors in Gurugram by top developers. Curated by Altina™ Livings.",
};

export default function CityPage() {
  const items = projects.filter(p => (p.city||"").toLowerCase().includes("gurugram"));
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Luxury Projects in Gurugram</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(p => (
          <li key={p.id} className="border border-white/10 rounded-xl p-4 hover:shadow">
            <Link href={`/projects/${p.slug}`} className="font-semibold hover:underline">{p.name}</Link>
            <p className="text-sm opacity-80">{p.location || p.city}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
