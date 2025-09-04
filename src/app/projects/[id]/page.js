import projects from "@/data/projects.json";
import ProjectDetailClient from "@/components/ProjectDetailClient";

export async function generateStaticParams() {
  const list = Array.isArray(projects) ? projects : [];
  return list.map((p) => ({ id: String(p.id) }));
}

export default function ProjectDetailPage({ params }) {
  const list = Array.isArray(projects) ? projects : [];
  const project = list.find((p) => String(p.id) === String(params?.id));
  return <ProjectDetailClient project={project} />;
}
