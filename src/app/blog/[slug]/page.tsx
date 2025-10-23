// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import posts from "@/data/posts.json";

type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  contentHtml?: string; // if you store pre-rendered html
  author?: { name: string; url?: string; avatar?: string } | string;
  datePublished?: string; // ISO or yyyy-mm-dd
  lastmod?: string;       // ISO or yyyy-mm-dd
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

  // ✅ BlogPosting JSON-LD
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
        url: `${SITE}/logo.png`,
      },
    },
    datePublished: publishedISO,
    dateModified: modifiedISO,
    url,
    articleSection: post.tags && post.tags.length ? post.tags : undefined,
    wordCount: undefined, // add if you compute words
  };

  // Optional: Breadcrumbs JSON-LD
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 2, name: post.title, item: url },
    ],
  };

  return (
    <main className="bg-[#0B0B0C] text-white">
      <article className="max-w-3xl mx-auto px-4 pt-10 pb-16">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-altina-gold">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-neutral-300">
            {authorObj?.name || "ALTINA™ Livings"} ·{" "}
            <time dateTime={publishedISO}>
              {new Date(publishedISO).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </time>
            {post.readingTimeMins ? ` · ${post.readingTimeMins} min read` : ""}
          </p>
        </header>

        {image && (
          <div className="relative mb-6 overflow-hidden rounded-2xl">
            <Image
              src={image}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* If you store HTML in posts.json */}
        {post.contentHtml ? (
          <div
            className="prose prose-invert prose-lg max-w-none prose-a:text-altina-gold"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        ) : (
          <p className="text-neutral-200">
            {/* Fallback if content not provided */}
            {post.excerpt ||
              "ALTINA™ Livings insights on luxury apartments, independent floors, and commercial investment across Delhi NCR."}
          </p>
        )}
      </article>

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
