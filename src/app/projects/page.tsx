// src/app/projects/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectsClient from "./projects-client";
import ProjectsSchema from "./ProjectsSchema";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

// Rebuild static HTML every hour for SEO freshness
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects in Delhi NCR | ALTINA™ Livings",
  description:
    "Browse luxury & premium real estate launches across Gurgaon, Noida, and Delhi NCR. Explore projects by DLF, Sobha, Godrej, M3M and more with ALTINA™ Livings — your trusted channel partner.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "ALTINA™ Livings | Premium Projects in Delhi NCR",
    description:
      "Find residential and commercial projects by DLF, Sobha, Godrej, M3M and more in Delhi NCR. ALTINA™ Livings — trusted channel partner.",
    url: `${SITE}/projects`,
    siteName: "ALTINA™ Livings",
  },
};

export default function ProjectsPage() {
  return (
    <>
      {/* 👇 Wrap your Client Component in Suspense */}
      <Suspense fallback={<div className="py-20 text-center text-neutral-400">Loading projects…</div>}>
        <ProjectsClient />
      </Suspense>

      <ProjectsSchema />
    </>
  );
}
