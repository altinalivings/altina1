// src/components/ProjectDetailClientShell.tsx
"use client";

import dynamic from "next/dynamic";
import React from "react";

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

type HeroProps = { project: Project };
type DetailsProps = { project: Project };
type RelatedProps = { currentId: string; developer?: string; city?: string };
type FloatingProps = { projectId: string; projectName: string };

// Use dynamic() and explicitly type props so TS knows these components accept props.
const ProjectHeroWithInfo = dynamic<HeroProps>(
  () =>
    import("@/components/ProjectHeroWithInfo").then((m: any) => (m.default ?? m.ProjectHeroWithInfo) as React.ComponentType<HeroProps>),
  { ssr: true }
);

const ProjectDetailsSections = dynamic<DetailsProps>(
  () =>
    import("@/components/ProjectDetailsSections").then((m: any) => (m.default ?? m.ProjectDetailsSections) as React.ComponentType<DetailsProps>),
  { ssr: true }
);

const RelatedProjects = dynamic<RelatedProps>(
  () =>
    import("@/components/RelatedProjects").then((m: any) => (m.default ?? m.RelatedProjects ?? (() => null)) as React.ComponentType<RelatedProps>),
  { ssr: true, loading: () => null as any }
);

const FloatingCTAs = dynamic<FloatingProps>(
  () => import("@/components/FloatingCTAs").then((m: any) => (m.default ?? m.FloatingCTAs) as React.ComponentType<FloatingProps>),
  { ssr: false }
);

export default function ProjectDetailClientShell({ project }: { project: Project }) {
  if (!project) return null;

  return (
    <>
      {/* HERO */}
      <ProjectHeroWithInfo project={project} />

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
