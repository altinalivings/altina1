// src/components/ProjectDetailsSections.tsx
"use client";

import { useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import ClientImage from "@/components/ClientImage";
import developers from "@/data/developers.json";
import VirtualTour from "@/components/VirtualTour";

// Server island (auto-scans /public/projects/<id>/gallery)
const ProjectGallery = dynamic(() => import("@/components/ProjectGallery"), { ssr: true });

const AMENITY_ICONS: Record<string, string> = {
  clubhouse: "/icons/clubhouse.png",
  gym: "/icons/gym.svg",
  pool: "/icons/pool.svg",
  swimming: "/icons/swimming.svg",
  tennis: "/icons/tennis.png",
  kids: "/icons/kids.png",
  "kids play": "/icons/kids.png",
  security: "/icons/security.png",
  spa: "/icons/spa.png",
  yoga: "/icons/yoga.png",
};

type AmenityInput =
  | string
  | number
  | null
  | undefined
  | { id?: string; key?: string; name?: string; label?: string; title?: string };

const toTitle = (s: string) =>
  s
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

function normalizeAmenities(project: any): { label: string; icon?: string }[] {
  const raw: AmenityInput[] =
    (Array.isArray(project?.amenityIds) && project.amenityIds) ||
    (Array.isArray(project?.amenities) && project.amenities) ||
    [];
  const flat = (raw as any[])?.flat?.(Infinity) ?? raw;

  const seen = new Set<string>();
  return (flat as AmenityInput[])
    .map((item) => {
      if (item == null) return null;
      const label =
        typeof item === "string" || typeof item === "number"
          ? String(item).trim()
          : String(
              (item as any).label ??
                (item as any).name ??
                (item as any).title ??
                (item as any).id ??
                (item as any).key ??
                ""
            ).trim();
      if (!label) return null;
      const key = label.toLowerCase();
      if (seen.has(key)) return null;
      seen.add(key);

      const icon =
        AMENITY_ICONS[key] ||
        AMENITY_ICONS[key.replace(/\s*court/, "")] ||
        undefined;

      return { label: toTitle(label), icon };
    })
    .filter(Boolean) as { label: string; icon?: string }[];
}

type Dev = {
  slug: string;
  name: string;
  logo?: string;
  hero?: string;
  tagline?: string;
  about?: string;
  usps?: string[];
  stats?: [string, string][];
  map?: { embed?: string; title?: string };
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
function findDeveloper(devNameOrSlug?: string): Dev | undefined {
  if (!devNameOrSlug) return undefined;
  const key = norm(devNameOrSlug);
  const list = (developers as Dev[]) || [];
  return (
    list.find((d) => norm(d.slug) === key) ||
    list.find((d) => norm(d.name) === key) ||
    list.find((d) => norm(d.name).includes(key) || key.includes(norm(d.name)))
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-left">{title}</h2>
      <div className="golden-divider my-3" />
      <div className="modal-surface golden-frame p-6">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((h) => (
        <li key={h} className="flex items-start gap-2">
          <span className="text-amber-300 mt-0.5">•</span>
          <span className="text-neutral-300">{h}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProjectDetailsSections({ project }: { project: any }) {
  const highlights: string[] = project?.highlights || project?.usp || project?.usps || [];
  const specs = project?.specs || {};
  const amenities = useMemo(() => normalizeAmenities(project), [project]);

  // ✅ Use your schema fields (overview/description), fallback to legacy about
  const longAbout: string = project?.overview || project?.description || project?.about || "";

  const keyPoints: string[] = project?.key_points || [];
  const locationPoints: string[] = project?.location_points || [];
  const specifications: string[] = project?.specifications || [];
  const paymentPlan: string = project?.payment_plan || "";
  const inventoryNote: string = project?.inventory_note || "";
  const tags: string[] = project?.tags || [];

  const brochurePdf: string | undefined = project?.brochure_pdf || project?.brochure;
  const videoUrl: string | undefined = project?.video_url;

  // virtualTourUrl legacy OR video_url
  const virtualTour = project?.virtualTourUrl || videoUrl;

  const specPairs = [
    ["Developer", project?.developer],
    ["Property Type", project?.propertyType],
    ["Configuration", project?.configuration || project?.typologies],
    ["Sizes", specs?.sizes || project?.sizes],
    ["Price", project?.price || specs?.price],
    ["RERA", project?.rera],
    ["Possession", project?.possession || specs?.possession],
    ["Land Area", project?.land_area],
    ["Towers", project?.towers ?? specs?.towers],
    ["Floors", project?.floors ?? specs?.floors],
    ["Units", project?.total_units ?? specs?.total_units ?? specs?.units],
    ["Status", project?.status],
    ["Construction", project?.construction_status],
  ].filter(([, v]) => Boolean(v));

  const metaBadges = [
    project?.city && { k: "City", v: project.city },
    project?.location && { k: "Location", v: project.location },
    (project?.configuration || project?.type) && {
      k: "Type",
      v: project.configuration || project.type,
    },
  ].filter(Boolean) as { k: string; v: string }[];

  const devProfile = findDeveloper(project?.developer);

  return (
    <div className="space-y-14">
      {metaBadges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {metaBadges.map((m) => (
            <span
              key={m.k}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200"
            >
              <span className="text-neutral-400">{m.k}: </span>
              <span className="font-medium">{m.v}</span>
            </span>
          ))}
        </div>
      )}

      {/* About / Overview + Highlights */}
      {(longAbout || highlights.length) && (
        <Section title="About the Project">
          {longAbout ? (
            <p className="text-neutral-300 leading-relaxed whitespace-pre-line">{longAbout}</p>
          ) : null}

          {highlights.length ? (
            <>
              {longAbout ? <div className="h-3" /> : null}
              <h3 className="font-medium mb-2 text-left">Highlights</h3>
              <Bullets items={highlights} />
            </>
          ) : null}
        </Section>
      )}

      {/* Key Information */}
      {specPairs.length ? (
        <Section title="Key Information">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {specPairs.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-white/10 p-4">
                <div className="text-xs uppercase tracking-wide text-neutral-400">{k}</div>
                <div className="mt-1 text-neutral-100">
                  {Array.isArray(v) ? v.join(", ") : String(v)}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Why Consider */}
      {keyPoints.length ? (
        <Section title="Why Consider This Project">
          <Bullets items={keyPoints} />
        </Section>
      ) : null}

      {/* Location Advantages */}
      {locationPoints.length ? (
        <Section title="Location Advantages">
          <Bullets items={locationPoints} />
        </Section>
      ) : null}

      {/* Specifications (array) */}
      {specifications.length ? (
        <Section title="Specifications">
          <Bullets items={specifications} />
        </Section>
      ) : null}

      {/* Payment Plan */}
      {paymentPlan ? (
        <Section title="Payment Plan (Indicative)">
          <p className="text-neutral-300 leading-relaxed whitespace-pre-line">{paymentPlan}</p>
          <p className="mt-3 text-xs text-neutral-400">
            Note: Payment plan may vary by inventory and developer revisions.
          </p>
        </Section>
      ) : null}

      {/* Inventory Note */}
      {inventoryNote ? (
        <Section title="Inventory Note">
          <p className="text-neutral-300 leading-relaxed">{inventoryNote}</p>
        </Section>
      ) : null}

      {/* Amenities */}
      {amenities.length ? (
        <Section title="Amenities">
          <div className="flex flex-wrap gap-3">
            {amenities.map((a) => (
              <div
                key={a.label}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2"
                title={a.label}
              >
                {a.icon ? (
                  <Image src={a.icon} alt="" width={48} height={48} className="opacity-90" />
                ) : (
                  <span className="text-amber-300">•</span>
                )}
                <span className="text-neutral-200 text-sm">{a.label}</span>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Auto-Gallery */}
      {project?.id ? (
        <Section title="Gallery">
          <ProjectGallery slug={project.id} caption="Click any image to zoom" />
        </Section>
      ) : null}

      {/* Map */}
      {(project?.map?.embed || project?.map?.lat) ? (
        <Section title="Location">
          <div className="overflow-hidden rounded-xl border border-white/10">
            {project?.map?.embed ? (
              <iframe
                src={project.map.embed}
                className="h-[360px] w-full"
                loading="lazy"
                title={project?.name ? `${project.name} map` : "Project map"}
              />
            ) : (
              <iframe
                className="h-[360px] w-full"
                loading="lazy"
                src={`https://www.google.com/maps?q=${project?.map?.lat},${project?.map?.lng}&z=14&output=embed`}
                title={project?.name ? `${project.name} map` : "Project map"}
              />
            )}
          </div>
        </Section>
      ) : null}

      {/* Brochure & Walkthrough */}
      {(brochurePdf || videoUrl) ? (
        <Section title="Brochure & Walkthrough">
          <div className="flex flex-wrap gap-3">
            {brochurePdf ? (
              <a
                href={brochurePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#C5A657]/60 px-4 py-2 text-sm font-semibold text-[#C5A657] hover:bg-[#C5A657] hover:text-black transition"
              >
                Download Brochure
              </a>
            ) : null}

            {videoUrl ? (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-neutral-100 hover:bg-white/5 transition"
              >
                Watch Walkthrough
              </a>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* Virtual Tour (inline player) */}
      {virtualTour ? (
        <Section title="Virtual Tour">
          <VirtualTour videoUrl={virtualTour} />
        </Section>
      ) : null}

      {/* Tags */}
      {tags.length ? (
        <Section title="Tags">
          <div className="flex flex-wrap gap-2">
            {tags.map((t: string) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>
      ) : null}

      {/* About the Developer */}
      {devProfile && (
        <Section title="About the Developer">
          <div className="flex items-start gap-4">
            {devProfile.logo ? (
              <div className="shrink-0">
                <ClientImage
                  src={devProfile.logo}
                  alt={`${devProfile.name} logo`}
                  className="h-12 w-auto"
                />
              </div>
            ) : null}

            <div>
              <h3 className="text-lg font-semibold">{devProfile.name}</h3>
              {devProfile.tagline ? (
                <p className="text-sm text-neutral-400">{devProfile.tagline}</p>
              ) : null}
            </div>
          </div>

          {devProfile.about ? (
            <p className="mt-4 text-neutral-300 leading-relaxed">{devProfile.about}</p>
          ) : null}

          {Array.isArray(devProfile.stats) && devProfile.stats.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {devProfile.stats.map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/10 p-4">
                  <div className="text-xs uppercase tracking-wide text-neutral-400">{k}</div>
                  <div className="mt-1 text-neutral-100">{v}</div>
                </div>
              ))}
            </div>
          ) : null}

          {devProfile.slug ? (
            <div className="mt-4">
              <a
                href={`/developers/${devProfile.slug}`}
                className="text-amber-300 underline underline-offset-2 hover:opacity-90"
              >
                Explore {devProfile.name} projects →
              </a>
            </div>
          ) : null}
        </Section>
      )}
    </div>
  );
}
