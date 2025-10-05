"use client";

import React from "react";
import { Section, ProjectOverviewSection } from "@/components/ProjectDetailsSections";

export default function ProjectDetailClient({ project }: { project: any }) {
  return (
    <>
      <ProjectOverviewSection project={project} />
      {/* Example of reusing Section wrapper if you want to place extra blocks */}
      {/* <Section title="More details"><div className="p-4">…</div></Section> */}
    </>
  );
}
