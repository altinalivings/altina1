
import projects from "@/data/projects.json";

export default function sitemap() {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.altinalivings.com";
  const now = new Date();
  const staticEntries = [
    { url: `${SITE}/`, lastModified: now },
    { url: `${SITE}/projects`, lastModified: now },
    { url: `${SITE}/blog`, lastModified: now },
    { url: `${SITE}/privacy`, lastModified: now },
  ];
  const projectEntries = projects.map((p) => ({
    url: `${SITE}/projects/${p.slug || p.id}`,
    lastModified: now,
  }));
  return [...staticEntries, ...projectEntries];
}
