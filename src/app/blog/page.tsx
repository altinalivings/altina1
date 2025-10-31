// src/app/blog/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | ALTINA Livings",
  description: "Updates, guides and insights from ALTINA Livings.",
};

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <p className="mt-2 text-white/70">
        Posts coming soon. Meanwhile, explore our latest projects and guides.
      </p>
    </main>
  );
}
