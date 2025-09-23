import type { Metadata } from "next";
import posts from "@/data/posts.json";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Insights | Altina™ Livings" };
  return {
    title: `${post.title} | Altina™ Insights`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Altina™ Insights`,
      description: post.excerpt,
      url: `https://www.altinalivings.com/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      <p className="text-sm opacity-70 mb-6">{post.date} • {post.author}</p>
      {post.coverImage && <img src={post.coverImage} alt={post.title} className="rounded-xl mb-6" />}
      {post.content?.map((para: string, i: number) => (
        <p key={i} className="mb-4 leading-7 opacity-90">{para}</p>
      ))}
      {post.tags?.length ? (
        <p className="text-sm opacity-70 mt-6">Tags: {post.tags.join(", ")}</p>
      ) : null}
    </main>
  );
}
