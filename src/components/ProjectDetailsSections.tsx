
"use client";

import React from "react";
import { motion } from "framer-motion";

type SectionProps = { title: string; children: React.ReactNode };

export const Section = ({ title, children }: SectionProps) => (
  <section className="my-8 border border-altina-gold/30 rounded-2xl p-6 bg-[#0D0D0D]/80 shadow-lg">
    <h2 className="text-xl font-semibold text-altina-gold mb-4 border-b border-altina-gold/40 pb-2">
      {title}
    </h2>
    <div className="text-neutral-200 text-sm leading-relaxed">{children}</div>
  </section>
);

export const ProjectOverviewSection = ({ project }: { project: any }) => {
  const info = [
    { label: "Price", value: project.price },
    { label: "Configuration", value: project.configuration },
    { label: "Possession", value: project.possession },
    { label: "Location", value: project.location },
    { label: "RERA", value: project.rera },
  ].filter(i => i.value);

  return (
    <motion.section
      className="my-8 border border-altina-gold/40 rounded-2xl p-6 bg-[#111]/70 shadow-altina backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-semibold text-altina-gold mb-5 border-b border-altina-gold/30 pb-2">
        Project Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {info.map((item, i) => (
          <div
            key={i}
            className="flex flex-col justify-between border border-altina-gold/20 rounded-xl p-4 bg-[#0B0B0C]/80 hover:bg-[#141414]/90 transition-all"
          >
            <span className="text-neutral-400 text-xs uppercase tracking-wider mb-1">
              {item.label}
            </span>
            <span className="text-altina-gold text-base font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
};
