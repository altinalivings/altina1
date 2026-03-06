// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import posts from "@/data/posts.json";

type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  contentHtml?: string;
  author?: { name: string; url?: string; avatar?: string } | string;
  datePublished?: string;
  lastmod?: string;
  tags?: string[];
  readingTimeMins?: number;
};

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

const ALL: Post[] = (posts as any[]).filter(Boolean);

const get = (slug: string) => ALL.find((p) => p.slug === slug);

export function generateStaticParams() {
  return ALL.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = get(params.slug);
  if (!post) return { title: "Post not found | ALTINA™ Livings" };

  const url = `${SITE}/blog/${post.slug}`;
  const title = `${post.title} | ALTINA™ Livings`;
  const description =
    post.excerpt ||
    "Insights from ALTINA™ Livings on luxury real estate across Delhi NCR.";
  const image =
    post.coverImage &&
    (post.coverImage.startsWith("http")
      ? post.coverImage
      : `${SITE}${post.coverImage.startsWith("/") ? post.coverImage : `/${post.coverImage}`}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "ALTINA™ Livings",
      images: image ? [{ url: image, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = get(params.slug);
  if (!post) return notFound();

  const url = `${SITE}/blog/${post.slug}`;

  const imageSrc =
    post.coverImage &&
    (post.coverImage.startsWith("http")
      ? post.coverImage
      : post.coverImage.startsWith("/")
      ? post.coverImage
      : `/${post.coverImage}`);

  const image =
    post.coverImage &&
    (post.coverImage.startsWith("http")
      ? post.coverImage
      : `${SITE}${post.coverImage.startsWith("/") ? post.coverImage : `/${post.coverImage}`}`);

  const authorObj =
    typeof post.author === "string" ? { name: post.author } : post.author;

  const publishedISO = post.datePublished
    ? new Date(post.datePublished).toISOString()
    : new Date().toISOString();

  const modifiedISO = post.lastmod
    ? new Date(post.lastmod).toISOString()
    : publishedISO;

  // Related posts: same tags, exclude current
  const related = ALL.filter(
    (p) =>
      p.slug !== post.slug &&
      p.tags &&
      post.tags &&
      p.tags.some((t) => post.tags!.includes(t))
  ).slice(0, 3);

  // If not enough related by tags, fill with recent posts
  if (related.length < 3) {
    const remaining = ALL.filter(
      (p) => p.slug !== post.slug && !related.find((r) => r.slug === p.slug)
    )
      .sort(
        (a, b) =>
          new Date(b.datePublished || "0").getTime() -
          new Date(a.datePublished || "0").getTime()
      )
      .slice(0, 3 - related.length);
    related.push(...remaining);
  }

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description:
      post.excerpt ||
      "Insights from ALTINA™ Livings on luxury real estate in Delhi NCR.",
    image: image ? [image] : undefined,
    author: authorObj
      ? { "@type": "Person", name: authorObj.name, url: authorObj.url }
      : { "@type": "Organization", name: "ALTINA™ Livings" },
    publisher: {
      "@type": "Organization",
      name: "ALTINA™ Livings",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/logos/Altina.png`,
      },
    },
    datePublished: publishedISO,
    dateModified: modifiedISO,
    url,
    articleSection: post.tags && post.tags.length ? post.tags : undefined,
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <main className="bg-[#0B0B0C] text-white min-h-screen">
      {/* Full-width hero cover image */}
      {imageSrc && (
        <div className="relative w-full h-[40vh] sm:h-[50vh] overflow-hidden">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/40 to-transparent" />
        </div>
      )}

      {/* Article layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
          {/* Main content column */}
          <article className={imageSrc ? "-mt-24 relative z-10" : "pt-10"}>
            {/* Header */}
            <header className="mb-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                <Link href="/" className="hover:text-altina-gold transition">Home</Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-altina-gold transition">Blog</Link>
                <span>/</span>
                <span className="text-neutral-400 truncate max-w-[200px] sm:max-w-none">{post.title}</span>
              </nav>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight text-altina-ivory">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-altina-gold/20 flex items-center justify-center text-altina-gold text-xs font-bold">
                    A
                  </div>
                  <span>{authorObj?.name || "ALTINA™ Livings"}</span>
                </div>
                <span className="text-neutral-600">|</span>
                <time dateTime={publishedISO}>
                  {new Date(publishedISO).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                {post.readingTimeMins && (
                  <>
                    <span className="text-neutral-600">|</span>
                    <span>{post.readingTimeMins} min read</span>
                  </>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full border border-altina-gold/20 text-altina-gold/70 bg-altina-gold/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Article body */}
            {post.contentHtml ? (
              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-altina-ivory prose-headings:font-semibold
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-neutral-300 prose-p:leading-relaxed
                  prose-a:text-altina-gold prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-altina-ivory
                  prose-li:text-neutral-300
                  prose-img:rounded-xl prose-img:my-6
                  prose-table:border-collapse
                  prose-th:text-left prose-th:p-3
                  prose-td:p-3"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            ) : (
              <p className="text-neutral-200 text-lg leading-relaxed">
                {post.excerpt ||
                  "ALTINA™ Livings insights on luxury apartments, independent floors, and commercial investment across Delhi NCR."}
              </p>
            )}

            {/* Bottom CTA */}
            <div className="mt-14 mb-8 rounded-2xl border border-altina-gold/30 bg-gradient-to-br from-altina-gold/10 via-altina-gold/5 to-transparent p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-semibold text-altina-ivory">
                    Need Expert Guidance?
                  </h3>
                  <p className="mt-2 text-neutral-400 leading-relaxed">
                    Our advisory team specializes in luxury real estate across Delhi NCR.
                    Get personalized project recommendations — zero cost to buyers.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-altina-gold text-black font-semibold text-sm whitespace-nowrap hover:bg-altina-gold/90 transition-colors"
                >
                  Talk to an Advisor
                </Link>
              </div>
            </div>

            {/* Share section */}
            <div className="flex items-center gap-4 py-6 border-t border-white/10">
              <span className="text-sm text-neutral-500 font-medium">Share this article:</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-green-400 hover:border-green-400/30 transition"
                aria-label="Share on WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-sky-400 hover:border-sky-400/30 transition"
                aria-label="Share on X"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-blue-400 hover:border-blue-400/30 transition"
                aria-label="Share on LinkedIn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(url)}`}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-altina-gold hover:border-altina-gold/30 transition"
                aria-label="Share via Email"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:pt-10 order-first lg:order-last">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Advisory CTA card */}
              <div className="rounded-2xl border border-altina-gold/20 bg-gradient-to-b from-[#161310] to-[#0f0f10] p-6">
                <div className="w-12 h-12 rounded-xl bg-altina-gold/10 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#BF953F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <h3 className="text-lg font-semibold text-altina-ivory">Free Advisory Call</h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  Get personalized project recommendations from our Delhi NCR specialists. Zero cost — developers pay our fee.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-altina-gold text-black font-semibold text-sm hover:bg-altina-gold/90 transition"
                >
                  Schedule Now
                </Link>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919810000000?text=Hi%2C%20I%20read%20your%20blog%20and%20would%20like%20to%20know%20more"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 p-5 hover:border-green-500/40 transition group"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <span className="text-sm font-semibold text-green-400 group-hover:text-green-300">Chat on WhatsApp</span>
                  <p className="text-xs text-neutral-500">Quick response guaranteed</p>
                </div>
              </a>

              {/* Browse Projects */}
              <Link
                href="/projects"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-altina-gold/30 transition group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BF953F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </div>
                <div>
                  <span className="text-sm font-semibold text-altina-ivory group-hover:text-altina-gold transition">Browse All Projects</span>
                  <p className="text-xs text-neutral-500">16+ curated properties in Delhi NCR</p>
                </div>
              </Link>

              {/* Table of Contents hint */}
              <div className="hidden lg:block rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">More from ALTINA Blog</h4>
                <div className="space-y-3">
                  {ALL.filter(p => p.slug !== post.slug).slice(0, 4).map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="block text-sm text-neutral-400 hover:text-altina-gold transition leading-snug"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Posts Section - Full Width */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <div className="border-t border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-altina-ivory mb-8">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => {
                const relCover =
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
                    className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-altina-gold/40 transition-all"
                  >
                    {relCover && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={relCover}
                          alt={p.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-semibold text-altina-ivory group-hover:text-altina-gold transition leading-snug">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-500 line-clamp-2 flex-1">{p.excerpt}</p>
                      <span className="mt-3 text-xs font-medium text-altina-gold/60 uppercase tracking-wider">
                        Read Article →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Banner - Full Width */}
      <section className="border-t border-white/10 bg-gradient-to-r from-altina-gold/5 via-transparent to-altina-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-altina-ivory">
              Looking for Your Next Property?
            </h2>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              We work with DLF, SOBHA, Emaar, M3M, and 10+ other leading developers.
              Our advisory is free — developers compensate us directly.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3.5 rounded-xl bg-altina-gold text-black font-semibold text-sm hover:bg-altina-gold/90 transition"
              >
                Get Free Consultation
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-3.5 rounded-xl border border-white/20 text-altina-ivory font-semibold text-sm hover:border-altina-gold/40 transition"
              >
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <Script
        id={`blogposting-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
      />
      <Script
        id={`breadcrumbs-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </main>
  );
}
