// src/app/developers/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import devs from "@/data/developers.json";
import allProjects from "@/data/projects";
import { getDeveloperBySlug } from "@/data/unified";
import Link from "next/link";
import FloatingCTAs from "@/components/FloatingCTAs";
import SmartHero from "./SmartHero";

type KV = [string, string];

type Dev = {
  slug: string;
  name: string;
  hero?: string;
  logo?: string;
  tagline?: string;
  about?: string;
  stats?: KV[];
  usps?: string[];
  awards?: string[];
  timeline?: KV[];
  offices?: KV[];
  map?: { embed?: string; title?: string };
  pressLogos?: string[];
  video?: { provider?: "youtube" | "loom" | "vimeo"; id?: string; url?: string };
  gallery?: string[];
  projects?: string[];
};

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

export function generateStaticParams() {
  return (devs as Dev[]).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const d = (devs as Dev[]).find((x) => x.slug === params.slug);
  if (!d) return { title: "Developer not found | ALTINA™ Livings" };

  const title = `${d.name} Projects in Delhi NCR | ALTINA™ Livings`;
  const description = (
    d.about ||
    d.tagline ||
    `Explore ${d.name} projects in Delhi NCR via ALTINA™ Livings.`
  ).slice(0, 155);

  const heroAbs = d.hero
    ? d.hero.startsWith("http")
      ? d.hero
      : `${SITE}${d.hero}`
    : `${SITE}/og.jpg`;

  return {
    title,
    description,
    alternates: { canonical: `/developers/${d.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE}/developers/${d.slug}`,
      siteName: "ALTINA™ Livings",
      images: [{ url: heroAbs, width: 1200, height: 630, alt: d.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroAbs],
    },
  };
}

function DeveloperSchemas({ d }: { d: Dev }) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Developers", item: `${SITE}/developers` },
      { "@type": "ListItem", position: 3, name: d.name, item: `${SITE}/developers/${d.slug}` },
    ],
  };

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: d.name,
    description: d.about || d.tagline,
    url: `${SITE}/developers/${d.slug}`,
    logo: d.logo
      ? d.logo.startsWith("http")
        ? d.logo
        : `${SITE}${d.logo}`
      : undefined,
    image: d.hero
      ? d.hero.startsWith("http")
        ? d.hero
        : `${SITE}${d.hero}`
      : undefined,
  };

  return (
    <>
      <Script
        id={`dev-breadcrumbs-${d.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Script
        id={`dev-org-${d.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
    </>
  );
}

export default function DeveloperDetailPage({ params }: { params: { slug: string } }) {
  const d = (devs as Dev[]).find((x) => x.slug === params.slug);
  if (!d) return notFound();

  const projects = (() => {
    const unified = getDeveloperBySlug(params.slug);
    if (unified && unified.projects.length > 0) return unified.projects;
    return (allProjects as any[]).filter((p) => d.projects?.includes(p.id));
  })();

  return (
    <>
      {/* HERO */}
      <section className="relative h-[44vh] min-h-[360px] overflow-hidden">
        <SmartHero slug={d.slug} src={d.hero} alt={d.name} />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-10">
          <div className="golden-frame modal-surface rounded-2xl p-5 flex items-center gap-3">
            {d.logo && (
              <img src={d.logo} alt={`${d.name} logo`} className="h-8 w-auto object-contain" />
            )}
            <div>
              <h1 className="text-3xl font-semibold">{d.name}</h1>
              {d.tagline && <p className="mt-1 text-neutral-300">{d.tagline}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {d.about && (
          <Section title={`About ${d.name}`}>
            <p className="text-neutral-300 leading-relaxed">{d.about}</p>
          </Section>
        )}

        {d.usps?.length ? (
          <Section title="Why Choose This Developer">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {d.usps.map((u) => (
                <li key={u} className="rounded-xl border border-white/10 p-3">
                  <div className="text-neutral-200">{u}</div>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {d.stats?.length ? (
          <Section title="Key Facts">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {d.stats.map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/10 p-3">
                  <div className="text-sm text-neutral-400">{k}</div>
                  <div className="text-lg">{v}</div>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {projects.length ? (
          <Section title={`Projects by ${d.name}`}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 hover:border-amber-400/40 transition"
                >
                  <div className="relative h-48">
                    <img
                      src={p.hero || "/hero/projects.jpg"}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className="font-medium">{p.name}</div>
                    {p.location && <div className="text-sm text-neutral-400">{p.location}</div>}
                    {p.price && <div className="mt-1 text-sm text-neutral-300">{p.price}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        ) : null}
      </main>

      <DeveloperSchemas d={d} />
      <FloatingCTAs projectId={`developer-${d.slug}`} projectName={d.name} />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="modal-surface golden-frame p-6">
      <h2 className="text-xl font-semibold gold-text">{title}</h2>
      <div className="golden-divider my-3" />
      {children}
    </section>
  );
}
