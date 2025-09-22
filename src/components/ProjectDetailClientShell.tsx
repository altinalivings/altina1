// src/components/ProjectDetailClientShell.tsx
"use client";

import * as HeroMod from "@/components/ProjectHeroWithInfo";
import * as DetailsMod from "@/components/ProjectDetailsSections";
import RelatedProjects from "@/components/RelatedProjects";
// Namespace shim (keeps existing JSX working)
const RelatedMod = { RelatedProjects };
// removed: import * as RailMod from "@/components/ProjectCTARail";
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

function pick<T = any>(mod: any, named: string) {
  return (mod?.default ?? mod?.[named]) as T;
}

const ProjectHeroWithInfo = pick(HeroMod, "ProjectHeroWithInfo");
const ProjectDetailsSections = pick(DetailsMod, "ProjectDetailsSections");
const RelatedProjects = pick(RelatedMod, "RelatedProjects");
// const ProjectCTARail = pick(RailMod, "ProjectCTARail");
const FloatingCTAs = pick(FloatMod, "FloatingCTAs");

export default function ProjectDetailClientShell({ project }: { project: Project }) {
  return (
    <>
      {ProjectHeroWithInfo && (
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
      )}

      {/* Removed CTA rail to avoid duplicate emerald/gold buttons */}

      <section className="relative z-0 max-w-6xl mx-auto px-4 pt-8 pb-10">
        {ProjectDetailsSections && <ProjectDetailsSections project={project as any} />}
      </section>

      <section className="relative z-0 max-w-6xl mx-auto px-4 pb-10">
        {RelatedProjects && (
          <RelatedProjects
            currentId={project.id}
            developer={project.developer}
            city={project.city}
          />
        )}
      </section>

      {FloatingCTAs && <FloatingCTAs projectId={project.id} projectName={project.name} />}
    </>
  );
}
