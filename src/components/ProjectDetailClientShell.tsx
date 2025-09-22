// src/components/ProjectDetailClientShell.tsx
"use client";
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

function pick<T = any>(mod: any, named: string): T {
  const candidate = (mod && (mod[named] ?? mod.default)) as any;
  if (typeof candidate === "function") return candidate as T;
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[ProjectDetailClientShell] Missing component export '${named}'. Module keys:`, mod && Object.keys(mod || {}));
  }
  // return a no-op component to avoid SSR crash while we log
  return (() => null) as unknown as T;
}

const ProjectHeroWithInfo = pick(HeroMod, "ProjectHeroWithInfo");
const ProjectDetailsSections = pick(DetailsMod, "ProjectDetailsSections");
const FloatingCTAs = pick(FloatMod, "FloatingCTAs");
const RelatedProjectsNS = { RelatedProjects };
const RelatedProjectsPicked = pick(RelatedProjectsNS, "RelatedProjects");

export default function ProjectDetailClientShell({ project }: { project: Project }) {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* HERO */}
      <div className="mb-8">
        <ProjectHeroWithInfo project={project} />
      </div>

      {/* DETAILS */}
      <div className="mb-12">
        <ProjectDetailsSections project={project} />
      </div>

      {/* RELATED */}
      <div className="my-12">
        <RelatedProjectsPicked project={project} />
      </div>

      {/* FLOATING CTAs */}
      <FloatingCTAs projectId={project?.id ?? null} projectName={project?.name ?? null} />
    </div>
  );
}
