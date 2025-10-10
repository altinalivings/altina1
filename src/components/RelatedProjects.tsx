'use client';

import Link from 'next/link';

type Project = {
  id: string;
  slug: string;
  name?: string;
  city?: string;
  developer?: string;
  hero?: string;
};

interface Props {
  currentId: string;
  projects: Project[];
  limit?: number;
}

export default function RelatedProjects({ currentId, projects, limit = 3 }: Props) {
  const list = (projects || [])
    .filter(p => p.id !== currentId)
    .slice(0, limit);

  if (!list.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">More like this</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map(p => (
          <Link key={p.id} href={`/projects/${p.slug || p.id}`} className="block rounded-2xl border border-zinc-200 p-4 hover:shadow-md transition">
            <div className="text-lg font-medium">{p.name || p.id}</div>
            <div className="text-sm text-zinc-600">{[p.developer, p.city].filter(Boolean).join(" • ")}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
