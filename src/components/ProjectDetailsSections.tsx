// src/components/ProjectDetailsSections.tsx
"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ClientImage from "@/components/ClientImage";
import developers from "@/data/developers.json";
import VirtualTour from "@/components/VirtualTour";
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

function amenityKey(label: string) {
  return String(label || "")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/24\s*x\s*7/g, "24x7")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toSnake(label: string) {
  return amenityKey(label).replace(/\s+/g, "_");
}

/** Keyword fallback mapping (works even if icon filenames are generic). */
function keywordIcon(label: string): string | undefined {
  const k = amenityKey(label);

  if (k.includes("clubhouse")) return "/icons/clubhouse.png";
  if (k.includes("pool") || k.includes("swim")) return "/icons/swimming.png";
  if (k.includes("gym") || k.includes("gymnasium") || k.includes("fitness")) return "/icons/gym.png";
  if (k.includes("kid") || k.includes("children") || k.includes("play")) return "/icons/kids.png";
  if (k.includes("security") || k.includes("cctv") || k.includes("guard") || k.includes("24x7"))
    return "/icons/security.png";
  if (k.includes("tennis")) return "/icons/tennis.png";
  if (k.includes("spa")) return "/icons/spa.png";
  if (k.includes("yoga")) return "/icons/yoga.png";

  return undefined;
}

/**
 * Icon resolution order:
 * 1) Generated map from /public/icons (best when filenames are descriptive)
 * 2) Keyword fallback (covers generic icons)
 * 3) Snake-case filename fallback (/icons/<snake>.png)
 * 4) Final fallback icon (always show something)
 *
 * NOTE: Add a fallback icon at /public/icons/default.svg (provided in the zip)
 *       or change the path below to default.png if you prefer PNG.
 */
function iconForAmenity(label: string): string {
  const k = amenityKey(label);

  const gen = (AMENITY_ICONS as Record<string, string>)[k];
  if (gen) return gen;

  const kw = keywordIcon(label);
  if (kw) return kw;

  const snake = toSnake(label);
  if (snake) return `/icons/${snake}.png`;

  return "/icons/default.svg";
}

function normalizeAmenities(project: any): { label: string; icon: string }[] {
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
    .filter(Boolean) as { label: string; icon: string }[];
}

function AmenityIcon({ src, alt }: { src: string; alt: string }) {
  const [current, setCurrent] = useState(src);

  return (
    <img
      src={current}
      alt={alt}
      width={24}
      height={24}
      className="h-6 w-6 opacity-90"
      onError={() => {
        if (current !== "/icons/default.svg") setCurrent("/icons/default.svg");
      }}
      loading="lazy"
    />
  );
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
  const usp: string[] = project?.usp || [];
  const highlights: string[] = project?.highlights || [];
  const keyPoints: string[] = project?.key_points || [];
  const specifications: string[] = project?.specifications || [];

  const locAdv: LocationAdvantage | undefined = project?.location_advantage;
  const locationPointsFallback: string[] = project?.location_points || [];

  const videoUrl: string | undefined = project?.video_url;

  const amenities = useMemo(() => normalizeAmenities(project), [project]);
  const devProfile = findDeveloper(project?.developer);

  const mergedHighlights = useMemo(
    () => uniqStrings([...(highlights || []), ...(keyPoints || [])]),
    [highlights, keyPoints]
  );

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const MAX_CHARS = 120;
  const toggle = (i: number) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-14">
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

      {amenities.length ? (
        <Section title="Amenities">
          <div className="flex flex-wrap gap-3">
            {amenities.map((a) => (
              <div
                key={a.label}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2"
                title={a.label}
              >
                <AmenityIcon src={a.icon} alt="" />
                <span className="text-neutral-200 text-sm">{a.label}</span>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

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

      {project?.id ? (
        <Section title="Gallery">
          <ProjectGallery slug={project.id} caption="Click any image to zoom" />
        </Section>
      ) : null}

      {devProfile ? (
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
      ) : null}
    </div>
  );
}
