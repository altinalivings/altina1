"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Connectivity = { label: string; time?: string };
export type Project = {
  id: string;
  name: string;
  developer?: string;
  brand?: string;
  city?: string;
  location?: string;
  configuration?: string;
  price?: string;
  hero?: string;
  brochure?: string;
  gallery?: string[];
  nearby?: { connectivity?: Connectivity[] };
  possession?: string;
  status?: string;
};

/** Generic section wrapper (keeps spacing + gold accents) */
export function Section({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative z-0 max-w-6xl mx-auto px-4 ${className}`}>
      {title ? (
        <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: "#C5A657" }}>
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

/** Golden at-a-glance row under hero */
export function GlanceBar({ p }: { p: Project }) {
  const items = [
    { label: "Configuration", value: p.configuration },
    { label: "Location", value: p.location || p.city },
    { label: "Price", value: p.price },
    { label: "Possession", value: p.possession || p.status },
  ].filter((x) => x.value);

  if (!items.length) return null;

  return (
    <div className="relative z-0">
      <div className="max-w-6xl mx-auto px-4">
        <div
          className="mt-4 rounded-2xl p-[1px]"
          style={{
            background: "linear-gradient(180deg, rgba(197,166,87,0.6) 0%, rgba(142,111,45,0.35) 100%)",
            boxShadow: "0 0 0 1px rgba(197,166,87,0.25) inset",
          }}
        >
          <div className="rounded-2xl bg-[#0D0D0D]/80 backdrop-blur px-4 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {items.map((it) => (
              <div key={it.label}>
                <div className="text-xs uppercase tracking-wide text-neutral-400">{it.label}</div>
                <div className="text-sm mt-0.5">{it.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Overview cards: Pricing • Possession • Connectivity */
export function ProjectOverviewSection({ project }: { project: Project }) {
  const conn =
    project?.nearby?.connectivity && project.nearby.connectivity.length
      ? project.nearby.connectivity
          .map((c) => (c.time ? `${c.label} (${c.time})` : c.label))
          .join(" • ")
      : project.location || project.city || "Well-connected to major nodes.";

  const cards = [
    {
      title: "Pricing",
      value: project.price || "TBA",
      hint: "Pricing & offers change frequently. Request a call for today’s availability.",
      icon: "₹",
    },
    {
      title: "Possession",
      value: project.possession || project.status || "To be announced",
      hint: "Timelines are indicative; please verify final dates at booking.",
      icon: "⏱",
    },
    {
      title: "Connectivity",
      value: conn,
      hint: "Quick access to metro/arterials improves rental & resale prospects.",
      icon: "↔",
    },
  ];

  return (
    <Section className="pt-8 pb-10">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="rounded-2xl p-[1px]"
            style={{
              background: "linear-gradient(180deg, rgba(197,166,87,0.55) 0%, rgba(142,111,45,0.35) 100%)",
              boxShadow: "0 0 0 1px rgba(197,166,87,0.22) inset",
            }}
          >
            <div className="rounded-2xl bg-[#0D0D0D]/85 backdrop-blur p-4 h-full">
              <div className="flex items-center gap-2">
                <div
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#0D0D0D] text-sm font-bold"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,246,214,0.92) 0%, rgba(255,246,214,0.8) 100%)",
                    boxShadow: "0 0 0 1px rgba(197,166,87,0.45) inset",
                  }}
                >
                  {c.icon}
                </div>
                <div className="text-sm font-semibold" style={{ color: "#C5A657" }}>
                  {c.title}
                </div>
              </div>
              <div className="mt-2 text-base">{c.value}</div>
              <div className="mt-2 text-xs text-neutral-400">{c.hint}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/** Related strip with gold accent */
export function RelatedProjects({
  text,
  href = "/projects",
}: {
  text: string;
  href?: string;
}) {
  return (
    <Section className="pt-6 pb-8">
      <div
        className="rounded-2xl p-[1px]"
        style={{
          background: "linear-gradient(180deg, rgba(197,166,87,0.5) 0%, rgba(142,111,45,0.3) 100%)",
          boxShadow: "0 0 0 1px rgba(197,166,87,0.25) inset",
        }}
      >
        <div className="rounded-2xl bg-[#0D0D0D]/80 backdrop-blur p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="text-base font-medium">Related projects</div>
            <div className="text-sm text-neutral-400 mt-0.5">{text}</div>
          </div>
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold border border-[#C5A657]/50 text-[#C5A657]"
          >
            View all projects
          </Link>
        </div>
      </div>
    </Section>
  );
}

/** FAQ block with gold header */
export function FAQsSection({ items }: { items: { q: string; a: string }[] }) {
  if (!items?.length) return null;
  return (
    <Section title="Frequently Asked Questions" className="pb-12">
      <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
        {items.map((f, idx) => (
          <details key={idx} className="group">
            <summary className="list-none cursor-pointer p-4 flex items-center justify-between">
              <span className="text-sm md:text-base">{f.q}</span>
              <span
                className="ml-3 rounded-md px-2 py-1 text-xs"
                style={{
                  color: "#0D0D0D",
                  background: "linear-gradient(180deg, rgba(255,246,214,0.92) 0%, rgba(255,246,214,0.8) 100%)",
                  boxShadow: "0 0 0 1px rgba(197,166,87,0.45) inset",
                }}
              >
                Open
              </span>
            </summary>
            <div className="p-4 pt-0 text-sm text-neutral-300">{f.a}</div>
          </details>
        ))}
      </div>
    </Section>
  );
}
