import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16 py-10 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 text-xs text-muted grid gap-6 md:grid-cols-2">
        <div>
          <div className="h-serif font-semibold text-white">ALTINA™ Livings</div>
          <p>Channel partner — Gurugram • Delhi‑NCR</p>
          <p>© {new Date().getFullYear()} Altina Livings. All rights reserved.</p>
        </div>
        <div className="md:text-right flex flex-col md:flex-row md:items-center md:justify-end gap-3 md:gap-4">
          <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
        </div>
      </div>
    </footer>
  )
}
