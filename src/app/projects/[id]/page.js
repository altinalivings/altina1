// src/app/projects/[id]/page.js
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";
import projects from "@/data/projects.json";

// Pre-render dynamic routes for known projects (optional but nice)
export function generateStaticParams() {
  try {
    if (Array.isArray(projects)) {
      return projects.map((p) => ({ id: p.id }));
    }
  } catch {}
  return [];
}

// Safe metadata — avoid OpenGraph type "product" (caused your error)
export function generateMetadata({ params }) {
  const project =
    Array.isArray(projects) && projects.find((p) => p.id === params.id);

  const title = project?.name || project?.title || "Project";
  const description =
    project?.description ||
    `${project?.developer ? project.developer + " · " : ""}${
      project?.location || ""
    }`;
  const image = project?.image || "/og-default.jpg";

  return {
    title: `${title} | Altina`,
    description,
    openGraph: {
      type: "website",
      title: `${title} | Altina`,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Altina`,
      description,
      images: [image],
    },
  };
}

// Pull a project by id
function getProjectById(id) {
  if (!Array.isArray(projects)) return null;
  return projects.find((p) => String(p.id) === String(id)) || null;
}

export default function ProjectDetailPage({ params }) {
  const project = getProjectById(params.id);

  if (!project) {
    // If id not found, go to 404
    return notFound();
  }

  return (
    <main className="main-with-header">
      <div className="altina-container py-4">
        {/* Tiny breadcrumb */}
        <nav className="mb-3 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a> <span>/</span>{" "}
          <a href="/projects" className="hover:underline">Projects</a> <span>/</span>{" "}
          <span className="text-gray-700 font-medium">
            {project.name || project.title}
          </span>
        </nav>
      </div>

      {/* 🚀 Single source of truth for the page layout.
          This component contains:
          - Premium Hero (gold→blue ribbon + shine)
          - In-banner rotating highlights (project.usp)
          - Gallery with lightbox
          - Amenities
          - Floorplans (uses project.floorplans array)
          - Sticky enquiry form with gradient border
      */}
      <ProjectDetailClient project={project} />

      {/* 💡 NOTE:
          We intentionally removed the old "Project Highlights" section from this file.
          Highlights now live INSIDE the banner in ProjectDetailClient’s <Hero />.
      */}
    </main>
  );
}
