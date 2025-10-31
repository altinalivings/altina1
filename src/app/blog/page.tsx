// src/app/blog/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
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
  const list = (posts as any[]).filter(Boolean);

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
        url: `${SITE}/logo.png`,
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
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-16">
        <h1 className="text-2xl sm:text-3xl font-semibold text-altina-gold mb-8">
          Insights &amp; Updates
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              aria-label={`Read blog post: ${p.title}`}
              className="group flex flex-col rounded-2xl border border-altina-gold/30 bg-gradient-to-b from-[#111] to-[#0b0b0b] p-4 transition-all hover:border-altina-gold/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]"
            >
              {p.coverImage && (
                <div className="relative mb-4 overflow-hidden rounded-xl aspect-[16/9]">
                  <Image
                    src={
                      p.coverImage.startsWith("http")
                        ? p.coverImage
                        : `${SITE}${
                            p.coverImage.startsWith("/")
                              ? p.coverImage
                              : `/${p.coverImage}`
                          }`
                    }
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}

              <h2 className="text-lg font-semibold text-altina-ivory group-hover:text-altina-gold transition">
                {p.title}
              </h2>
              <p className="text-sm text-altina-gold/70 mt-2 line-clamp-3">
                {p.excerpt}
              </p>

              <span className="mt-4 text-xs uppercase tracking-wider text-altina-gold/60">
                Read More ?
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Blog Schema */}
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </main>
  );
}
