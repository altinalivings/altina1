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
  towers?: string | number;
  floors?: string | number;
  total_units?: string | number;

  propertyType?: "Residential" | "Commercial" | "Mixed";

  bank_approvals?: string[];
  usp?: string[];
  highlights?: string[];
  amenities?: string[];

  // legacy or alternate blocks
  specs?: Record<string, string>;
  about?: string;

  // ✅ your richer schema fields
  overview?: string;
  description?: string;
  key_points?: string[];
  location_points?: string[];
  specifications?: string[];
  payment_plan?: string;
  inventory_note?: string;
  tags?: string[];
  brochure_pdf?: string;
  video_url?: string;
  whatsapp_prefill?: string;

  brochure?: string;
  hero?: string;
  gallery?: string[];
  map?: { embed?: string; lat?: number; lng?: number };
};

export default function ProjectDetailClient({ project }: { project: Project }) {
  const amenityCards = useMemo(() => {
    const ids = (project.amenities || []).map((s) => String(s).toLowerCase());
    return AMENITIES.filter((a) =>
      ids.some((id) => a.id.toLowerCase().includes(id.replace(/\s/g, "")))
    );
  }, [project.amenities]);

  const longAbout =
    project.overview || project.description || project.about || "";

  const keyPoints = Array.isArray(project.key_points) ? project.key_points : [];
  const locationPoints = Array.isArray(project.location_points) ? project.location_points : [];
  const specificationsArr = Array.isArray(project.specifications) ? project.specifications : [];
  const paymentPlan = project.payment_plan || "";
  const inventoryNote = project.inventory_note || "";
  const tags = Array.isArray(project.tags) ? project.tags : [];

  const brochureUrl =
    project.brochure_pdf || project.brochure || `/brochures/${project.id}.pdf`;

  const videoUrl = project.video_url;
  const waText =
    project.whatsapp_prefill || `Hi Altina, please share details for ${project.name}.`;

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

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-10 grid gap-8">
        {/* OVERVIEW */}
        {longAbout ? (
          <div className="golden-frame modal-surface p-6">
            <h2 className="text-xl font-semibold">Overview</h2>
            <div className="golden-divider my-3" />
            <p className="text-neutral-300 whitespace-pre-line">{longAbout}</p>
          </div>
        ) : null}

        {/* QUICK FACTS */}
        <div className="golden-frame modal-surface p-6">
          <h3 className="text-lg font-semibold">Quick Facts</h3>
          <div className="golden-divider my-3" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {project.developer && <Fact label="Developer" value={project.developer} />}
            {project.propertyType && <Fact label="Property Type" value={project.propertyType} />}
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
            {project.towers != null && <Fact label="Towers" value={String(project.towers)} />}
            {project.floors != null && <Fact label="Floors" value={String(project.floors)} />}
            {project.total_units != null && <Fact label="Units" value={String(project.total_units)} />}
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

        {/* WHY CONSIDER */}
        {keyPoints.length ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Why Consider This Project</h3>
            <div className="golden-divider my-3" />
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              {keyPoints.map((k, i) => <li key={`kp-${i}`}>{k}</li>)}
            </ul>
          </div>
        ) : null}

        {/* LOCATION ADVANTAGES */}
        {locationPoints.length ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Location Advantages</h3>
            <div className="golden-divider my-3" />
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              {locationPoints.map((k, i) => <li key={`lp-${i}`}>{k}</li>)}
            </ul>
          </div>
        ) : null}

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

        {/* SPECIFICATIONS (prefer array; fallback to specs map) */}
        {(specificationsArr.length || (project.specs && Object.keys(project.specs).length)) ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Specifications</h3>
            <div className="golden-divider my-3" />

            {specificationsArr.length ? (
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                {specificationsArr.map((s, i) => <li key={`sp-${i}`}>{s}</li>)}
              </ul>
            ) : null}

            {project.specs && Object.keys(project.specs).length ? (
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {Object.entries(project.specs).map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-white/10 p-3">
                    <dt className="text-neutral-400 text-xs uppercase tracking-wide">{labelize(k)}</dt>
                    <dd className="text-neutral-200 text-sm mt-1">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : null}

        {/* PAYMENT PLAN */}
        {paymentPlan ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Payment Plan (Indicative)</h3>
            <div className="golden-divider my-3" />
            <p className="text-neutral-300 whitespace-pre-line">{paymentPlan}</p>
            <p className="mt-2 text-xs text-neutral-400">
              Note: Payment plan may vary by inventory and developer revisions.
            </p>
          </div>
        ) : null}

        {/* INVENTORY NOTE */}
        {inventoryNote ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Inventory Note</h3>
            <div className="golden-divider my-3" />
            <p className="text-neutral-300">{inventoryNote}</p>
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
            <GatedDownloadButton projectId={project.id} brochureUrl={brochureUrl} />
            <p className="mt-3 text-xs text-neutral-400">
              Prefer WhatsApp?{" "}
              <a
                className="underline text-altina-gold"
                href={`https://wa.me/919891234195?text=${encodeURIComponent(waText)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Message us
              </a>
              .
            </p>
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

        {/* WALKTHROUGH */}
        {videoUrl ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Walkthrough / Video</h3>
            <div className="golden-divider my-3" />
            <p className="text-neutral-300 text-sm">
              <a
                href={videoUrl}
                className="underline text-altina-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open video
              </a>
            </p>
          </div>
        ) : null}

        {/* TAGS */}
        {tags.length ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Tags</h3>
            <div className="golden-divider my-3" />
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* GALLERY (auto from /public/projects/<id>/gallery) */}
        {project.id ? (
          <div className="golden-frame modal-surface p-6">
            <h3 className="text-lg font-semibold">Gallery</h3>
            <div className="golden-divider my-3" />
            {/* Server island renders inside this client page */}
           <ProjectGallery
  projectId={project?.id}
  caption="Click any image to zoom"
/>

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
