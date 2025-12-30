// src/components/ProjectDetailsSections.tsx
"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ClientImage from "@/components/ClientImage";
import developers from "@/data/developers.json";
import VirtualTour from "@/components/VirtualTour";
import AMENITY_ICONS from "@/data/amenityIcons.generated";
import HomeLoanCalculator, {
  parseINRFromPriceText,
} from "@/components/HomeLoanCalculator";

// Server island
const ProjectGallery = dynamic(() => import("@/components/ProjectGallery"), {
  ssr: true,
});

/* ---------------- Types ---------------- */

type AmenityInput =
  | string
  | number
  | null
  | undefined
  | { id?: string; key?: string; name?: string; label?: string; title?: string };

type Amenity = { label: string; icon?: string };

type FAQItem = { q: string; a: string };

type LocationAdvantage = {
  connectivity?: string[];
  schools?: string[];
  healthcare?: string[];
  markets?: string[];
};

/* ---------------- Helpers ---------------- */

function cleanLabel(label: any) {
  return String(label || "").replace(/\s+/g, " ").trim();
}

function normKey(s: string) {
  return String(s || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findAmenityIcon(label: string) {
  const key = normKey(label);
  return (AMENITY_ICONS as any)?.[key] as string | undefined;
}

function normalizeAmenities(project: any): Amenity[] {
  const raw: AmenityInput[] =
    project?.amenities ||
    project?.amenity ||
    project?.amenities_list ||
    project?.amenity_list ||
    [];

  const list: Amenity[] = [];

  for (const item of raw as any[]) {
    let label = "";

    if (typeof item === "string" || typeof item === "number") {
      label = cleanLabel(item);
    } else if (item && typeof item === "object") {
      label = cleanLabel(item.label || item.name || item.title || item.key || item.id);
    }

    if (!label) continue;

    list.push({ label, icon: findAmenityIcon(label) });
  }

  const seen = new Set<string>();
  return list.filter((a) => {
    const k = a.label.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function findDeveloper(name?: string) {
  const n = String(name || "").toLowerCase().trim();
  if (!n) return null;

  const list = Array.isArray(developers) ? (developers as any[]) : [];
  return (
    list.find((d) => String(d?.name || "").toLowerCase() === n) ||
    list.find((d) => String(d?.slug || "").toLowerCase() === n) ||
    list.find((d) => String(d?.name || "").toLowerCase().includes(n)) ||
    null
  );
}

function hasAnyLocationAdvantage(loc?: LocationAdvantage) {
  if (!loc) return false;
  return Boolean(
    loc.connectivity?.length ||
      loc.schools?.length ||
      loc.healthcare?.length ||
      loc.markets?.length
  );
}

function bullets(items: any[]) {
  if (!Array.isArray(items) || !items.length) return null;

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((t, i) => (
        <li key={`${String(t)}-${i}`} className="flex items-start gap-2">
          <span className="text-amber-300 mt-0.5">•</span>
          <span className="text-neutral-200">{String(t)}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, children }: { title: string; children: any }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-altina-gold">{title}</h2>
        <div className="h-px flex-1 bg-altina-gold/20" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        {children}
      </div>
    </section>
  );
}

function AmenityIcon({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null;
  return (
    <span className="relative h-5 w-5 shrink-0 opacity-90">
      <ClientImage src={src} alt={alt} className="h-full w-full object-contain" />
    </span>
  );
}

function CardList({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;

  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-sm font-semibold text-neutral-100">{title}</div>
      <div className="mt-2 space-y-2">
        {items.map((x, i) => (
          <div key={`${title}-${i}`} className="text-sm text-neutral-300">
            • {x}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Component ---------------- */

export default function ProjectDetailsSections({ project }: { project: any }) {
  const usp: string[] = project?.usp || [];
  const highlights: string[] = project?.highlights || [];
  const keyPoints: string[] = project?.key_points || [];
  const specificationsBullets: string[] = project?.specifications || [];

  const locAdv: LocationAdvantage | undefined = project?.location_advantage;
  const locationFallback: string[] = project?.location_points || [];
  const videoUrl: string | undefined = project?.video_url;

  const amenities = useMemo(() => normalizeAmenities(project), [project]);
  const devProfile = findDeveloper(project?.developer);

  const defaultPropertyValue = useMemo(
    () => parseINRFromPriceText(project?.price),
    [project?.price]
  );

  const mergedHighlights = useMemo(() => {
    const all = [...usp, ...highlights, ...keyPoints].map(String).filter(Boolean);
    return Array.from(new Set(all.map((x) => x.toLowerCase()))).map(
      (k) => all.find((x) => x.toLowerCase() === k)!
    );
  }, [usp, highlights, keyPoints]);

  const specPairs = useMemo(
    () =>
      [
        ["Configuration", project?.configuration],
        ["Sizes", project?.sizes],
        ["Land Area", project?.land_area],
        ["Towers", project?.towers],
        ["Floors", project?.floors],
        ["Units", project?.total_units],
      ].filter(([, v]) => v),
    [project]
  );

  const faqs: FAQItem[] = project?.faqs || project?.faq || [];

  return (
    <div className="space-y-14">
      {mergedHighlights.length && (
        <Section title="Highlights">{bullets(mergedHighlights)}</Section>
      )}

      {(specPairs.length || specificationsBullets.length) && (
        <Section title="Specifications">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {specPairs.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-white/10 p-4">
                <div className="text-xs uppercase tracking-wide text-neutral-400">{k}</div>
                <div className="mt-1 text-neutral-100">{String(v)}</div>
              </div>
            ))}
          </div>
          {specificationsBullets.length && (
            <div className="mt-5">{bullets(specificationsBullets)}</div>
          )}
        </Section>
      )}

      {amenities.length && (
        <Section title="Amenities">
          <div className="flex flex-wrap gap-3">
            {amenities.map((a) => (
              <div
                key={a.label}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2"
              >
                <AmenityIcon src={a.icon} alt="" />
                <span className="text-neutral-200 text-sm">{a.label}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      

      {hasAnyLocationAdvantage(locAdv) ? (
        <Section title="Location Advantage">
          <div className="grid gap-4 sm:grid-cols-2">
            {locAdv?.connectivity && (
              <CardList title="Connectivity" items={locAdv.connectivity} />
            )}
            {locAdv?.schools && <CardList title="Schools" items={locAdv.schools} />}
            {locAdv?.healthcare && (
              <CardList title="Healthcare" items={locAdv.healthcare} />
            )}
            {locAdv?.markets && <CardList title="Markets" items={locAdv.markets} />}
          </div>
        </Section>
      ) : (
        locationFallback.length && (
          <Section title="Location Advantage">{bullets(locationFallback)}</Section>
        )
      )}

      {(project?.map?.embed || project?.map?.lat) && (
        <Section title="Location Map">
          <iframe
            src={
              project?.map?.embed ||
              `https://www.google.com/maps?q=${project.map.lat},${project.map.lng}&z=15&output=embed`
            }
            className="h-[360px] w-full rounded-xl"
            loading="lazy"
          />
        </Section>
      )}

      {/* 7) Gallery */}
<Section title="Gallery">
  <ProjectGallery
    slug={project?.slug || project?.id}
    images={project?.images || project?.gallery || []}
  />
</Section>

   

      {videoUrl && (
        <Section title="Video Walkthrough">
          <iframe className="h-[360px] w-full rounded-xl" src={project.videoUrl} />
        </Section>
      )}

      {project?.about && (
        <Section title="About">
          <p className="text-neutral-300">{project.about}</p>
        </Section>
      )}

      {faqs.length && (
        <Section title="FAQs">
          {faqs.map((f, i) => (
            <details key={i} className="rounded-xl border border-white/10 p-4">
              <summary className="cursor-pointer text-neutral-100">{f.q}</summary>
              <p className="mt-2 text-sm text-neutral-300">{f.a}</p>
            </details>
          ))}
        </Section>
      )}
      {devProfile && (
        <Section title="Developer">
          <div className="grid gap-6 md:grid-cols-[120px_1fr]">
            {devProfile.logo && (
              <div className="h-[72px] w-[120px]">
                <ClientImage
                  src={devProfile.logo}
                  alt={devProfile.name}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <div>
              <div className="text-lg font-semibold">{devProfile.name}</div>
              {devProfile.about && (
                <p className="mt-2 text-sm text-neutral-300">{devProfile.about}</p>
              )}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
	