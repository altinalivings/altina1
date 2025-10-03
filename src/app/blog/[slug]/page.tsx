// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import posts from "@/data/posts.json";

type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  author?: string;
  coverImage?: string; // e.g. "/blog/altina-intro-hero.jpg"
  content?: string[];
  tags?: string[];
};

const SITE = "https://www.altinalivings.com";
const DEFAULT_OG = "/blog/altina-blog-default.jpg";

/** make absolute URL for OG/Twitter */
function abs(path: string) {
  if (!path) return undefined as unknown as string;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE}${path}`;
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const p = (posts as Post[]).find((x) => x.slug === params.slug);

  const title = p?.title ?? "Insights | ALTINA™ Livings";
  const description =
    p?.excerpt ?? "Luxury real estate insights and guides from ALTINA™ Livings.";
  const og = abs(p?.coverImage ?? DEFAULT_OG);

  return {
    title,
    description,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE}/blog/${params.slug}`,
      siteName: "ALTINA™ Livings",
      images: og ? [{ url: og, width: 1200, height: 630, alt: p?.title ?? "Altina™ Insights" }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: og ? [og] : undefined,
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = (posts as Post[]).find((x) => x.slug === params.slug);
  if (!post) notFound();

  return (
    <article>
      {/* HERO — slim height for blog */}
      <section className="relative w-full aspect-[12/5] overflow-hidden rounded-2xl border border-white/10">
  {post.coverImage ? (
    <Image
      src={post.coverImage}      // e.g. /blog/dlf-midtown-hero.jpg (1920x800)
      alt={post.title}
      fill
      priority
      sizes="100vw"
      className="object-cover"   // no crop since container uses same ratio
    />
  ) : (
    <Image
      src="/blog/altina-blog-default.jpg"
      alt="Altina™ Insights"
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  )}
  {/* keep your gradient if you like */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
    <h1 className="text-lg md:text-2xl font-bold drop-shadow-lg">{post.title}</h1>
    {(post.date || post.author) && (
      <p className="mt-1 text-xs md:text-sm opacity-80">
        {post.date ?? ""} {post.date && post.author ? "•" : ""} {post.author ?? ""}
      </p>
    )}
  </div>
</section>


      {/* BODY */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        {post.excerpt && (
          <p className="mb-6 text-base opacity-90">{post.excerpt}</p>
        )}

        {post.content?.map((para, i) => (
          <p key={i} className="mb-5 leading-7 opacity-90">
            {para}
          </p>
        ))}

        {post.tags?.length ? (
          <p className="text-sm opacity-70 mt-8">
            <span className="opacity-80">Tags:</span> {post.tags.join(", ")}
          </p>
        ) : null}
      </main>
    </article>
  );
}
