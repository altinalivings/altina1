// src/components/ProjectDetailClientShell.tsx

import Image from "next/image";
import Link from "next/link";
import { GlanceBar, FAQsSection, RelatedProjects } from "./ProjectDetailsSections";

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
    connectivity?: { label: string; time?: string }[];
  };
  possession?: string;
  status?: string;
};

export default function ProjectDetailClientShell({ project }: { project: Project }) {
  const p = project;

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

        {/* Title Card */}
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

              {/* Primary CTAs */}
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
      </div>

      {/* GOLD AT-A-GLANCE */}
      <GlanceBar p={p} />

      {/* (Your existing blocks — gallery/amenities/etc — can stay below) */}

      {/* Related */}
      <RelatedProjects
        text={`More from ${p.brand || p.developer || "the same brand"} in ${
          p.city || "Delhi NCR"
        }.`}
        href="/projects"
      />

      {/* FAQs (auto-built from JSON fields) */}
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

function pick<T = any>(mod: any, named: string) {
  return (mod?.default ?? mod?.[named]) as T;
}

const ProjectHeroWithInfo = pick(HeroMod, "ProjectHeroWithInfo");
const ProjectDetailsSections = pick(DetailsMod, "ProjectDetailsSections");
const RelatedProjects = pick(RelatedMod, "RelatedProjects");
// const ProjectCTARail = pick(RailMod, "ProjectCTARail");
const FloatingCTAs = pick(FloatMod, "FloatingCTAs");

export default function ProjectDetailClientShell({ project }: { project: Project }) {
  return (
    <>
      {ProjectHeroWithInfo && (
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
      )}

      {/* Removed CTA rail to avoid duplicate emerald/gold buttons */}

      <section className="relative z-0 max-w-6xl mx-auto px-4 pt-8 pb-10">
        {ProjectDetailsSections && <ProjectDetailsSections project={project as any} />}
      </section>

      <section className="relative z-0 max-w-6xl mx-auto px-4 pb-10">
        {RelatedProjects && (
          <RelatedProjects
            currentId={project.id}
            developer={project.developer}
            city={project.city}
          />
        )}
      </section>

      {FloatingCTAs && <FloatingCTAs projectId={project.id} projectName={project.name} />}
    </>
  );
}
