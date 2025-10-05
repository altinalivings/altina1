import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import projects from "@/data/projects.json";
import { notFound } from "next/navigation";

type Project = typeof projects[number];

function getProject(param: string): Project | undefined {
  return projects.find((p) => p.id === param || p.slug === param);
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const p = getProject(params.id);
  if (!p) return { title: "Project not found" };

  const title = p.seo?.title || `${p.name} | ${p.configuration}`;
  const description =
    p.seo?.description ||
    `${p.name} by ${p.brand || p.developer} in ${
      p.micro_market || p.location || p.city
    }.`;
  const canonical =
    p.seo?.canonical ||
    `https://www.altinalivings.com/projects/${p.slug || p.id}`;
  const ogImg = p.hero || "/og-default.jpg";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "ALTINA™ Livings",
      title,
      description,
      images: [{ url: ogImg, width: 1200, height: 630, alt: p.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImg],
    },
  };
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const p = getProject(params.id);
  if (!p) return notFound();

  const others = projects.filter((x) => x.id !== p.id).slice(0, 2);
  const gallery = Array.isArray(p.gallery) ? p.gallery : [];

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold">{p.name}</h1>
        <p className="text-sm opacity-80">
          {p.configuration} • {p.micro_market || p.location || p.city}{" "}
          {p.rera && `• RERA: ${p.rera}`}
        </p>
      </header>

      {/* Hero */}
      {p.hero && (
        <div className="mb-8 overflow-hidden rounded-xl ring-1 ring-white/10">
          <Image
            src={p.hero}
            alt={p.name}
            width={1600}
            height={900}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      )}

      {/* Overview & Highlights */}
      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <p className="opacity-90 mb-4">{p.about}</p>
          <ul className="list-disc pl-5 opacity-90 space-y-1">
            {p.price && <li><strong>Price:</strong> {p.price}</li>}
            {p.status && <li><strong>Status:</strong> {p.status}</li>}
            {p.possession && <li><strong>Possession:</strong> {p.possession}</li>}
            {p.towers && <li><strong>Towers:</strong> {p.towers}</li>}
            {p.floors && <li><strong>Floors:</strong> {p.floors}</li>}
          </ul>

          <div className="flex flex-wrap gap-3 pt-4">
            {p.brochure && (
              <a
                href={p.brochure}
                target="_blank"
                rel="noopener"
                className="px-4 py-2 rounded-lg bg-[#C9A23F] text-black font-medium"
              >
                Download Brochure
              </a>
            )}
            <a
              href="#lead"
              className="px-4 py-2 rounded-lg border border-white/20"
            >
              Book Site Visit
            </a>
            <a
              href={`https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I'm%20interested%20in%20${encodeURIComponent(
                p.name
              )}`}
              target="_blank"
              rel="noopener"
              className="px-4 py-2 rounded-lg border border-[#25D366] text-[#25D366]"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Highlights</h2>
          <ul className="list-disc pl-5 opacity-90 space-y-1">
            {(p.highlights || p.usp || []).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-lg ring-1 ring-white/10">
                <Image
                  src={src}
                  alt={`${p.name} image ${i + 1}`}
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Explore More */}
      {others.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Explore More Projects</h2>
          <div className="flex flex-wrap gap-3">
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/projects/${o.slug || o.id}`}
                className="px-4 py-2 rounded-lg border border-white/20 hover:text-[#C9A23F]"
              >
                {o.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div id="lead" className="pt-6" />
    </div>
  );
}
