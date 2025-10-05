
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProjectOverviewSection, Section } from "@/components/ProjectDetailsSections";

export default function ProjectDetailClient({ project }: { project: any }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">
      {project.hero && (
        <motion.img
          src={project.hero}
          alt={project.name}
          className="w-full rounded-2xl mb-8 shadow-xl border border-altina-gold/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}

      <h1 className="text-3xl font-semibold text-altina-gold mb-2">{project.name}</h1>
      {project.developer && (
        <p className="text-sm text-neutral-400 mb-6">by {project.developer}</p>
      )}

      <ProjectOverviewSection project={project} />

      {project.about && (
        <Section title="About the Project">
          <p>{project.about}</p>
        </Section>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <Section title="Key Highlights">
          <ul className="list-disc list-inside space-y-1">
            {project.highlights.map((h: string, i: number) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </Section>
      )}

      {project.amenities && project.amenities.length > 0 && (
        <Section title="Amenities">
          <ul className="list-disc list-inside space-y-1">
            {project.amenities.map((a: string, i: number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}

      {project.developer && (
        <Section title="About the Developer">
          <p>
            {project.developer} is among India’s most reputed real estate developers, known for
            premium design, construction quality, and landmark developments across NCR.
          </p>
        </Section>
      )}
    </div>
  );
}
