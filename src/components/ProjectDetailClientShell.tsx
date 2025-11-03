// src/components/ProjectDetailClientShell.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import * as HeroMod from "@/components/ProjectHeroWithInfo";
import * as DetailsMod from "@/components/ProjectDetailsSections";
import * as RelatedMod from "@/components/RelatedProjects";
import * as FloatMod from "@/components/FloatingCTAs";

type Project = {
  id: string;
  slug?: string;
  name: string;
  developer?: string;
  city?: string;
  location?: string;
  configuration?: string;
  price?: string;
  brochure?: string;
  hero?: string;
  gallery?: string[];
};

function pick<T = any>(mod: any, named: string) {
  return (mod?.default ?? mod?.[named]) as T;
}
const ProjectHeroWithInfo = pick(HeroMod, "ProjectHeroWithInfo");
const ProjectDetailsSections = pick(DetailsMod, "ProjectDetailsSections");
const RelatedProjects = pick(RelatedMod, "RelatedProjects");
const FloatingCTAs = pick(FloatMod, "FloatingCTAs");

export default function ProjectDetailClientShell({ project }: { project: Project }) {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>(project.gallery ?? []);

  const bases = useMemo(() => {
    const set = new Set<string>();
    const add = (p?: string) => p && set.add(p);

    // prefer id
    add(`/projects/${project.id}`);
    add(`/projects/${project.id}/gallery`);

    // also try slug
    if (project.slug) {
      add(`/projects/${project.slug}`);
      add(`/projects/${project.slug}/gallery`);
    }

    // also try folder derived from hero path, if present
    if (project.hero?.startsWith("/projects/")) {
      const parts = project.hero.split("/").slice(0, 3).join("/"); // /projects/<folder>
      add(parts);
      add(`${parts}/gallery`);
    }

    return Array.from(set);
  }, [project.id, project.slug, project.hero]);

  useEffect(() => {
    let aborted = false;

    async function loadAll() {
      // --- HERO ---
      const heroCandidates = [
        project.hero,
        `/projects/${project.id}/hero.webp`,
        `/projects/${project.id}/hero.jpg`,
        project.slug ? `/projects/${project.slug}/hero.webp` : undefined,
        project.slug ? `/projects/${project.slug}/hero.jpg` : undefined,
      ].filter(Boolean) as string[];

      let hero: string | null = null;
      for (const url of heroCandidates) {
        try {
          // Use GET (HEAD is often blocked with static hosts/CDNs)
          const res = await fetch(url, { method: "GET", cache: "no-store" });
          if (res.ok) {
            hero = url;
            break;
          }
        } catch {
          // ignore
        }
      }

      // Build a hint from hero path and from name (covers cases like "m3m-jacob-co")
      const heroFolderHint =
        project.hero?.startsWith("/projects/")
          ? project.hero.split("/")[2] // /projects/<hint>/...
          : "";
      const nameHint = (project.name || "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // --- API (optional) ---
      let apiImages: string[] = [];
      try {
        const params = new URLSearchParams({
          alt: project.slug ?? "",
          hint: heroFolderHint || nameHint || "",
        });
        const res = await fetch(`/api/gallery/${project.id}?` + params.toString(), {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          apiImages = Array.isArray(data?.images) ? data.images : [];
        }
      } catch {
        // ignore
      }

      // --- DIRECT DISCOVERY (g1..g25, with/without /gallery) ---
      const exts = ["webp", "jpg", "jpeg", "png"];
      const discovered: string[] = [];
      const seen = new Set<string>([...(project.gallery ?? []), ...apiImages]);

      for (const base of bases) {
        for (let i = 1; i <= 25; i++) {
          let found = false;
          for (const ext of exts) {
            const candidates = [
              `${base}/g${i}.${ext}`,
              `${base}/gallery/g${i}.${ext}`,
            ];
            for (const url of candidates) {
              if (seen.has(url)) continue;
              try {
                const r = await fetch(url, { method: "GET", cache: "no-store" });
                if (r.ok) {
                  discovered.push(url);
                  found = true;
                  break;
                }
              } catch {
                // ignore
              }
            }
            if (found) break;
          }
        }
      }

      if (!aborted) {
        const merged = Array.from(new Set([...(project.gallery ?? []), ...apiImages, ...discovered]));
        setGalleryImages(merged);
        if (!hero && merged.length) hero = merged[0]!;
        setHeroImage(hero);
      }
    }

    loadAll();
    return () => {
      aborted = true;
    };
  }, [project.id, project.slug, project.hero, bases, project.name]);

  const heroSrc = heroImage || "/fallbacks/hero-fallback.jpg";
  const imagesForDetails = galleryImages;

  return (
    <>
      {ProjectHeroWithInfo && (
        <ProjectHeroWithInfo
          id={project.id}
          name={project.name}
          developer={project.developer}
          city={project.city}
          location={project.location}
          hero={heroSrc}
          configuration={project.configuration}
          price={project.price}
          brochure={project.brochure}
          images={imagesForDetails}
        />
      )}

      <section className="relative z-0 max-w-6xl mx-auto px-4 pt-8 pb-10">
        {ProjectDetailsSections && (
          <ProjectDetailsSections project={{ ...project, images: imagesForDetails } as any} />
        )}
      </section>

      {FloatingCTAs && <FloatingCTAs projectId={project.id} projectName={project.name} />}

      {/* Keep RelatedProjects below the fold if you use it */}
      {RelatedProjects && null}
    </>
  );
}
