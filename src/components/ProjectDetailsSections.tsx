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
  gym: "/icons/gym.png",
  pool: "/icons/swimming.png",
  swimming: "/icons/swimming.png",
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

type LocationAdvantage = {
  connectivity?: string[];
  schools?: string[];
  healthcare?: string[];
  markets?: string[];
};

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

function CardList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-xs uppercase tracking-wide text-neutral-400">{title}</div>
      <div className="mt-2">
        <Bullets items={items} />
      </div>
    </div>
  );
}

function hasAnyLocationAdvantage(loc?: LocationAdvantage) {
  return Boolean(
    loc &&
      ((Array.isArray(loc.connectivity) && loc.connectivity.length) ||
        (Array.isArray(loc.schools) && loc.schools.length) ||
        (Array.isArray(loc.healthcare) && loc.healthcare.length) ||
        (Array.isArray(loc.markets) && loc.markets.length))
  );
}

export default function ProjectDetailsSections({ project }: { project: any }) {
  // --- Inputs from your JSON schema ---
  const usp: string[] = project?.usp || [];
  const highlights: string[] = project?.highlights || [];
  const keyPoints: string[] = project?.key_points || [];
  const specifications: string[] = project?.specifications || [];

  const locAdv: LocationAdvantage | undefined = project?.location_advantage;
  // Fallback if you haven't migrated to grouped buckets yet
  const locationPointsFallback: string[] = project?.location_points || [];

  // YouTube URL: section should disappear if not provided
  const videoUrl: string | undefined = project?.video_url;

  // Optional: keep amenities if present
  const amenities = useMemo(() => normalizeAmenities(project), [project]);

  // Optional: developer card
  const devProfile = findDeveloper(project?.developer);

  return (
    <div className="space-y-14">
      {/* 1) USP */}
      {usp.length ? (
        <Section title="USP">
          <Bullets items={usp} />
        </Section>
      ) : null}

      {/* 2) Location Advantage (Connectivity / Schools / Healthcare / Markets) */}
      {hasAnyLocationAdvantage(locAdv) ? (
        <Section title="Location Advantage">
          <div className="grid gap-4 sm:grid-cols-2">
            {locAdv?.connectivity?.length ? (
              <CardList title="Connectivity" items={locAdv.connectivity} />
            ) : null}
            {locAdv?.schools?.length ? (
              <CardList title="Schools" items={locAdv.schools} />
            ) : null}
            {locAdv?.healthcare?.length ? (
              <CardList title="Healthcare" items={locAdv.healthcare} />
            ) : null}
            {locAdv?.markets?.length ? (
              <CardList title="Markets" items={locAdv.markets} />
            ) : null}
          </div>
        </Section>
      ) : locationPointsFallback.length ? (
        <Section title="Location Advantage">
          <Bullets items={locationPointsFallback} />
        </Section>
      ) : null}

      {/* 3) Location Map */}
      {(project?.map?.embed || project?.map?.lat) ? (
        <Section title="Location Map">
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

      {/* 4) Highlights / Key Points */}
      {(highlights.length || keyPoints.length) ? (
        <Section title="Highlights & Key Points">
          {highlights.length ? (
            <>
              <h3 className="font-medium mb-2 text-left">Highlights</h3>
              <Bullets items={highlights} />
            </>
          ) : null}

          {keyPoints.length ? (
            <>
              {highlights.length ? <div className="h-5" /> : null}
              <h3 className="font-medium mb-2 text-left">Key Points</h3>
              <Bullets items={keyPoints} />
            </>
          ) : null}
        </Section>
      ) : null}

      {/* Optional: Amenities (kept; delete this block if you don't want it) */}
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

      {/* 5) Specifications */}
      {specifications.length ? (
        <Section title="Specifications">
          <Bullets items={specifications} />
        </Section>
      ) : null}

      {/* 6) YouTube URL (remove section if not provided) */}
      {videoUrl ? (
        <Section title="Walkthrough (YouTube)">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 underline underline-offset-2 hover:opacity-90"
            >
              Watch on YouTube →
            </a>
          </div>

          {/* Optional inline embed/player via your existing VirtualTour component */}
          <div className="mt-5">
            <VirtualTour videoUrl={videoUrl} />
          </div>
        </Section>
      ) : null}

      {/* Gallery (optional; auto from /public/projects/<id>/gallery) */}
      {project?.id ? (
        <Section title="Gallery">
          <ProjectGallery slug={project.id} caption="Click any image to zoom" />
        </Section>
      ) : null}

      {/* About the Developer (optional) */}
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
