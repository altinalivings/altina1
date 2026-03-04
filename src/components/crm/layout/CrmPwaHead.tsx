'use client'

import { useEffect } from 'react'

export default function CrmPwaHead() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/crm-sw.js', { scope: '/crm/' })
        .catch((err) => console.warn('CRM SW registration failed:', err))
    }
  }, [])

  return (
    <>
      <link rel="manifest" href="/crm-manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="ALTINA CRM" />
    </>
  )
}
