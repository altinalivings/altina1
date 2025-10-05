"use client";

import React from "react";

type ConnectivityItem = { label: string; time?: string };
type Project = {
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
  nearby?: {
    connectivity?: ConnectivityItem[];
  };
  possession?: string;
  status?: string;
};

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
        <h2 className="mb-4 text-xl font-semibold text-[#E8D8A8]">
          {title}
        </h2>
      ) : null}
      <div
        className="rounded-2xl p-[1px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(197,166,87,0.25) 0%, rgba(142,111,45,0.15) 100%)",
          boxShadow: "0 0 0 1px rgba(197,166,87,0.25) inset",
        }}
      >
        <div className="rounded-2xl bg-[#0D0D0D]">
          {children}
        </div>
      </div>
    </section>
  );
}

export function ConnectivityChips({
  items,
}: {
  items?: ConnectivityItem[];
}) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className="mt-4">
      <div className="text-sm text-neutral-300 mb-2">Connectivity</div>
      <div className="flex flex-wrap gap-2">
        {items.map((c, i) => (
          <span
            key={`${c.label}-${i}`}
            className="rounded-full border px-3 py-1 text-xs"
            style={{
              borderColor: "rgba(197,166,87,0.35)",
              background:
                "linear-gradient(180deg, rgba(197,166,87,0.10) 0%, rgba(142,111,45,0.06) 100%)",
              boxShadow: "0 0 0 1px rgba(197,166,87,0.15) inset",
              color: "#E8D8A8",
            }}
          >
            {c.label}
            {c.time ? ` (${c.time})` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Compact “at-a-glance” cards for Price / Possession / Connectivity */
export function ProjectOverviewSection({ project }: { project: Project }) {
  const price = project?.price || "TBA";
  const possession = project?.possession || project?.status || "TBA";
  const connText =
    Array.isArray(project?.nearby?.connectivity) &&
    project!.nearby!.connectivity!.length > 0
      ? project!.nearby!.connectivity!
          .slice(0, 2)
          .map((c) => (c.time ? `${c.label} (${c.time})` : c.label))
          .join(" • ")
      : (project?.location || project?.city || "Well-connected");

  const Card = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="rounded-xl border p-4"
      style={{
        borderColor: "rgba(197,166,87,0.22)",
        background:
          "linear-gradient(180deg, rgba(197,166,87,0.09) 0%, rgba(142,111,45,0.05) 100%)",
        boxShadow: "0 0 0 1px rgba(197,166,87,0.12) inset",
      }}
    >
      <div className="text-xs uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="mt-1 text-[15px] font-semibold text-[#E8D8A8]">{value}</div>
    </div>
  );

  return (
    <Section className="pt-8 pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4">
        <Card label="Pricing" value={price} />
        <Card label="Possession" value={possession} />
        <Card label="Connectivity" value={connText} />
      </div>
    </Section>
  );
}

/** Full details block (kept minimal – you can expand later) */
export default function ProjectDetailsSections({ project }: { project: Project }) {
  return (
    <>
      {/* Overview */}
      <ProjectOverviewSection project={project} />

      {/* Location & Connectivity */}
      {(project.location ||
        (project.nearby && Array.isArray(project.nearby.connectivity))) && (
        <Section title="Location & Connectivity" className="mt-6 mb-8">
          <div className="p-4">
            {project.location ? (
              <p className="text-sm text-neutral-300">{project.location}</p>
            ) : null}

            <ConnectivityChips items={project?.nearby?.connectivity} />
          </div>
        </Section>
      )}
    </>
  );
}
