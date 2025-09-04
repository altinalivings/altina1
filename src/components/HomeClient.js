"use client";
import Link from "next/link";
import Hero from "./Hero";
import projects from "@/data/projects.json";

export default function HomeClient() {
  const featured = (projects || []).slice(0, 6);

  return (
    <div>
      <Hero />

      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mt-10">Featured Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {featured.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="group rounded-2xl overflow-hidden border hover:shadow-lg transition">
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img src={p.images?.[0] || "/placeholder.jpg"} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition" />
              </div>
              <div className="p-4">
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-600">{p.location}</div>
                {p.price && <div className="mt-1 text-sm">₹ {p.price}</div>}
                <span className="inline-block mt-3 text-[var(--brand)]">View Details →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/projects" className="inline-flex px-5 py-2 rounded-lg border">
            View All Projects
          </Link>
        </div>
      </div>

      {/* Floating CTA */}
      <a href="/contact" className="fab" aria-label="callback">
        ☏
      </a>
    </div>
  );
}
