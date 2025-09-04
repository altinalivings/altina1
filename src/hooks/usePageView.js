// hooks/usePageView.js
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackEvent } from '@/components/AnalyticsClient'

export default function usePageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      // Track pageview
      trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname
      })
    }
  }, [pathname, searchParams]    </Ssuspen>)
}
