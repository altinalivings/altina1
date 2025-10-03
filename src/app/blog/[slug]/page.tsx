// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import posts from "@/data/posts.json";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts.find((p: any) => p.slug === params.slug);
  if (!post) return { title: "Insights | Altina™ Livings" };
  return {
    title: `${post.title} | Altina™ Insights`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Altina™ Insights`,
      description: post.excerpt,
      url: `https://www.altinalivings.com/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      type: "article"
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post: any = posts.find((p: any) => p.slug === params.slug);

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </main>
    );
  }

  return (
    <article>
      {/* HERO */}
      <section className="relative w-full h-[42vh] min-h-[280px] lg:h-[52vh] overflow-hidden rounded-2xl border border-white/10">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFF6D6] via-[#f7e9b7] to-[#c5a657]/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">{post.title}</h1>
          <p className="mt-2 text-sm opacity-80">{post.date} • {post.author}</p>
        </div>
      </section>

      {/* BODY */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        {post.excerpt && (
          <p className="mb-6 text-base opacity-90">{post.excerpt}</p>
        )}
        {post.content?.map((para: string, i: number) => (
          <p key={i} className="mb-5 leading-7 opacity-90">{para}</p>
        ))}
        {post.tags?.length ? (
          <p className="text-sm opacity-70 mt-8">Tags: {post.tags.join(", ")}</p>
        ) : null}
      </main>
    </article>
  );
}
