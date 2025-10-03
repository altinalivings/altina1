import Link from "next/link";
import posts from "@/data/posts.json";

export const metadata = {
  title: "Insights & Blog | Altina™ Livings",
  description: "Market insights, RERA guides, and luxury property trends across Delhi NCR by Altina™ Livings.",
};

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Insights & Blog</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug} className="rounded-xl overflow-hidden border border-white/10 bg-white/0">
  {p.coverImage ? (
    <div className="relative h-40">
      <Image src={p.coverImage} alt={p.title} fill sizes="33vw" className="object-cover" />
    </div>
  ) : null}
  <div className="p-5">
    <h2 className="text-xl font-semibold mb-2">
      <Link href={`/blog/${p.slug}`} className="hover:underline">{p.title}</Link>
    </h2>
    <p className="text-sm opacity-80 line-clamp-3">{p.excerpt}</p>
    <p className="text-xs opacity-60 mt-2">{p.date} • {p.author}</p>
  </div>
</li>
        ))}
      </ul>
    </main>
  );
}
