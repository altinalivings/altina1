// src/app/blog/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import posts from "@/data/posts.json";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

export const metadata: Metadata = {
  title: "ALTINA™ Livings Blog | Insights on Luxury Real Estate in Delhi NCR",
  description:
    "Expert insights, guides and news on luxury apartments, independent floors and commercial real estate across Delhi NCR from ALTINA™ Livings.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "ALTINA™ Livings Blog | Luxury Real Estate Insights",
    description:
      "Stay updated with premium property news, investment trends, and expert articles by ALTINA™ Livings.",
    url: `${SITE}/blog`,
    siteName: "ALTINA™ Livings",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const list = (posts as any[])
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b.datePublished || b.date || 0).getTime() -
        new Date(a.datePublished || a.date || 0).getTime()
    );

  const featured = list[0];
  const rest = list.slice(1);

  const featuredCover =
    featured?.coverImage &&
    (featured.coverImage.startsWith("http")
      ? featured.coverImage
      : featured.coverImage.startsWith("/")
      ? featured.coverImage
      : `/${featured.coverImage}`);

  // Build Blog JSON-LD schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "ALTINA™ Livings Blog",
    description:
      "ALTINA™ Livings shares insights and market trends about luxury real estate in Delhi NCR.",
    url: `${SITE}/blog`,
    publisher: {
      "@type": "Organization",
      name: "ALTINA™ Livings",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/logos/Altina.png`,
      },
    },
    blogPost: list.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE}/blog/${p.slug}`,
      image: p.coverImage
        ? [
            p.coverImage.startsWith("http")
              ? p.coverImage
              : `${SITE}${
                  p.coverImage.startsWith("/") ? p.coverImage : `/${p.coverImage}`
                }`,
          ]
        : undefined,
      datePublished: p.datePublished,
      dateModified: p.lastmod || p.datePublished,
    })),
  };

  return (
    <main className="bg-[#0B0B0C] text-white min-h-screen">
      <PageHero
        title="Insights & Updates"
        subtitle="Market analysis, investment guides, and expert perspectives on Delhi NCR luxury real estate."
        image="/hero/blog.jpg"
        height="h-[40vh]"
        titleAs="h1"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Post — Large Hero Card */}
        {featured && (
          <section className="mt-12 mb-12">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-2xl border border-white/10 bg-[#111] overflow-hidden hover:border-altina-gold/40 transition-all"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {featuredCover && (
                  <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px] overflow-hidden">
                    <Image
                      src={featuredCover}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111]/60 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent md:hidden" />
                  </div>
                )}
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-altina-gold bg-altina-gold/10 rounded-full w-fit mb-4">
                    Latest
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-altina-ivory group-hover:text-altina-gold transition leading-tight">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-neutral-400 leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-3 text-sm text-neutral-500">
                    <time>
                      {new Date(featured.datePublished).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                    {featured.readingTimeMins && (
                      <>
                        <span>·</span>
                        <span>{featured.readingTimeMins} min read</span>
                      </>
                    )}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-altina-gold">
                    Read Full Analysis
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-altina-ivory">All Articles</h2>
          <span className="text-sm text-neutral-500">{list.length} articles</span>
        </div>

        {/* Blog Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {rest.map((p) => {
            const cover =
              p.coverImage &&
              (p.coverImage.startsWith("http")
                ? p.coverImage
                : p.coverImage.startsWith("/")
                ? p.coverImage
                : `/${p.coverImage}`);
            return (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                aria-label={`Read: ${p.title}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all hover:border-altina-gold/40 hover:shadow-[0_0_30px_rgba(191,149,63,0.08)]"
              >
                {cover && (
                  <div className="relative overflow-hidden aspect-[16/9]">
                    <Image
                      src={cover}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  {p.tags && p.tags[0] && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-altina-gold/60 mb-2">
                      {p.tags[0]}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-altina-ivory group-hover:text-altina-gold transition leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500 line-clamp-2 flex-1">
                    {p.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <span className="text-xs text-neutral-600">
                      {new Date(p.datePublished || p.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs font-medium text-altina-gold/50 uppercase tracking-wider group-hover:text-altina-gold transition">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        {/* Mid-page CTA */}
        <section className="rounded-2xl border border-altina-gold/20 bg-gradient-to-br from-altina-gold/8 via-transparent to-altina-gold/5 p-8 sm:p-12 mb-16">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-altina-ivory">
                Get Expert Property Advice
              </h2>
              <p className="mt-3 text-neutral-400 leading-relaxed max-w-xl">
                Our team advises on 16+ premium projects across Gurugram, Noida, Delhi &amp; Goa.
                Whether you&#39;re a first-time buyer or seasoned investor, we match you with the right property.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3.5 rounded-xl bg-altina-gold text-black font-semibold text-sm hover:bg-altina-gold/90 transition"
                >
                  Schedule Free Consultation
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center px-8 py-3.5 rounded-xl border border-white/20 text-altina-ivory font-semibold text-sm hover:border-altina-gold/40 transition"
                >
                  View All Projects
                </Link>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-center gap-2">
              <div className="text-4xl font-bold text-altina-gold">16+</div>
              <div className="text-sm text-neutral-500 text-center">Premium Projects<br />in Delhi NCR</div>
            </div>
          </div>
        </section>
      </div>

      {/* Blog Schema */}
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </main>
  );
}
