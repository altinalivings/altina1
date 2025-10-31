// src/components/ProjectDetailClient.tsx
"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import amenitiesDict from "@/data/amenities.json";
import { GatedDownloadButton } from "@/components/BrochureLeadGate";
import ProjectCTARail from "@/components/ProjectCTARail";
import dynamic from "next/dynamic";

// ProjectGallery is a SERVER component; render via dynamic from this client component
const ProjectGallery = dynamic(() => import("@/components/ProjectGallery"), { ssr: true });

type AmenityMap = { id: string; label: string; icon?: string };
const AMENITIES = amenitiesDict as AmenityMap[];

type Project = {
  id: string;
  name: string;
  developer?: string;
  brand?: string;
  rating?: number;
  location?: string;
  city?: string;
  state?: string;
  sector?: string;
  micro_market?: string;
  rera?: string;
  status?: string;
  construction_status?: string;
  possession?: string;
  launch?: string;
  price?: string;
  configuration?: string;
  typologies?: string[];
  sizes?: string;
  land_area?: string;
  towers?: number;
  floors?: number;
  total_units?: number;
  bank_approvals?: string[];
  usp?: string[];
  highlights?: string[];
  amenities?: string[];
  specs?: Record<string, string>;
  about?: string;
  brochure?: string;
  hero?: string;
  gallery?: string[];
  map?: { embed?: string; lat?: number; lng?: number };
};

export default function ProjectDetailClient({ project }: { project: Project }) {
  const amenityCards = useMemo(() => {
    const ids = (project.amenities || []).map((s) => s.toLowerCase());
    return AMENITIES.filter((a) =>
      ids.some((id) => a.id.toLowerCase().includes(id.replace(/\s/g, "")))
    );
  }, [project.amenities]);

  return (
    <main>
      {/* HERO */}
      <section className="relative h-[44vh] min-h-[360px] overflow-hidden">
        {project.hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.hero}
            alt={`${project.name} hero`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-8">
          <div className="golden-frame modal-surface rounded-2xl p-5">
            <h1 className="text-3xl font-semibold">{project.name}</h1>
            <div className="golden-divider my-2" />
            <p className="text-neutral-300">
              {(project.configuration || "").trim()}
              {project.location ? ` • ${project.location}` : ""}
              {project.city ? ` • ${project.city}` : ""}
            </p>
            {project.price ? (
              <p className="mt-1 font-medium text-altina-gold">
                {project.price}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* CTA RAIL */}
      <div className="mx-auto max-w-6xl px-4 -mt-8 relative z-10">
        <ProjectCTARail projectId={project.id} projectName={project.name} />
      </div>

      {/* OVERVIEW */}
      <section className="mx-auto max-w-6xl px-4 py-10 grid gap-8">
        {project.about && (
          <div className="golden-frame modal-surface p-6">
            <h2 className="text-xl font-semibold">Overview</h2>
            <div className="golden-divider my-3" />
            <p className="text-neutral-300">{project.about}</p>
          </div>
        )}

        {/* QUICK FACTS */}
        <div className="golden-frame modal-surface p-6">
          <h3 className="text-lg font-semibold">Quick Facts</h3>
          <div className="golden-divider my-3" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {project.developer && <Fact label="Developer" value={project.developer} />}
            {project.status && <Fact label="Status" value={project.status} />}
            {project.construction_status && (
              <Fact label="Construction" value={project.construction_status} />
            )}
            {project.possession && <Fact label="Possession" value={project.possession} />}
            {project.launch && <Fact label="Launch" value={project.launch} />}
            {project.rera && <Fact label="RERA" value={project.rera} />}
            {project.typologies?.length ? (
              <Fact label="Typologies" value={project.typologies.join(", ")} />
            ) : null}
            {project.sizes && <Fact label="Sizes" value={project.sizes} />}
            {project.land_area && <Fact label="Land Area" value={project.land_area} />}
            {typeof project.towers === "number" && <Fact label="Towers" value={String(project.towers)} />}
            {typeof project.floors === "number" && <Fact label="Floors" value={String(project.floors)} />}
            {typeof project.total_units === "number" && <Fact label="Units" value={String(project.total_units)} />}
            {project.micro_market && <Fact label="Micro-market" value={project.micro_market} />}
          </div>
        </div>

        {/* USPs / HIGHLIGHTS */}
        {(project.usp?.length || project.highlights?.length) && (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Highlights</h3>
            <div className="golden-divider my-3" />
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              {(project.usp || []).map((u, i) => <li key={`usp-${i}`}>{u}</li>)}
              {(project.highlights || []).map((h, i) => <li key={`hl-${i}`}>{h}</li>)}
            </ul>
          </div>
        )}

        {/* AMENITIES */}
        {amenityCards.length ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Amenities</h3>
            <div className="golden-divider my-3" />
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {amenityCards.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl border border-white/10 px-3 py-3 flex items-center gap-3"
                >
                  {a.icon ? (
                    <Image
                      src={a.icon}
                      alt={a.label}
                      width={24}
                      height={24}
                      className="opacity-90"
                    />
                  ) : (
                    <span className="text-altina-gold">•</span>
                  )}
                  <span className="text-neutral-200 text-sm">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* SPECIFICATIONS */}
        {project.specs && Object.keys(project.specs).length ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Specifications</h3>
            <div className="golden-divider my-3" />
            <dl className="grid gap-3 sm:grid-cols-2">
              {Object.entries(project.specs).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/10 p-3">
                  <dt className="text-neutral-400 text-xs uppercase tracking-wide">{labelize(k)}</dt>
                  <dd className="text-neutral-200 text-sm mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {/* BANK APPROVALS */}
        {project.bank_approvals?.length ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Bank Approvals</h3>
            <div className="golden-divider my-3" />
            <div className="flex flex-wrap gap-2">
              {project.bank_approvals.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-altina-gold/30 px-3 py-1 text-xs text-neutral-200"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* BROCHURE + MAP */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="golden-frame modal-surface p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold">Download Brochure</h3>
            <div className="golden-divider my-3" />
            <GatedDownloadButton
              projectId={project.id}
              brochureUrl={project.brochure || `/brochures/${project.id}.pdf`}
            />
          </div>

          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Location</h3>
            <div className="golden-divider my-3" />
            {project.map?.embed ? (
              <div className="overflow-hidden rounded-xl border border-white/10">
                <iframe src={project.map.embed} className="h-64 w-full" loading="lazy" />
              </div>
            ) : (
              <p className="text-neutral-400 text-sm">Map will be available soon.</p>
            )}
            {project.city ? (
              <p className="text-xs text-neutral-400 mt-2">
                <Link
                  href={`https://www.google.com/maps/search/${encodeURIComponent(`${project.name} ${project.city}`)}`}
                  target="_blank"
                  className="underline"
                >
                  Open in Google Maps
                </Link>
              </p>
            ) : null}
          </div>
        </div>

        {/* GALLERY (auto from /public/projects/<id>/gallery) */}
        {project.id ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Gallery</h3>
            <div className="golden-divider my-3" />
            {/* Server island renders inside this client page */}
            <ProjectGallery slug={project.id} caption="Click any image to zoom" />
          </div>
        ) : null}

        {/* LEGAL */}
        {(project.rera || project?.["legal" as any]?.disclaimer) && (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Legal & Disclaimers</h3>
            <div className="golden-divider my-3" />
            {project.rera && (
              <p className="text-neutral-300 text-sm">
                <strong>RERA:</strong> {project.rera}
              </p>
            )}
            {project?.["legal" as any]?.disclaimer && (
              <p className="text-neutral-400 text-xs mt-2">
                {project?.["legal" as any].disclaimer}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function labelize(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 p-3">
      <div className="text-neutral-400 text-xs uppercase tracking-wide">{label}</div>
      <div className="text-neutral-200 text-sm mt-1">{value}</div>
    </div>
  );
}
