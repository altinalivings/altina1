"use client";

/*
 * SeoProvider component
 * Wraps DefaultSeo and injects ALTINA™ Livings structured data
 * with multiple locations and priceRange.
 */

import { DefaultSeo } from "next-seo";
import { defaultSEO } from "@/lib/seo";
import Script from "next/script";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.altinalivings.com";

export default function SeoProvider() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "RealEstateAgent"],
    name: "ALTINA™ Livings",
    url: SITE,
    logo: `${SITE}/logo.png`,
    image: [`${SITE}/logo.png`],
    telephone: "+91 98912 34195",
    priceRange: "₹₹₹₹",
    description:
      "ALTINA™ Livings — Gateway to Luxury Livings. A premium channel partner for marquee developers across Delhi NCR.",
    sameAs: [
      "https://www.instagram.com/altinalivings",
      "https://www.linkedin.com/company/altina-livings",
      "https://www.youtube.com/@AltinaLivings",
    ],
    openingHours: "Mo-Sa 10:00-19:00",

    // ✅ Multiple locations
    department: [
      {
        "@type": "LocalBusiness",
        name: "ALTINA™ Livings – Gurugram Office",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Suite C, 704, 7th Floor, Palm Court, Mehrauli–Gurgaon Road, Sector 16",
          addressLocality: "Gurugram",
          addressRegion: "Haryana",
          postalCode: "122007",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "28.4595",
          longitude: "77.0266",
        },
      },
      {
        "@type": "LocalBusiness",
        name: "ALTINA™ Livings – Delhi Office",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "26 & 27 A, H-Block, Office No. 401 & 404, Vikas Marg, Laxmi Nagar",
          addressLocality: "Delhi",
          addressRegion: "Delhi",
          postalCode: "110092",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "28.6391",
          longitude: "77.2772",
        },
      },
      {
        "@type": "LocalBusiness",
        name: "ALTINA™ Livings – Head Office (Ghaziabad)",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Apartment No. 301, 12th Floor, GH Plot No. 6, Sam Residency, Crossing Republik",
          addressLocality: "Ghaziabad",
          addressRegion: "Uttar Pradesh",
          postalCode: "201016",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "28.6235",
          longitude: "77.4311",
        },
      },
    ],
  };

  return (
    <>
      <DefaultSeo {...defaultSEO} />

      {/* Global Structured Data */}
      <Script
        id="altina-localbusiness"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
    </>
  );
}