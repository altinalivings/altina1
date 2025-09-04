import { Suspense } from "react";
import ProjectsClient from "@/components/ProjectsClient";
import projects from "@/data/projects.json";

export const metadata = { title: "Projects | Altina Livings" };

export default function ProjectsPage() {
  const list = Array.isArray(projects) ? projects : [];
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">All Projects</h1>
      <Suspense>
        <ProjectsClient projects={list} />
      </Suspense>
    </div>
  );
}
