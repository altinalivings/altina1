// src/data/unified.ts
// ═══════════════════════════════════════════════════════════════
//  SINGLE SOURCE OF TRUTH — All derived data comes from here.
//  projects.ts is the master. Developers and locations are
//  enriched with static metadata but project lists are ALWAYS
//  computed, never hand-maintained.
// ═══════════════════════════════════════════════════════════════

import projects, { type Project } from "./projects";
import developersMeta from "./developers.json";

// ── Types ───────────────────────────────────────────────────
export type DeveloperMeta = {
  slug: string;
  name: string;
  logo?: string;
  hero?: string;
  tagline?: string;
  about?: string;
  usps?: string[];
  stats?: [string, string][];
  awards?: string[];
  timeline?: [string, string][];
  offices?: [string, string][];
  map?: { embed?: string; title?: string };
  pressLogos?: string[];
  video?: { provider?: "youtube" | "loom" | "vimeo"; id?: string; url?: string };
  gallery?: string[];
};

export type DeveloperWithProjects = DeveloperMeta & {
  projects: Project[];
  projectCount: number;
  cities: string[];
};

export type LocationData = {
  slug: string;
  name: string;
  region: string;
  projects: Project[];
  projectCount: number;
  developers: string[];
  priceFrom?: string;
  highlights?: string[];
};

export type RegionData = {
  region: string;
  slug: string;
  description: string;
  locations: LocationData[];
  projectCount: number;
};

// ── Helpers ─────────────────────────────────────────────────
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[&/\\•–—]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Normalize developer name for matching (e.g. "SOBHA Ltd." → "sobha") */
function normDev(name: string): string {
  return name.toLowerCase().replace(/\s*(ltd\.?|limited|india|group|developers|homes|properties)\s*/gi, "").trim();
}

/** Lowest price string from a list of project price strings */
function lowestPrice(prices: string[]): string | undefined {
  // Extract numeric crore values
  const values = prices
    .map((p) => {
      const m = p.match(/([\d.]+)\s*cr/i);
      if (m) return parseFloat(m[1]);
      const l = p.match(/([\d.]+)\s*l/i);
      if (l) return parseFloat(l[1]) / 100; // convert lakh to crore
      return null;
    })
    .filter((v): v is number => v !== null);

  if (!values.length) return prices[0]; // fallback to first raw string
  const min = Math.min(...values);
  if (min < 1) return `₹${Math.round(min * 100)} L+`;
  return `₹${min} Cr+`;
}

// ── Region metadata (static descriptions, not project counts) ──
const REGION_META: Record<string, { description: string; order: number }> = {
  "Gurugram": {
    description: "Premium micro-markets with established infrastructure and luxury developments",
    order: 1,
  },
  "Noida": {
    description: "Excellent metro connectivity and affordable luxury options",
    order: 2,
  },
  "Greater Noida": {
    description: "Affordable housing with rapid infrastructure development",
    order: 3,
  },
  "New Delhi": {
    description: "Prime central locations with limited luxury inventory",
    order: 4,
  },
  "Goa": {
    description: "Premium vacation homes and plotted developments in North Goa",
    order: 5,
  },
};

/** Map city names from projects.ts to display region names */
function cityToRegion(city: string): string {
  const c = city.toLowerCase();
  if (c.includes("gurugram") || c.includes("gurgaon")) return "Gurugram";
  if (c === "greater noida") return "Greater Noida";
  if (c.includes("noida")) return "Noida";
  if (c.includes("delhi")) return "New Delhi";
  if (c.includes("goa") || c.includes("bicholim")) return "Goa";
  if (c.includes("faridabad")) return "Faridabad";
  return city; // fallback: use as-is
}

// ═══════════════════════════════════════════════════════════════
//  DEVELOPERS — derived from projects.ts + developers.json meta
// ═══════════════════════════════════════════════════════════════

/** Build developer slug → meta map from developers.json */
const devMetaMap = new Map<string, DeveloperMeta>();
for (const d of developersMeta as unknown as DeveloperMeta[]) {
  devMetaMap.set(d.slug, d);
}

/** Match a project's developer/brand to a developers.json slug */
function matchDevSlug(project: Project): string | null {
  const dev = project.developer || "";
  const brand = (project as any).brand || "";
  const normD = normDev(dev);
  const normB = normDev(brand);

  // Try direct slug match
  for (const [slug] of devMetaMap) {
    if (normD === slug || normB === slug) return slug;
    if (normDev(devMetaMap.get(slug)?.name || "") === normD) return slug;
  }

  // Try partial match
  for (const [slug, meta] of devMetaMap) {
    const normMeta = normDev(meta.name);
    if (normD.includes(slug) || slug.includes(normD)) return slug;
    if (normB.includes(slug) || slug.includes(normB)) return slug;
    if (normD.includes(normMeta) || normMeta.includes(normD)) return slug;
  }

  return null;
}

/** All developers with their projects computed from projects.ts */
export function getDevelopersWithProjects(): DeveloperWithProjects[] {
  const devProjectsMap = new Map<string, Project[]>();

  // Initialize from developers.json (preserves order & includes devs with 0 projects)
  for (const d of developersMeta as unknown as DeveloperMeta[]) {
    devProjectsMap.set(d.slug, []);
  }

  // Assign projects to developers
  for (const p of projects as Project[]) {
    const slug = matchDevSlug(p);
    if (slug) {
      const arr = devProjectsMap.get(slug) || [];
      arr.push(p);
      devProjectsMap.set(slug, arr);
    }
  }

  const result: DeveloperWithProjects[] = [];
  for (const [slug, projs] of devProjectsMap) {
    const meta = devMetaMap.get(slug);
    if (!meta) continue;
    const cities = [...new Set(projs.map((p) => p.city).filter(Boolean) as string[])].sort();
    result.push({
      ...meta,
      projects: projs,
      projectCount: projs.length,
      cities,
    });
  }

  // Sort: devs with most projects first
  result.sort((a, b) => b.projectCount - a.projectCount);
  return result;
}

/** Get a single developer by slug with all their projects */
export function getDeveloperBySlug(slug: string): DeveloperWithProjects | null {
  const all = getDevelopersWithProjects();
  return all.find((d) => d.slug === slug) || null;
}

// ═══════════════════════════════════════════════════════════════
//  LOCATIONS — derived entirely from projects.ts
// ═══════════════════════════════════════════════════════════════

/** Group projects by micro_market (or city+sector if no micro_market) */
export function getLocationData(): RegionData[] {
  // Group projects by location key
  const locMap = new Map<string, { name: string; region: string; projects: Project[] }>();

  for (const p of projects as Project[]) {
    const city = p.city || "";
    if (!city) continue;

    const region = cityToRegion(city);
    // Use micro_market as the location name, fallback to sector, then city
    const locName = (p as any).micro_market || p.sector || city;
    const key = slugify(`${locName}-${region}`);

    if (!locMap.has(key)) {
      locMap.set(key, { name: locName, region, projects: [] });
    }
    locMap.get(key)!.projects.push(p);
  }

  // Group locations by region
  const regionMap = new Map<string, LocationData[]>();

  for (const [slug, data] of locMap) {
    const devNames = [...new Set(data.projects.map((p) => p.developer).filter(Boolean) as string[])];
    const prices = data.projects.map((p) => p.price).filter(Boolean) as string[];

    const location: LocationData = {
      slug,
      name: data.name,
      region: data.region,
      projects: data.projects,
      projectCount: data.projects.length,
      developers: devNames,
      priceFrom: lowestPrice(prices),
    };

    const existing = regionMap.get(data.region) || [];
    existing.push(location);
    regionMap.set(data.region, existing);
  }

  // Build final sorted regions
  const regions: RegionData[] = [];
  for (const [region, locations] of regionMap) {
    // Sort locations by project count (desc)
    locations.sort((a, b) => b.projectCount - a.projectCount);

    const meta = REGION_META[region] || { description: `Premium properties in ${region}`, order: 99 };
    regions.push({
      region,
      slug: slugify(region),
      description: meta.description,
      locations,
      projectCount: locations.reduce((s, l) => s + l.projectCount, 0),
    });
  }

  // Sort regions by configured order
  regions.sort((a, b) => {
    const oa = REGION_META[a.region]?.order ?? 99;
    const ob = REGION_META[b.region]?.order ?? 99;
    return oa - ob;
  });

  return regions;
}

/** Get projects for a specific location slug */
export function getProjectsByLocation(locationSlug: string): LocationData | null {
  for (const region of getLocationData()) {
    const loc = region.locations.find((l) => l.slug === locationSlug);
    if (loc) return loc;
  }
  return null;
}

/** Get projects for a specific city */
export function getProjectsByCity(city: string): Project[] {
  return (projects as Project[]).filter(
    (p) => p.city?.toLowerCase() === city.toLowerCase()
  );
}

/** Get projects by developer slug */
export function getProjectsByDeveloper(devSlug: string): Project[] {
  const dev = getDeveloperBySlug(devSlug);
  return dev?.projects || [];
}

// ═══════════════════════════════════════════════════════════════
//  CROSS-LINKS — for "Related" sections
// ═══════════════════════════════════════════════════════════════

/** Get related projects: same developer OR same micro_market, excluding current */
export function getRelatedProjects(projectId: string, limit = 6): Project[] {
  const current = (projects as Project[]).find((p) => p.id === projectId);
  if (!current) return [];

  const scored = (projects as Project[])
    .filter((p) => p.id !== projectId)
    .map((p) => {
      let score = 0;
      if (p.developer === current.developer) score += 3;
      if (p.city === current.city) score += 2;
      if ((p as any).micro_market && (p as any).micro_market === (current as any).micro_market) score += 4;
      if ((p as any).brand === (current as any).brand) score += 1;
      return { project: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.project);
}

// ═══════════════════════════════════════════════════════════════
//  STATS — for homepage and marketing
// ═══════════════════════════════════════════════════════════════

export function getSiteStats() {
  const allProjects = projects as Project[];
  const allDevs = getDevelopersWithProjects();
  const allRegions = getLocationData();
  const totalLocations = allRegions.reduce((s, r) => s + r.locations.length, 0);
  const uniqueCities = [...new Set(allProjects.map((p) => p.city).filter(Boolean))];

  return {
    totalProjects: allProjects.length,
    totalDevelopers: allDevs.filter((d) => d.projectCount > 0).length,
    totalLocations,
    totalCities: uniqueCities.length,
    cities: uniqueCities as string[],
  };
}
