// src/lib/seo.ts
export const defaultSEO = {
  title: "Luxury Apartments & Builder Floors in Delhi NCR | ALTINA™ Livings",
  description:
    "Explore premium residential & commercial properties by DLF, Sobha & Godrej in Delhi NCR. ALTINA™ Livings — Gateway to Luxury Living.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.altinalivings.com",
    site_name: "ALTINA™ Livings",
    images: [
      {
        url: "https://www.altinalivings.com/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "ALTINA™ Livings — Gateway to Luxury Livings",
      },
    ],
  },
  twitter: {
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    { name: "robots", content: "index, follow" },
    {
      name: "keywords",
      content:
        "luxury apartments delhi,ncr luxury flats,gurgaon builder floors,dlf midtown moti nagar,dlf independent floors gurgaon,sco plots gurgaon,real estate channel partner delhi ncr",
    },
  ],
  additionalLinkTags: [
    { rel: "canonical", href: "https://www.altinalivings.com" },
    { rel: "icon", href: "/favicon.ico" },
  ],
} as const;
