"use client";

import React from "react";
import ProjectDetailsSections from "@/components/ProjectDetailsSections";

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
  nearby?: { connectivity?: ConnectivityItem[] };
  possession?: string;
  status?: string;
};

function TitleCard({ p }: { p: Project }) {
  const openLead = (mode: "callback" | "site-visit") =>
    window.dispatchEvent(
      new CustomEvent("lead:open", {
        detail: { mode, projectId: p.id, projectName: p.name },
      })
    );

  const downloadBrochure = () =>
    window.dispatchEvent(
      new CustomEvent("lead:open", {
        detail: { mode: "brochure", projectId: p.id, projectName: p.name },
      })
    );

  return (
    <div className="absolute left-4 right-4 bottom-6 max-w-4xl">
      <div
        className="inline-block rounded-2xl p-[1px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(197,166,87,0.7) 0%, rgba(142,111,45,0.5) 100%)",
          boxShadow: "0 0 0 1px rgba(197,166,87,0.35) inset",
        }}
      >
        <div className="rounded-2xl bg-[#0D0D0D]/85 backdrop-blur px-5 py-4">
          <h1 className="text-2xl md:text-3xl font-bold">{p.name}</h1>
          <p className="mt-1 text-neutral-300">
            {p.configuration ? `${p.configuration} • ` : ""}
            {p.location || p.city}
          </p>
          {p.price ? (
            <div className="mt-2 text-[#C5A657] font-semibold">{p.price}</div>
          ) : null}

          {/* Primary CTAs (UNCHANGED) */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => openLead("callback")}
              className="rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                color: "#0D0D0D",
                background:
                  "linear-gradient(180deg, rgba(255,246,214,0.92) 0%, rgba(255,246,214,0.8) 100%)",
                boxShadow: "0 0 0 1px rgba(197,166,87,0.45) inset",
              }}
            >
              Request Call
            </button>
            <button
              onClick={downloadBrochure}
              className="rounded-full px-4 py-2 text-sm font-semibold border border-[#C5A657]/50 text-[#C5A657]"
            >
              Download Brochure
            </button>
            <button
              onClick={() => openLead("site-visit")}
              className="rounded-full px-4 py-2 text-sm font-semibold border border-white/15 text-white/90"
            >
              Organize Site Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RelatedProjectsRow({ brand, city }: { brand?: string; city?: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <div
        className="rounded-2xl p-[1px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(197,166,87,0.25) 0%, rgba(142,111,45,0.15) 100%)",
          boxShadow: "0 0 0 1px rgba(197,166,87,0.25) inset",
        }}
      >
        <div className="rounded-2xl bg-[#0D0D0D] p-4 flex items-center justify-between">
          <div className="text-sm text-neutral-300">
            More from {brand || "this developer"} in {city || "Delhi-NCR"}.
          </div>
          <a
            href="/projects"
            className="rounded-full px-4 py-2 text-sm font-semibold border border-[#C5A657]/50 text-[#C5A657]"
          >
            View all projects
          </a>
        </div>
      </div>
    </div>
  );
}

function FAQsSection({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 mb-12">
      <h3 className="mb-4 text-xl font-semibold text-[#E8D8A8]">
        Frequently Asked Questions
      </h3>
      <div className="space-y-2">
        {items.map((it, i) => (
          <details key={i}
            className="rounded-xl border"
            style={{
              borderColor: "rgba(197,166,87,0.22)",
              background:
                "linear-gradient(180deg, rgba(197,166,87,0.09) 0%, rgba(142,111,45,0.05) 100%)",
              boxShadow: "0 0 0 1px rgba(197,166,87,0.12) inset",
            }}
          >
            <summary className="cursor-pointer list-none px-4 py-3 text-sm text-[#E8D8A8]">
              {it.q}
            </summary>
            <div className="px-4 pb-4 text-sm text-neutral-200">{it.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetailClientShell({ project }: { project: Project }) {
  const p = project;

  return (
    <div className="w-full">
      {/* HERO */}
      <div className="relative h-[44vh] min-h-[360px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.hero || "/hero-fallback.jpg"}
          alt={p.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />

        {/* Title Card + CTAs (gold) */}
        <TitleCard p={p} />
      </div>

      {/* GOLD “at-a-glance” + Location/Connectivity */}
      <ProjectDetailsSections project={p} />

      {/* Related */}
      <RelatedProjectsRow brand={p.brand || p.developer} city={p.city} />

      {/* FAQs auto-built from project fields */}
      <FAQsSection
        items={[
          {
            q: `What is the price of ${p.name}?`,
            a:
              p.price ||
              "Pricing will be shared by our team. Please request a call for latest offers and availability.",
          },
          {
            q: `When is possession for ${p.name}?`,
            a: p.possession || p.status || "To be announced.",
          },
          {
            q: `How is the connectivity for ${p.name}?`,
            a:
              (Array.isArray(p?.nearby?.connectivity) &&
                p!.nearby!.connectivity!
                  .map((c) => (c.time ? `${c.label} (${c.time})` : c.label))
                  .join(" • ")) ||
              p.location ||
              "Well-connected to major city nodes.",
          },
        ]}
      />
    </div>
  );
}
