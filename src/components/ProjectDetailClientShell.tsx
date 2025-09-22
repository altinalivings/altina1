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

function pick<T = any>(mod: any, named: string) {
  return (mod?.default ?? mod?.[named]) as T;
}

const ProjectHeroWithInfo = pick<any>(HeroMod, "ProjectHeroWithInfo");
const ProjectDetailsSections = pick<any>(DetailsMod, "ProjectDetailsSections");
const FloatingCTAs = pick<any>(FloatMod, "FloatingCTAs");

export default function ProjectDetailClientShell({ project }: Props) {
  // Guard RelatedProjects to avoid rendering non-function
  const RP: any = RelatedProjects;
  const rpIsRenderable = typeof RP === "function";

  return (
    <>
      {ProjectHeroWithInfo && <ProjectHeroWithInfo project={project} />}

      <div className="mx-auto max-w-6xl px-4">
        {ProjectDetailsSections && (
          <ProjectDetailsSections project={project} />
        )}
      </div>

      <section className="relative z-0 max-w-6xl mx-auto px-4 pb-10">
        {rpIsRenderable ? (
          <RP
            currentId={project.id}
            developer={project.developer}
            city={project.city}
          />
        ) : (
          <div className="text-sm text-white/60">
            (debug) RelatedProjects is not a component
          </div>
        )}
      </section>

      {FloatingCTAs && (
        <FloatingCTAs projectId={project.id} projectName={project.name} />
      )}
    </>
  );
}
