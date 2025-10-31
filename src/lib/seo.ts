export const defaultSEO = {
  titleTemplate: '%s | ALTINA™ Livings',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.altina.example',
    siteName: 'ALTINA™ Livings',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'ALTINA™' }],
  },
  twitter: { cardType: 'summary_large_image' },
}