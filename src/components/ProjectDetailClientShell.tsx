// src/components/ProjectDetailClientShell.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import * as DetailsMod from "@/components/ProjectDetailsSections";
import * as RelatedMod from "@/components/RelatedProjects";
import * as FloatMod from "@/components/FloatingCTAs";
import HomeLoanCalculator, { parseINRFromPriceText } from "@/components/HomeLoanCalculator";

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

const ProjectDetailsSections = pick(DetailsMod, "ProjectDetailsSections");
const RelatedProjects = pick(RelatedMod, "RelatedProjects");
const FloatingCTAs = pick(FloatMod, "FloatingCTAs");

export default function ProjectDetailClientShell({ project }: { project: Project }) {
  const [galleryImages, setGalleryImages] = useState<string[]>(project.gallery ?? []);

  // Prefill calculator with price (if parseable)
  const defaultPropertyValue = useMemo(() => {
    return parseINRFromPriceText(project.price);
  }, [project.price]);

  useEffect(() => {
    let aborted = false;

    async function loadGallery() {
      // Start with curated images from projects.ts
      const curated = Array.isArray(project.gallery) ? project.gallery : [];

      // Hints for your API (kept, but optional)
      const heroFolderHint = project.hero?.startsWith("/projects/") ? project.hero.split("/")[2] : "";

      const nameHint = (project.name || "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // --- API (optional) ---
      // IMPORTANT: We do NOT do any folder discovery anymore.
      // We only accept what API returns (which should be curated from projects.ts).
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

      // Final rule:
      // 1) If API gives images, use those (curated)
      // 2) Else use curated project.gallery
      const finalImages = apiImages.length ? apiImages : curated;

      if (!aborted) {
        setGalleryImages(finalImages);
      }
    }

    loadGallery();

    return () => {
      aborted = true;
    };
  }, [project.id, project.slug, project.hero, project.name, project.gallery]);

  return (
    <>
      {/* IMPORTANT:
        Hero must be rendered ONLY in src/app/projects/[id]/page.tsx
        Do NOT render ProjectHeroWithInfo in this client shell.
      */}

      {/* Details + gallery + sections */}
      <section className="relative z-0 mx-auto max-w-6xl px-4 pt-8 pb-10">
        {ProjectDetailsSections && (
          <ProjectDetailsSections project={{ ...project, images: galleryImages } as any} />
        )}
      </section>

      {/* EMI Calculator (Illustrative) */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <HomeLoanCalculator projectName={project.name} defaultPropertyValue={defaultPropertyValue} />
      </section>

      {FloatingCTAs && <FloatingCTAs projectId={project.id} projectName={project.name} />}

      {/* Keep RelatedProjects below the fold if you use it */}
      {RelatedProjects && null}
    </>
  );
}
