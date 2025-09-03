"use client";

import { useState } from "react";
import projects from "@/data/projects.json";
import Link from "next/link";
import Image from "next/image";

export default function ProjectsClient() {
  const [filter, setFilter] = useState("All");

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter(
          (p) => p.type === filter || p.developer === filter
        );

  const filters = ["All", "Residential", "Commercial", ...new Set(projects.map((p) => p.developer))];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg border ${
                filter === f
                  ? "bg-gold-600 text-white border-gold-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gold-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600">{project.location}</p>
                <p className="text-gold-600 font-semibold mb-4">
                  {project.price}
                </p>
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-block bg-gold-600 text-white px-5 py-2 rounded-lg hover:bg-gold-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
