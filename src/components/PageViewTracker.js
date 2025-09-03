// components/PageViewTracker.js
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && typeof window !== 'undefined' && window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      
      window.gtag('config', 'G-3Q43P5GKHK', {
        page_path: url,
        debug_mode: true
      })
      
      console.log('GA Pageview tracked:', url)
    }
  }, [pathname, searchParams])

  return null
}
