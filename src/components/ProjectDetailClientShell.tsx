// src/components/ProjectDetailClientShell.tsx
"use client";

import * as HeroMod from "@/components/ProjectHeroWithInfo";
import * as DetailsMod from "@/components/ProjectDetailsSections";
import * as RelatedNS from "@/components/RelatedProjects";
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

function pick(mod: any, named: string) {
  if (!mod) return undefined;
  if (typeof mod === "function") return mod;
  const val = (mod as any).default ?? (mod as any)[named];
  return typeof val === "function" ? val : undefined;
}

const ProjectHeroWithInfo = pick(HeroMod, "ProjectHeroWithInfo");
const ProjectDetailsSections = pick(DetailsMod, "ProjectDetailsSections");
const RelatedProjects = pick(RelatedNS, "RelatedProjects");
const FloatingCTAs = pick(FloatMod, "FloatingCTAs");

if (!ProjectHeroWithInfo) {
  console.warn("[ProjectDetailClientShell] ProjectHeroWithInfo not found in module exports");
}
if (!ProjectDetailsSections) {
  console.warn("[ProjectDetailClientShell] ProjectDetailsSections not found in module exports");
}
if (!RelatedProjects) {
  console.warn("[ProjectDetailClientShell] RelatedProjects not found in module exports");
}
if (!FloatingCTAs) {
  console.warn("[ProjectDetailClientShell] FloatingCTAs not found in module exports");
}

export default function ProjectDetailClientShell({ project }: { project: Project }) {
  return (
    <>
      {ProjectHeroWithInfo ? (
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
      ) : null}

      <section className="relative z-0 max-w-6xl mx-auto px-4 pt-8 pb-10">
        {ProjectDetailsSections ? <ProjectDetailsSections project={project as any} /> : null}
      </section>

      <section className="relative z-0 max-w-6xl mx-auto px-4 pb-10">
        {RelatedProjects ? (
          <RelatedProjects currentId={project.id} developer={project.developer} city={project.city} />
        ) : null}
      </section>

      {FloatingCTAs ? <FloatingCTAs projectId={project.id} projectName={project.name} /> : null}
    </>
  );
}
