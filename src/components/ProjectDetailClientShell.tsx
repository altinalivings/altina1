// src/components/ProjectDetailClientShell.tsx
"use client";

import * as React from "react";
import * as HeroMod from "@/components/ProjectHeroWithInfo";
import * as DetailsMod from "@/components/ProjectDetailsSections";
import RelatedProjects from "@/components/RelatedProjects";
import * as FloatMod from "@/components/FloatingCTAs";

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

type Props = { project: Project };

// Helper to support either default or named exports from modules
function pick<T = any>(mod: any, named: string) {
  return (mod?.default ?? mod?.[named]) as T;
}

const ProjectHeroWithInfo = pick<any>(HeroMod, "ProjectHeroWithInfo");
const ProjectDetailsSections = pick<any>(DetailsMod, "ProjectDetailsSections");
const FloatingCTAs = pick<any>(FloatMod, "FloatingCTAs");

export default function ProjectDetailClientShell({ project }: Props) {
  return (
    <>
      {ProjectHeroWithInfo && <ProjectHeroWithInfo project={project} />}

      <div className="mx-auto max-w-6xl px-4">
        {ProjectDetailsSections && (
          <ProjectDetailsSections project={project} />
        )}
      </div>

      <section className="relative z-0 max-w-6xl mx-auto px-4 pb-10">
        <RelatedProjects
          currentId={project.id}
          developer={project.developer}
          city={project.city}
        />
      </section>

      {FloatingCTAs && (
        <FloatingCTAs projectId={project.id} projectName={project.name} />
      )}
    </>
  );
}
