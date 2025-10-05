"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProjectOverviewSection, Section, Project as ProjectType } from "@/components/ProjectDetailsSections";

export default function ProjectDetailClient({ project }: { project: ProjectType }) {
  return (
    <Section className="pt-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35 }}
      >
        <ProjectOverviewSection project={project} />
      </motion.div>
    </Section>
  );
}
