"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProjectOverviewSection, Section } from "@/components/ProjectDetailsSections";

export default function ProjectDetailClient({ project }: { project: any }) {
  // This client component is kept lightweight and only renders the overview trio,
  // so it compiles even if you don’t use it directly elsewhere.
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
