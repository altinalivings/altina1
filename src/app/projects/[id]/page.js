import projects from "../../../data/projects.json";   // ✅ only once
import ProjectDetailClient from "@/components/ProjectDetailClient";

export async function generateStaticParams() {
  return (projects || []).map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }) {
  const project = projects.find((p) => p.id === params.id);
  if (!project) {
    return {
      title: "Project Not Found | Altina Livings",
      description: "Explore premium real estate projects with Altina Livings.",
    };
  }

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `https://yourdomain.com/projects/${project.id}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.image, width: 1200, height: 630, alt: project.title }],
      url: `https://yourdomain.com/projects/${project.id}`,
      siteName: "Altina Livings",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}

export default function ProjectPage({ params }) {
  const project = projects.find((p) => p.id === params.id);
  if (!project) return <div className="p-6">Project not found</div>;

  return <ProjectDetailClient project={project} />;
}
