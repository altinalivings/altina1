// src/app/projects/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import projectsData from "@/data/projects.json";
import ProjectDetailClientShell from "@/components/ProjectDetailClientShell";
import RelatedProjects from "@/components/RelatedProjects";

export const revalidate = 3600; // ISR: re-generate static HTML every hour

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

// ✅ Parse Indian-style prices (₹, Cr, Lakh) to a clean integer string in INR
function priceNumber(p?: string) {
  if (!p) return undefined;
  const str = p.toLowerCase().replace(/[₹,\s]/g, "").trim();

  // e.g. "4.7cr", "4.7crore"
  const cr = str.match(/^([\d.]+)(cr|crore)$/);
  if (cr) return String(Math.round(parseFloat(cr[1]) * 10000000)); // 1 Cr = 10,000,000

  // e.g. "85l", "85lakh"
  const lk = str.match(/^([\d.]+)(l|lakh)$/);
  if (lk) return String(Math.round(parseFloat(lk[1]) * 100000)); // 1 Lakh = 100,000

  // fallback: already numeric (e.g. "47000000") or ambiguous ("4.7" → assume Cr)
  const n = parseFloat(str);
  if (!isNaN(n)) {
    if (n < 1000) return String(Math.round(n * 10000000)); // treat small numbers as crores
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
  const description =
    (
      [
        p.about,
        p.configuration,
        p.location ? `Location: ${p.location}` : "",
        p.price ? `Price: ${p.price}` : "",
      ]
        .filter(Boolean)
        .join(" • ")
    ).slice(0, 300) ||
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
  const priceValue = priceNumber(p.price); // parse first

  // ⛔ If we don't have a numeric price AND we have no reviews/ratings,
  //     don't emit Product schema (prevents "invalid item" in GSC)
  if (!priceValue) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.id,
    brand: p.developer
      ? { "@type": "Brand", name: p.developer }
      : { "@type": "Brand", name: "ALTINA™ Livings" },
    description: [p.configuration, p.location, p.city, p.about]
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
    // If you ever have real data:
    // aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "17" },
    // review: [ ... ]
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

  const faqs = [
    { q: `What is the price of ${p.name}?`, a: `The price for ${p.name} starts at ${p.price || "market-linked rates"}.` },
    { q: `When is possession for ${p.name}?`, a: p.possession ? `${p.name} is expected to be ready by ${p.possession}.` : `Possession timelines are subject to developer updates.` },
    { q: `Where is ${p.name} located?`, a: p.location ? `${p.name} is located at ${p.location}.` : `Located in a prime micro-market in Delhi NCR.` },
    { q: `How can I get the brochure for ${p.name}?`, a: p.brochure ? `You can download the official brochure by clicking on “Download Brochure” on this page.` : `Brochure details are available upon request.` },
  ];

  return (
    <main className="bg-[#0B0B0C] text-white">
      <ProjectDetailClientShell project={p} />

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-altina-gold/20">
        <h2 className="text-2xl font-semibold text-altina-gold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="border border-altina-gold/20 rounded-xl p-4 hover:border-altina-gold/40 transition-colors">
              <summary className="cursor-pointer font-medium text-altina-gold">{faq.q}</summary>
              <p className="mt-2 text-neutral-300 text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
      {/* FAQPage JSON-LD */}
      <Script
        id={`faq-schema-${p.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: `What is the price of ${p.name}?`, acceptedAnswer: { "@type": "Answer", text: `The price for ${p.name} starts at ${p.price || "market-linked rates"}.` } },
              { "@type": "Question", name: `When is possession for ${p.name}?`, acceptedAnswer: { "@type": "Answer", text: p.possession ? `${p.name} is expected to be ready by ${p.possession}.` : `Possession timelines are subject to developer updates.` } },
              { "@type": "Question", name: `Where is ${p.name} located?`, acceptedAnswer: { "@type": "Answer", text: p.location ? `${p.name} is located at ${p.location}.` : `Located in a prime micro-market in Delhi NCR.` } },
              { "@type": "Question", name: `How can I get the brochure for ${p.name}?`, acceptedAnswer: { "@type": "Answer", text: p.brochure ? `You can download the official brochure by clicking on “Download Brochure” on this page.` : `Brochure details are available upon request.` } },
            ],
          }),
        }}
      />
		
		<section className="max-w-6xl mx-auto px-4 mt-8">
  <RelatedProjects currentId={p.id} projects={list} />
</section>

      {/* JSON-LD for Product & Breadcrumbs */}
      <ProjectSchema p={p} />
      <ProjectBreadcrumbs p={p} />

      
    </main>
  );
}
