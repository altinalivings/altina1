// src/components/ProjectDetailsSections.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import ClientImage from "@/components/ClientImage";
import developers from "@/data/developers.json";
import VirtualTour from "@/components/VirtualTour";

// ✅ Auto-generated icon map (created by tools\generate_icons.bat)
import AMENITY_ICONS from "@/data/amenityIcons.generated";

// Server island (auto-scans /public/projects/<id>/gallery)
const ProjectGallery = dynamic(() => import("@/components/ProjectGallery"), { ssr: true });

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

/** Normalize label into a stable key for icon lookup + de-duplication. */
function amenityKey(label: string) {
  return String(label || "")
    .toLowerCase()
    .replace(/[’‘]/g, "'") // smart quotes -> normal quote
    .replace(/24\s*x\s*7/g, "24x7") // "24 x 7" -> "24x7"
    .replace(/[^a-z0-9\s']/g, " ") // drop punctuation/symbols
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();
}

/**
 * Generate likely lookup keys for a given label.
 * This lets your generated icons file use keys like:
 * - "swimming_pool" (from filename swimming_pool.png)
 * while your data label could be "Swimming Pool".
 */
function amenityKeyVariants(label: string): string[] {
  const k = amenityKey(label);
  const snake = k.replace(/\s+/g, "_");
  const noUnderscore = snake.replace(/_/g, "");
  const noCourt = k.replace(/\s*court\b/g, "").trim();
  const noCourtSnake = noCourt.replace(/\s+/g, "_");

  const variants = [k, snake, noUnderscore, noCourt, noCourtSnake];
  // unique
  return Array.from(new Set(variants.filter(Boolean)));
}

/** Resolve icon with direct matches + contains-based fallbacks. */
function iconForAmenity(label: string): string | undefined {
  const variants = amenityKeyVariants(label);

  // 1) direct key matches (label-based and filename-based keys)
  for (const v of variants) {
    const hit = (AMENITY_ICONS as Record<string, string>)[v];
    if (hit) return hit;
  }

  const k = amenityKey(label);

  // 2) contains-based fallbacks (works even if key names differ)
  if (k.includes("pool") || k.includes("swim")) {
    return (
      (AMENITY_ICONS as any)["swimming_pool"] ||
      (AMENITY_ICONS as any)["swimmingpool"] ||
      (AMENITY_ICONS as any)["pool"] ||
      (AMENITY_ICONS as any)["swimming"]
    );
  }

  if (k.includes("gym") || k.includes("fitness")) {
    return (
      (AMENITY_ICONS as any)["gymnasium"] ||
      (AMENITY_ICONS as any)["gym"] ||
      (AMENITY_ICONS as any)["fitness_center"] ||
      (AMENITY_ICONS as any)["fitnesscenter"] ||
      (AMENITY_ICONS as any)["fitness"]
    );
  }

  if (k.includes("kid") || k.includes("play") || k.includes("children")) {
    return (
      (AMENITY_ICONS as any)["kids_play_area"] ||
      (AMENITY_ICONS as any)["kidsplayarea"] ||
      (AMENITY_ICONS as any)["kids_play"] ||
      (AMENITY_ICONS as any)["kids"] ||
      (AMENITY_ICONS as any)["children_play_area"]
    );
  }

  if (k.includes("security") || k.includes("cctv") || k.includes("guard") || k.includes("24x7")) {
    return (
      (AMENITY_ICONS as any)["security"] ||
      (AMENITY_ICONS as any)["24x7_security"] ||
      (AMENITY_ICONS as any)["24x7security"] ||
      (AMENITY_ICONS as any)["cctv"]
    );
  }

  return undefined;
}

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

      const k = amenityKey(label);
      if (!k) return null;

      if (seen.has(k)) return null;
      seen.add(k);

      return { label: toTitle(label), icon: iconForAmenity(label) };
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

function CardList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-xs uppercase tracking-wide text-neutral-400">{title}</div>
      <ul className="mt-2 grid gap-2">
        {items.map((h) => (
          <li key={h} className="flex items-start gap-2">
            <span className="text-amber-300 mt-0.5">•</span>
            <span className="text-neutral-300">{h}</span>
          </li>
        ))}
      </ul>
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

function uniqStrings(arr: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const v = String(s || "").trim();
    if (!v) continue;
    const k = v.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(v);
  }
  return out;
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

  // ✅ Only ONE section: "Highlights"
  const mergedHighlights = useMemo(
    () => uniqStrings([...(highlights || []), ...(keyPoints || [])]),
    [highlights, keyPoints]
  );

  // ✅ Concise bullets by default; expand only when needed
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const MAX_CHARS = 120;

  const toggle = (i: number) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-14">
      {/* 1) USP */}
      {usp.length ? (
        <Section title="USP">
          <ul className="grid gap-2 sm:grid-cols-2">
            {usp.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <span className="text-amber-300 mt-0.5">•</span>
                <span className="text-neutral-300">{h}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* 2) Location Advantage (Connectivity / Schools / Healthcare / Markets) */}
      {hasAnyLocationAdvantage(locAdv) ? (
        <Section title="Location Advantage">
          <div className="grid gap-4 sm:grid-cols-2">
            {locAdv?.connectivity?.length ? <CardList title="Connectivity" items={locAdv.connectivity} /> : null}
            {locAdv?.schools?.length ? <CardList title="Schools" items={locAdv.schools} /> : null}
            {locAdv?.healthcare?.length ? <CardList title="Healthcare" items={locAdv.healthcare} /> : null}
            {locAdv?.markets?.length ? <CardList title="Markets" items={locAdv.markets} /> : null}
          </div>
        </Section>
      ) : locationPointsFallback.length ? (
        <Section title="Location Advantage">
          <ul className="grid gap-2 sm:grid-cols-2">
            {locationPointsFallback.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <span className="text-amber-300 mt-0.5">•</span>
                <span className="text-neutral-300">{h}</span>
              </li>
            ))}
          </ul>
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

      {/* 4) Highlights (ONLY) — concise by default; expandable for long lines */}
      {mergedHighlights.length ? (
        <Section title="Highlights">
          <ul className="grid gap-2 sm:grid-cols-2">
            {mergedHighlights.map((text, i) => {
              const t = String(text || "").trim();
              const isLong = t.length > MAX_CHARS;
              const isOpen = Boolean(expanded[i]);
              const shown = isLong && !isOpen ? `${t.slice(0, MAX_CHARS).trim()}…` : t;

              return (
                <li key={`${t}-${i}`} className="flex items-start gap-2">
                  <span className="text-amber-300 mt-0.5">•</span>
                  <span className="text-neutral-300">
                    {shown}{" "}
                    {isLong ? (
                      <button
                        type="button"
                        onClick={() => toggle(i)}
                        className="text-amber-300 underline underline-offset-2 hover:opacity-90 ml-1"
                      >
                        {isOpen ? "Less" : "More"}
                      </button>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      {/* Optional: Amenities */}
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
          <ul className="grid gap-2 sm:grid-cols-2">
            {specifications.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <span className="text-amber-300 mt-0.5">•</span>
                <span className="text-neutral-300">{h}</span>
              </li>
            ))}
          </ul>
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
                <ClientImage src={devProfile.logo} alt={`${devProfile.name} logo`} className="h-12 w-auto" />
              </div>
            ) : null}

            <div>
              <h3 className="text-lg font-semibold">{devProfile.name}</h3>
              {devProfile.tagline ? <p className="text-sm text-neutral-400">{devProfile.tagline}</p> : null}
            </div>
          </div>

          {devProfile.about ? <p className="mt-4 text-neutral-300 leading-relaxed">{devProfile.about}</p> : null}

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
