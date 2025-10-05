import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import projectsData from "@/data/projects.json";
import ProjectDetailClientShell from "@/components/ProjectDetailClientShell";

type Project = {
  id: string;
  name: string;
  developer?: string;
  city?: string;
  location?: string;
  configuration?: string;
  price?: string;
  hero?: string;
  brochure?: string;
  gallery?: string[];
  about?: string;
  possession?: string;
  connectivity?: { label: string; time: string }[];
  virtualTourUrl?: string;
  highlights?: string[];
  amenities?: string[];
};

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

const list: Project[] = Array.isArray(projectsData)
  ? (projectsData as Project[])
  : [];
const findProject = (id: string) => list.find((p) => p.id === id);

const abs = (u?: string) =>
  !u
    ? undefined
    : /^https?:\/\//i.test(u)
    ? u
    : `${SITE}${u.startsWith("/") ? u : `/${u}`}`;

function priceNumber(p?: string) {
  if (!p) return undefined;
  const v = p.replace(/[^\d.]/g, "");
  return v || undefined;
}

export function generateStaticParams() {
  return list.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const p = findProject(params.id);
  if (!p) return { title: "Project not found | ALTINA™ Livings" };

  const title = `${p.name}${p.city ? ` in ${p.city}` : ""} | ALTINA™ Livings`;
  const description =
    [
      p.about,
      p.configuration,
      p.location ? `Location: ${p.location}` : "",
      p.price ? `Price: ${p.price}` : "",
    ]
      .filter(Boolean)
      .join(" • ")
      .slice(0, 300) ||
    `Explore ${p.name}${p.city ? ` in ${p.city}` : ""}.`;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${p.id}` },
    openGraph: {
      title,
      description,
      url: `${SITE}/projects/${p.id}`,
      siteName: "ALTINA™ Livings",
      images: p.hero
        ? [{ url: abs(p.hero)!, width: 1200, height: 630, alt: p.name }]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: p.hero ? [abs(p.hero)!] : undefined,
    },
  };
}

function ProjectSchema({ p }: { p: Project }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.id,
    brand: p.developer
      ? { "@type": "Brand", name: p.developer }
      : { "@type": "Brand", name: "ALTINA" },
    description: [p.configuration, p.location, p.city].filter(Boolean).join(" • "),
    image: p.hero ? [abs(p.hero)] : undefined,
    category: "Real Estate",
    url: `${SITE}/projects/${p.id}`,
    offers: {
      "@type": "Offer",
      price: priceNumber(p.price),
      priceCurrency: "INR",
      url: `${SITE}/projects/${p.id}`,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <Script
      id={`project-schema-${p.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function ProjectBreadcrumbs({ p }: { p: Project }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Projects", item: `${SITE}/projects` },
      { "@type": "ListItem", position: 2, name: p.name, item: `${SITE}/projects/${p.id}` },
    ],
  };

  return (
    <Script
      id={`breadcrumbs-${p.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const p = findProject(params.id);
  if (!p) return notFound();

  return (
    <main className="bg-[#0B0B0C] text-white">
      <ProjectDetailClientShell project={p} />

      {/* 🟡 New Golden Section: Pricing / Possession / Connectivity */}
      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-altina-gold/20">
        <h2 className="text-2xl font-semibold text-altina-gold mb-4">
          Key Project Details
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          {p.price && (
            <div>
              <h3 className="text-altina-gold font-semibold mb-1">Pricing</h3>
              <p>{p.price}</p>
            </div>
          )}
          {p.possession && (
            <div>
              <h3 className="text-altina-gold font-semibold mb-1">Possession</h3>
              <p>{p.possession}</p>
            </div>
          )}
          {p.connectivity && (
            <div>
              <h3 className="text-altina-gold font-semibold mb-1">Connectivity</h3>
              <ul className="space-y-1">
                {p.connectivity.map((c, i) => (
                  <li key={i}>
                    <span className="font-medium">{c.label}:</span> {c.time}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 🟡 Virtual Tour Section */}
      {p.virtualTourUrl && (
        <section className="max-w-6xl mx-auto px-4 py-10 border-t border-altina-gold/20">
          <h2 className="text-2xl font-semibold text-altina-gold mb-4">
            Virtual Tour
          </h2>
          <div className="aspect-video rounded-2xl overflow-hidden border border-altina-gold/30 shadow-lg">
            <iframe
              src={p.virtualTourUrl.replace("watch?v=", "embed/")}
              title={`${p.name} Virtual Tour`}
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </section>
      )}

      {/* 🟡 Developer Information Section */}
      {p.developer && (
        <section className="max-w-6xl mx-auto px-4 py-10 border-t border-altina-gold/20">
          <h2 className="text-2xl font-semibold text-altina-gold mb-4">
            About the Developer
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            {p.developer} is one of India’s most trusted developers known for
            quality craftsmanship, timely delivery, and architectural excellence.
            ALTINA™ Livings proudly partners with {p.developer} to bring premium
            properties like {p.name} to discerning buyers in Delhi-NCR.
          </p>
        </section>
      )}

      {/* 🟡 FAQ Schema Embed */}
      <Script
        id={`faq-schema-${p.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `What is the price of ${p.name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `The price for ${p.name} starts at ${p.price || "market-linked rates"}.`,
                },
              },
              {
                "@type": "Question",
                name: `When is possession for ${p.name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${p.possession || "Possession timelines are project-dependent."}`,
                },
              },
              {
                "@type": "Question",
                name: `Where is ${p.name} located?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${p.location || "Located in a prime area of Delhi-NCR."}`,
                },
              },
            ],
          }),
        }}
      />

      {/* 🟡 Schema JSONs */}
      <ProjectSchema p={p} />
      <ProjectBreadcrumbs p={p} />
    </main>
  );
}
