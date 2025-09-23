// src/components/ProjectDetailClientShell.tsx
"use client";

import dynamic from "next/dynamic";

type Project = {
  id: string;
  name: string;
  developer?: string;
  city?: string;
  location?: string;
  configuration?: string;
  price?: string;
  hero?: string;
  brochure?: string;
  images?: string[];
};

// IMPORTANT: server components must be pulled in via dynamic() from a client shell.
// We don't change their source files; we just import them safely and support both
// default and named exports.

const ProjectHeroWithInfo = dynamic(
  () =>
    import("@/components/ProjectHeroWithInfo").then((m: any) => m.default ?? m.ProjectHeroWithInfo),
  { ssr: true }
);

const ProjectDetailsSections = dynamic(
  () =>
    import("@/components/ProjectDetailsSections").then((m: any) => m.default ?? m.ProjectDetailsSections),
  { ssr: true }
);

const RelatedProjects = dynamic(
  () =>
    import("@/components/RelatedProjects").then((m: any) => m.default ?? m.RelatedProjects ?? (() => null)),
  { ssr: true, loading: () => null as any }
);

// Floating CTAs are typically client-only; render on client.
const FloatingCTAs = dynamic(
  () => import("@/components/FloatingCTAs").then((m: any) => m.default ?? m.FloatingCTAs),
  { ssr: false }
);

export default function ProjectDetailClientShell({ project }: { project: Project }) {
  if (!project) return null;

  return (
    <>
      {/* HERO */}
      <ProjectHeroWithInfo
        id={project.id}
        name={project.name}
        developer={project.developer}
        city={project.city}
        location={project.location}
        hero={project.hero}
        configuration={project.configuration}
        price={project.price}
        brochure={project.brochure}
        images={project.images}
      />

      {/* DETAILS */}
      <section className="relative z-10">
        <ProjectDetailsSections project={project} />
      </section>

      {/* RELATED PROJECTS */}
      <section className="relative z-0 max-w-6xl mx-auto px-4 pb-10">
        <RelatedProjects currentId={project.id} developer={project.developer} city={project.city} />
      </section>

      {/* FLOATING CTAs (client) */}
      <FloatingCTAs projectId={project.id} projectName={project.name} />
    </>
  );
}
