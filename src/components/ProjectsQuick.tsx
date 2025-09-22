/*
 * ProjectsQuick component
 *
 * Shows the first few entries from projects.json as a simple list. Each item
 * links to its detailed page and displays the developer and location. Feel free
 * to adjust the fields to suit your dataset (price, type, etc.).
 */
import Link from 'next/link'
import projects from '@/data/projects.json'

export default function ProjectsQuick() {
  const featured = (projects as any[]).slice(0, 6)
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="h-serif text-2xl font-semibold">Featured projects</h2>
          <p className="text-muted mt-1">Handpicked launches across Gurugram.</p>
        </div>
        <Link
          href="/projects"
          className="btn border border-white/20 hover:border-white/50"
        >
          View all
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {featured.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="card p-4 hover:scale-[1.01] transition"
          >
            <div className="text-lg font-semibold h-serif">{p.name}</div>
            <div className="text-white/70 text-base">
              {p.developer} • {p.location}
            </div>
            {p.price && <div className="mt-1 text-[var(--gold-2)]">{p.price}</div>}
          </Link>
        ))}
      </div>
    </div>
  )
}