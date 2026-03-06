'use client'

import { usePathname } from 'next/navigation'

/**
 * Wraps website-only UI (Header, Footer, StickyCTA, Modals, etc.)
 * and hides everything when on CRM routes (/crm/*).
 */
export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCrm = pathname.startsWith('/crm')

  if (isCrm) return null

  return <>{children}</>
}
