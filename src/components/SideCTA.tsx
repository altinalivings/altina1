/*
 * Floating call‑to‑action bar
 *
 * This component renders two vertically stacked buttons on the right side of
 * the viewport.  It uses the existing Altina button styles (`btn-gold` and
 * `btn-emerald`) for consistent theming.  The bar is fixed to the right
 * of the screen and vertically centered, ensuring it remains visible as
 * users scroll the page.  Because it relies on browser APIs (e.g. window
 * dimensions) it must run on the client; the `'use client'` directive
 * ensures Next.js treats this file as a client component.
 */

'use client'

import { usePathname } from 'next/navigation'

export default function SideCTA() {
  const pathname = usePathname()
  // Do not render the global side CTA on project pages; the project page
  // has its own CTA rail with additional actions.
  if (pathname.startsWith('/projects/')) {
    return null
  }
  // Dispatch a custom event to open the visit drawer.  This event is
  // listened for by the VisitDrawer component; emitting it here allows
  // the drawer to open from any page without direct prop drilling.
  const openVisit = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-visit-drawer'))
    }
  }
  return (
    <div className="fixed right-4 top-1/2 z-50 -translate-y-1/2 hidden md:flex flex-col gap-3">
      {/* Call Now button uses a global phone number; adjust the href as needed. */}
      <a
        href="tel:+9891234195"
        className="btn btn-emerald"
        style={{ whiteSpace: 'nowrap' }}
      >
        Call Now
      </a>
      {/* Organize a Visit triggers the floating drawer */}
      <button type=\"button\"
        onClick={openVisit}
        className="btn btn-gold"
        style={{ whiteSpace: 'nowrap' }}
      >
        Organize a Visit
      </button>
    </div>
  )
}