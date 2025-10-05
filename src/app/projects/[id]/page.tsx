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
  images?: string[];
  description?: string;
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

// --- SSG params
export function generateStaticParams() {
  return list.map((p) => ({ id: p.id }));
}

// --- Metadata (SEO + OG)
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const p = findProject(params.id);
  if (!p) return { title: "Project not found | ALTINA™ Livings" };

  const title = `${p.name}${p.city ? ` in ${p.city}` : ""} | ${
    p.developer ? `${p.developer} • ` : ""
  }ALTINA™ Livings`;
  const description =
    [
      p.description,
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

// --- JSON-LD: Product schema
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

// --- JSON-LD: Breadcrumb schema
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

// --- Page
export default function ProjectPage({ params }: { params: { id: string } }) {
  const p = findProject(params.id);
  if (!p) return notFound();

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      <ProjectDetailClientShell project={p} />
      <ProjectSchema p={p} />
      <ProjectBreadcrumbs p={p} />
    </main>
  );
}
