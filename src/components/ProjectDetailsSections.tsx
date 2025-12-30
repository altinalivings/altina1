// src/components/ProjectDetailsSections.tsx
"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ClientImage from "@/components/ClientImage";
import developers from "@/data/developers.json";
import VirtualTour from "@/components/VirtualTour";
import AMENITY_ICONS from "@/data/amenityIcons.generated";
import HomeLoanCalculator, { parseINRFromPriceText } from "@/components/HomeLoanCalculator";

// Gallery (client component)
const ProjectGallery = dynamic(() => import("@/components/ProjectGallery"), {
  ssr: false,
});

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

function cleanLabel(label: any) {
  return String(label || "")
    .replace(/\s+/g, " ")
    .trim();
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

    list.push({
      label,
      icon: findAmenityIcon(label),
    });
  }

  // de-dupe (case-insensitive)
  const seen = new Set<string>();
  const out: Amenity[] = [];
  for (const a of list) {
    const k = a.label.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(a);
  }

  return out;
}

function findDeveloper(name?: string) {
  const n = String(name || "").toLowerCase().trim();
  if (!n) return null;

  const list = Array.isArray(developers) ? (developers as any[]) : [];
  return (
    list.find((d) => String(d?.name || "").toLowerCase().trim() === n) ||
    list.find((d) => String(d?.slug || "").toLowerCase().trim() === n) ||
    list.find((d) => String(d?.name || "").toLowerCase().includes(n)) ||
    null
  );
}

function hasAnyLocationAdvantage(loc?: LocationAdvantage) {
  if (!loc) return false;
  return Boolean(
    (loc.connectivity && loc.connectivity.length) ||
      (loc.schools && loc.schools.length) ||
      (loc.healthcare && loc.healthcare.length) ||
      (loc.markets && loc.markets.length)
  );
}

function bullets(items: any[]) {
  if (!Array.isArray(items) || items.length === 0) return null;

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
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">{children}</div>
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

export default function ProjectDetailsSections({ project }: { project: any }) {
  // JSON inputs (projects.ts)
  const usp: string[] = project?.usp || [];
  const highlights: string[] = project?.highlights || [];
  const keyPoints: string[] = project?.key_points || []; // backward compatibility
  const specificationsBullets: string[] = project?.specifications || [];

  const locAdv: LocationAdvantage | undefined = project?.location_advantage;
  const locationPointsFallback: string[] = project?.location_points || []; // backward compatibility

  const videoUrl: string | undefined = project?.video_url;

  const amenities = useMemo(() => normalizeAmenities(project), [project]);
  const devProfile = findDeveloper(project?.developer);

  const defaultPropertyValue = useMemo(
    () => parseINRFromPriceText(project?.price),
    [project?.price]
  );

  // Merge USP + Highlights (+ key_points for backward compatibility)
  const mergedHighlights = useMemo(() => {
    const all = [...(usp || []), ...(highlights || []), ...(keyPoints || [])]
      .map((x) => String(x || "").trim())
      .filter(Boolean);

    const seen = new Set<string>();
    const out: string[] = [];
    for (const t of all) {
      const k = t.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(t);
    }
    return out;
  }, [usp, highlights, keyPoints]);

  // Specs (cards)
  const specPairs = useMemo(() => {
    const pairs: [string, any][] = [
      ["Configuration", project?.configuration],
      ["Sizes", project?.sizes],
      ["Land Area", project?.land_area],
      ["Towers", project?.towers],
      ["Floors", project?.floors],
      ["Units", project?.total_units],
    ];

    return pairs.filter(([, v]) => v != null && String(v).trim() !== "");
  }, [project]);

  // FAQs (support both keys)
  const faqs: FAQItem[] = (project?.faqs || project?.faq || []) as FAQItem[];

  // Concise bullets by default; expandable for long lines (in Highlights only)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const MAX_CHARS = 120;
  const toggle = (i: number) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-14">
      {/* 1) Merged: USP + Highlights */}
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
                  <span className="text-neutral-200">
                    {shown}
                    {isLong ? (
                      <button
                        type="button"
                        onClick={() => toggle(i)}
                        className="ml-2 text-xs text-altina-gold underline decoration-altina-gold/40 hover:decoration-altina-gold"
                      >
                        {isOpen ? "Show less" : "Read more"}
                      </button>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      {/* 2) Specifications */}
      {specPairs.length || specificationsBullets.length ? (
        <Section title="Specifications">
          {specPairs.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {specPairs.map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/10 p-4">
                  <div className="text-xs uppercase tracking-wide text-neutral-400">{k}</div>
                  <div className="mt-1 text-neutral-100">{String(v)}</div>
                </div>
              ))}
            </div>
          ) : null}

          {specificationsBullets.length ? (
            <div className={specPairs.length ? "mt-5" : ""}>{bullets(specificationsBullets)}</div>
          ) : null}
        </Section>
      ) : null}

      {/* 3) Amenities */}
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

      {/* 4) Home Loan Calculator */}
      <Section title="Home Loan Calculator (Illustrative)">
        <HomeLoanCalculator projectName={project?.name} defaultPropertyValue={defaultPropertyValue} />
        <p className="mt-3 text-xs text-neutral-400 leading-relaxed">
          Disclaimer: This calculator is for illustrative purposes only. Loan eligibility, EMI, interest rate, charges
          and final sanction depend on lender policies, credit profile and documentation. Please verify with your bank/NBFC.
        </p>
      </Section>

      {/* 5) Location Advantage */}
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
        <Section title="Location Advantage">{bullets(locationPointsFallback)}</Section>
      ) : null}

      {/* 6) Location Map */}
      {project?.map?.embed || project?.map?.lat ? (
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
                src={`https://www.google.com/maps?q=${project?.map?.lat},${project?.map?.lng}&z=15&output=embed`}
                className="h-[360px] w-full"
                loading="lazy"
                title={project?.name ? `${project.name} map` : "Project map"}
              />
            )}
          </div>
        </Section>
      ) : null}

      {/* 7) Gallery (FIXED: slug is REQUIRED by ProjectGallery) */}
      <Section title="Gallery">
        <ProjectGallery
          slug={project?.slug || project?.id}
          images={project?.images || project?.gallery || []}
        />
      </Section>

      {/* 8) Virtual Tour (FIXED prop name: videoUrl) */}
      {project?.virtualTourUrl ? (
        <Section title="Virtual Tour">
          <VirtualTour videoUrl={project.virtualTourUrl} />
        </Section>
      ) : null}

      {/* 9) Video Walkthrough */}
      {videoUrl ? (
        <Section title="Video Walkthrough">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <iframe
              className="h-[360px] w-full"
              src={videoUrl}
              title={project?.name ? `${project.name} video` : "Project video"}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Section>
      ) : null}

      {/* 10) About */}
      {project?.about ? (
        <Section title="About">
          <div className="prose prose-invert max-w-none prose-p:text-neutral-300">
            <p>{project.about}</p>
          </div>
        </Section>
      ) : null}

      {/* 11) FAQs */}
      {Array.isArray(faqs) && faqs.length ? (
        <Section title="FAQs">
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details
                key={`${f.q}-${i}`}
                className="rounded-xl border border-white/10 p-4 hover:border-white/20 transition-colors"
              >
                <summary className="cursor-pointer text-neutral-100 font-medium">{f.q}</summary>
                <div className="mt-2 text-sm text-neutral-300">{f.a}</div>
              </details>
            ))}
          </div>
        </Section>
      ) : null}

      {/* 12) Developer */}
      {devProfile ? (
        <Section title="Developer">
          <div className="grid gap-6 md:grid-cols-[120px_1fr] items-start">
            {devProfile?.logo ? (
              <div className="h-[72px] w-[120px]">
                <ClientImage
                  src={devProfile.logo}
                  alt={devProfile?.name || "Developer"}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : null}

            <div>
              <div className="text-lg font-semibold text-neutral-100">{devProfile?.name || project?.developer}</div>
              {devProfile?.about ? <p className="mt-2 text-sm text-neutral-300">{devProfile.about}</p> : null}

              {devProfile?.website ? (
                <a
                  href={devProfile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-altina-gold underline decoration-altina-gold/30 hover:decoration-altina-gold"
                >
                  Visit Developer Website
                </a>
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}
    </div>
  );
}
