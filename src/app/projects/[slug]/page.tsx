import type { Metadata } from "next";
import projects from "@/data/projects.json";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  return projects.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project: any = projects.find((p: any) => p.slug === params.slug);
  if (!project) return { title: "Projects | Altina™ Livings" };
  const city = project.city || "";
  const dev = project.developer || "";
  const amenities = Array.isArray(project.amenities) ? project.amenities.slice(0, 6).join(", ") : "";
  return {
    title: `${project.name} – ${city} by ${dev} | Altina™`,
    description: `${project.name} in ${project.location || city}. Amenities: ${amenities}`,
    openGraph: {
      title: `${project.name} – Altina™`,
      description: `${project.name} by ${dev} in ${city}.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.altinalivings.com"}/projects/${project.slug}`,
      images: project.heroImage ? [{ url: project.heroImage }] : undefined,
    },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project: any = projects.find((p: any) => p.slug === params.slug);
  if (!project) {
    return <main className="mx-auto max-w-5xl px-4 py-10"><h1>Project not found</h1></main>;
  }
  const cover = project.heroImage || project.images?.[0];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="opacity-80 mb-6">{project.developer} • {project.location || project.city}</p>
      {cover && (
        <Image
          src={cover}
          alt={`${project.name} by ${project.developer} in ${project.city}`}
          width={1200} height={675} className="rounded-xl mb-8"
        />
      )}
      <section className="prose prose-invert max-w-none">
        <p>{project.description || "Discover key amenities, floor plans, and connectivity highlights of this luxury development in Delhi NCR."}</p>
        {Array.isArray(project.amenities) && project.amenities.length ? (
          <>
            <h2>Amenities</h2>
            <ul>{project.amenities.map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
          </>
        ) : null}
      </section>
      <div className="mt-8">
        <Link href="/projects" className="underline hover:no-underline">← Back to projects</Link>
      </div>
    </main>
  );
}
