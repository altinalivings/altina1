// src/components/SiteFooter.tsx
'use client'

import Link from 'next/link'

/**
 * Minimal, valid JSX footer to unblock the build.
 * You can re-expand content later.
 */
export default function SiteFooter() {
  return (
    <footer className="w-full mt-20 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-2">
          <div className="text-lg font-semibold tracking-wide">ALTINA™ Livings</div>
          <p className="text-sm opacity-70">
            Gateway to Luxury Livings — premium real estate across Delhi-NCR.
          </p>
        </div>

        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-1 text-sm">
            <li><Link href="/about" className="opacity-80 hover:opacity-100">About</Link></li>
            <li><Link href="/projects" className="opacity-80 hover:opacity-100">Projects</Link></li>
            <li><Link href="/contact" className="opacity-80 hover:opacity-100">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-2">Reach us</div>
          <ul className="space-y-1 text-sm opacity-80">
            <li>+91 98912 34195</li>
            <li>hello@altinalivings.com</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-2">Legal</div>
          <ul className="space-y-1 text-sm opacity-80">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} ALTINA™ Livings. All rights reserved.
      </div>
    </footer>
  )
}
