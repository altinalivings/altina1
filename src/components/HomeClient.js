// src/components/HomeClient.js
"use client";

import Hero from "@/components/Hero";
import Link from "next/link";
import projects from "@/data/projects.json";

export default function HomeClient() {
  const list = Array.isArray(projects) ? projects.slice(0, 6) : [];

  return (
    <>
      <Hero />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Featured Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="block border rounded-lg p-4 hover:shadow">
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-600">{p.location}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
