"use client";

import Link from "next/link";

type Props = {
  currentId: string;
  developer?: string;
  city?: string;
};

/**
 * Minimal, safe default export for RelatedProjects.
 * - Works inside client components.
 * - Avoids SSR/SSG crashes by ensuring a function component is exported.
 * - You can enhance this later to actually compute related projects.
 */
export default function RelatedProjects({ currentId, developer, city }: Props) {
  // Render a simple, SEO-friendly fallback. Replace with real related-logic when ready.
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold">Related projects</h3>
          <p className="text-sm text-white/70">
            {developer ? `More from ${developer}` : "Explore more projects"}
            {city ? ` in ${city}` : ""}.
          </p>
        </div>
        <Link
          href="/projects"
          className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium bg-emerald-600/90 hover:bg-emerald-600 transition-colors"
        >
          View all projects
        </Link>
      </div>
    </div>
  );
}
