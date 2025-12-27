// src/app/projects/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import projectsData from "@/data/projects";
import ProjectDetailClientShell from "@/components/ProjectDetailClientShell";
import RelatedProjects from "@/components/RelatedProjects";
import ProjectHeroWithInfo from "@/components/ProjectHeroWithInfo";

export const revalidate = 3600;

type FAQItem = { q: string; a: string };

type Project = {
  id: string;
  slug?: string;
  name: string;
  developer?: string;
  city?: string;
  location?: string;
  configuration?: string;
  price?: string;
  hero?: string;
  brochure?: string;
  brochure_pdf?: string;
  gallery?: string[];
  about?: string;

  // ✅ richer fields (from your schema)
  overview?: string;
  description?: string;
  possession?: string;
  highlights?: string[];
  amenities?: string[];
  virtualTourUrl?: string;
  video_url?: string;
  faq?: FAQItem[];
  rera?: string;
  propertyType?: "Residential" | "Commercial" | "Mixed";
};

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

const list: Project[] = Array.isArray(projectsData) ? (projectsData as Project[]) : [];
const findProject = (id: string) => list.find((p) => p.id === id);

const abs = (u?: string) =>
  !u
    ? undefined
    : /^https?:\/\//i.test(u)
    ? u
    : `${SITE}${u.startsWith("/") ? u : `/${u}`}`;

function priceNumber(p?: string) {
  if (!p) return undefined;
  const str = p.toLowerCase().replace(/[₹,\s]/g, "").trim();

  const cr = str.match(/^([\d.]+)(cr|crore)$/);
  if (cr) return String(Math.round(parseFloat(cr[1]) * 10000000));

  const lk = str.match(/^([\d.]+)(l|lakh)$/);
  if (lk) return String(Math.round(parseFloat(lk[1]) * 100000));

  const n = parseFloat(str);
  if (!isNaN(n)) {
    if (n < 1000) return String(Math.round(n * 10000000));
    return String(Math.round(n));
  }
  return undefined;
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
  const about = p.overview || p.description || p.about || "";

  const description =
    (
      [
        about,
        p.configuration,
        p.location ? `Location: ${p.location}` : "",
        p.price ? `Price: ${p.price}` : "",
        p.rera ? `RERA: ${p.rera}` : "",
      ]
        .filter(Boolean)
        .join(" • ")
    ).slice(0, 300) || `Explore ${p.name}${p.city ? ` in ${p.city}` : ""}.`;

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
  const priceValue = priceNumber(p.price);
  if (!priceValue) return null;

  const about = p.overview || p.description || p.about || "";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.id,
    brand: p.developer
      ? { "@type": "Brand", name: p.developer }
      : { "@type": "Brand", name: "ALTINA™ Livings" },
    description: [about, p.configuration, p.location, p.city]
      .filter(Boolean)
      .join(" • "),
    image: p.hero ? [abs(p.hero)] : undefined,
    category: "Real Estate",
    url: `${SITE}/projects/${p.id}`,
    offers: {
      "@type": "Offer",
      price: priceValue,
      priceCurrency: "INR",
      url: `${SITE}/projects/${p.id}`,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
        .toISOString()
        .slice(0, 10),
      seller: {
        "@type": "Organization",
        name: "ALTINA™ Livings",
        url: SITE,
        telephone: "+91-9891234195",
      },
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Projects",
        item: `${SITE}/projects`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: p.name,
        item: `${SITE}/projects/${p.id}`,
      },
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

  const brochure = p.brochure || p.brochure_pdf;

  const faqs: FAQItem[] =
    Array.isArray(p.faq) && p.faq.length > 0
      ? p.faq
      : [
          {
            q: `What is the price of ${p.name}?`,
            a: `The price for ${p.name} starts at ${p.price || "market-linked rates"}.`,
          },
          {
            q: `When is possession for ${p.name}?`,
            a: p.possession
              ? `${p.name} is expected to be ready by ${p.possession}.`
              : `Possession timelines are subject to developer updates.`,
          },
          {
            q: `Where is ${p.name} located?`,
            a: p.location
              ? `${p.name} is located at ${p.location}.`
              : `Located in a prime micro-market in Delhi NCR.`,
          },
          {
            q: `How can I get the brochure for ${p.name}?`,
            a: brochure
              ? `You can download the brochure by clicking on “Download Brochure” on this page.`
              : `Brochure details are available upon request.`,
          },
          ...(p.rera
            ? [
                {
                  q: `What is the RERA number for ${p.name}?`,
                  a: `${p.name} is listed with RERA number ${p.rera}.`,
                },
              ]
            : []),
        ];

  return (
    <main className="bg-[#0B0B0C] text-white">
      {/* HERO (render once here only) */}
      <ProjectHeroWithInfo
        id={p.id}
        name={p.name}
        city={p.city}
        location={p.location}
        hero={p.hero}
        configuration={p.configuration}
        price={p.price}
        brochure={brochure}
        images={p.gallery}
      />

      {/* Main project details (specs, amenities, gallery, etc.) */}
      <ProjectDetailClientShell project={p} />

      {/* FAQ */}
      <section
        className="max-w-6xl mx-auto px-4 pt-10 pb-6 border-t border-altina-gold/20"
        aria-label="Frequently Asked Questions"
      >
        <h2 className="text-2xl font-semibold text-altina-gold mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="border border-altina-gold/20 rounded-xl p-4 hover:border-altina-gold/40 transition-colors"
            >
              <summary className="cursor-pointer font-medium text-altina-gold">
                {faq.q}
              </summary>
              <p className="mt-2 text-neutral-300 text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Schema & Breadcrumbs */}
      <ProjectSchema p={p} />
      <ProjectBreadcrumbs p={p} />

      {/* Related projects */}
      <section className="max-w-6xl mx-auto px-4 mt-8 pb-10" aria-label="Related Projects">
        <div className="border-t border-altina-gold/20 pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-altina-gold mb-4">
            More like this
          </h2>
          <RelatedProjects currentId={p.id} developer={p.developer} city={p.city} />
        </div>
      </section>
    </main>
  );
}
