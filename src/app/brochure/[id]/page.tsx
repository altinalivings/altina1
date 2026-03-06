// src/app/brochure/[id]/page.tsx


import type { Metadata } from "next";
import projectsData from "@/data/projects";
import { GatedDownloadButton } from "@/components/BrochureLeadGate";

type Project = { id: string; name: string; location?: string; brochure?: string };

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const items = projectsData as Project[];
  const p = items.find((x) => x.id === params.id);
  const title = p ? `Download Brochure – ${p.name} | ALTINA™ Livings` : "Download Brochure | ALTINA™ Livings";
  const desc = p
    ? `Access the official brochure for ${p.name}${p.location ? `, ${p.location}` : ""}.`
    : "Access official project brochures curated by ALTINA™ Livings.";
  return { title, description: desc, alternates: { canonical: `/brochure/${params.id}` } };
}

export default function BrochurePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { file?: string; dl?: string };
}) {
  const items = projectsData as Project[];
  const project = items.find((p) => p.id === params.id);
  const title = project?.name || "Project";
  const brochure = searchParams.file || project?.brochure || `/brochures/${params.id}.pdf`;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="golden-frame modal-surface p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {project?.location ? <p className="text-neutral-400 text-sm">{project.location}</p> : null}
        </div>
        <GatedDownloadButton projectId={params.id} brochureUrl={brochure} />
      </div>

      <div className="mt-6 golden-frame modal-surface p-2">
        <object data={brochure} type="application/pdf" className="w-full h-[75vh]">
          <p className="p-4 text-sm text-neutral-300">
            Unable to display the PDF.{" "}
            <a href={brochure} className="underline">Download it here</a>.
          </p>
        </object>
      </div>
    </main>
  );
}
