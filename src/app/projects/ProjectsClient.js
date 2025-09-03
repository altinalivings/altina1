"use client";

import { Suspense } from "react";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import projects from "@/data/projects.json";
import Image from "next/image";
import Link from "next/link";

export default function ProjectsClient() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("developer")?.toLowerCase() || "all";

  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    const dev = searchParams.get("developer");
    if (dev) setFilter(dev.toLowerCase());
  }, [searchParams]);

  const developers = [...new Set(projects.map((p) => p.developer))];

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter(
          (p) =>
            p.type.toLowerCase() === filter ||
            p.developer.toLowerCase() === filter
        );

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Filters (same as before) */}
        {/* Projects Grid (same as before) */}
      </div>
    </section>
      </Ssuspen>);
}
