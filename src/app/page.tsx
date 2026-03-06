// src/app/page.tsx
import type { Metadata } from "next";
import Script from "next/script";

import projects from "@/data/projects";
import developers from "@/data/developers.json";

import PageHero from "@/components/PageHero";
import FeaturedProjects from "@/components/FeaturedProjects";
import FeaturedDevelopers from "@/components/FeaturedDevelopers";
import ServicesWeOffer from "@/components/ServicesWeOffer";
import ValueProposition from "@/components/ValueProposition";
import MiniCTA from "@/components/MiniCTA";
import TestimonialsSection from "@/components/TestimonialsSection";
import LocationsSection from "@/components/LocationsSection";
import FloatingCTAs from "@/components/FloatingCTAs";

export const metadata: Metadata = {
  title: "Luxury Properties in Delhi NCR | Premium Apartments, Villas & Builder Floors | ALTINA™",
  description:
    "Find luxury apartments, penthouses, builder floors & villas in Delhi NCR. Expert channel partner for DLF, SOBHA, M3M, Godrej projects in Gurgaon, Noida, Delhi. Best prices guaranteed. 500+ happy families.",
  keywords: [
    "luxury properties Delhi NCR",
    "apartments in Gurgaon",
    "flats in Noida",
    "builder floors Delhi",
    "DLF projects",
    "SOBHA apartments",
    "M3M projects",
    "Godrej properties",
    "luxury real estate NCR",
    "property in Golf Course Road",
    "Dwarka Expressway properties",
    "Noida Expressway apartments",
    "premium real estate channel partner"
  ],
  alternates: { canonical: "https://www.altinalivings.com" },
  openGraph: {
    title: "Luxury Properties Delhi NCR | ALTINA™ Livings",
    description:
      "Discover premium residential & commercial projects in Delhi NCR with ALTINA™ Livings, trusted channel partner for marquee developers. 500+ happy families.",
    images: ["/og.jpg"],
    url: "https://www.altinalivings.com",
    type: "website",
    siteName: "ALTINA™ Livings",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Properties Delhi NCR | ALTINA™ Livings",
    description: "Premium apartments, villas & builder floors from top developers in Gurgaon, Noida & Delhi",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function HomePage() {
  const cityOptions = Array.from(
    new Set((projects as any[]).map((p: any) => (p.city || "").trim()).filter(Boolean))
  ).sort();

  const featuredProjects = (projects as any[])
    .filter((p: any) => p.featured === true)
    .sort((a: any, b: any) => (a.featured_order ?? 999) - (b.featured_order ?? 999));

  return (
    <main>
      {/* Enhanced Hero with better semantic HTML */}
      <PageHero
        title="ALTINA™ Livings"
        subtitle="Curated launches across Delhi NCR. Luxury channel partner for leading developers."
        image="/hero/home.jpg"
        height="h-[64vh]"
      />

      {/* Search Bar - Enhanced for SEO */}
      <section 
        className="max-w-6xl mx-auto px-4 mt-4 sm:mt-6 lg:mt-10 relative z-10"
        aria-label="Property Search"
      >
        <div className="golden-frame glow modal-surface p-4">
          <h2 className="text-xl font-semibold mb-4">
            Let's Start Your Search for Luxury Livings
          </h2>
          <div className="golden-divider my-4" />
          <form action="/projects" method="get" className="grid gap-3 sm:grid-cols-5 items-center">
            <input
              name="q"
              placeholder="Search projects, locations, developers…"
              aria-label="Search properties"
              className="sm:col-span-2 rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
            />
            <select
              name="city"
              aria-label="Select City"
              defaultValue=""
              className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
            >
              <option value="" className="bg-[#0B0B0C] text-altina-ivory">City</option>
              {cityOptions.map((c: string) => (
                <option key={c} value={c} className="bg-[#0B0B0C] text-altina-ivory">
                  {c}
                </option>
              ))}
            </select>
            <select
              name="type"
              aria-label="Select Property Type"
              defaultValue=""
              className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
            >
              <option value="" className="bg-[#0B0B0C] text-altina-ivory">Property Type</option>
              <option value="Residential" className="bg-[#0B0B0C] text-altina-ivory">Residential</option>
              <option value="Commercial" className="bg-[#0B0B0C] text-altina-ivory">Commercial</option>
            </select>
            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <FeaturedProjects items={featuredProjects} />
      <FeaturedDevelopers items={(developers as any[])} />
      <ServicesWeOffer />
      <ValueProposition />
      <MiniCTA />
      <TestimonialsSection />
      <LocationsSection />

      {/* Enhanced FAQ Schema with more questions */}
      <Script
        id="home-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What makes ALTINA™ Livings different?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "ALTINA™ Livings is a premium channel partner for luxury real estate in Delhi NCR. We curate handpicked projects from top developers like DLF, SOBHA, M3M, and Godrej, offering exclusive inventory access, best prices, and end-to-end support from discovery to possession.",
                },
              },
              {
                "@type": "Question",
                name: "Which areas does ALTINA™ Livings operate in?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "We specialize in premium properties across Delhi NCR including Gurgaon (Golf Course Road, Dwarka Expressway, Sohna Road), Noida (Noida Expressway, Sector 150), Greater Noida West, New Delhi, and Faridabad. We cover all major micro-markets with luxury developments.",
                },
              },
              {
                "@type": "Question",
                name: "Do you charge buyers any fees?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "No, ALTINA™ Livings does not charge any fees to buyers. Our channel partner commission comes from developers. You get the same or better prices than booking directly, plus expert advisory and concierge services at no extra cost.",
                },
              },
              {
                "@type": "Question",
                name: "Can NRIs invest through ALTINA™ Livings?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes, we provide complete NRI advisory services including Power of Attorney (POA) assistance, FEMA compliance, remote booking support, property management, and repatriation guidance. Over 30% of our clients are NRIs.",
                },
              },
              {
                "@type": "Question",
                name: "How do I book a property through ALTINA™?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Simply contact us via WhatsApp (+91-98912-34195) or our website. We'll understand your requirements, arrange site visits, provide detailed comparisons, assist with documentation, and handle the entire booking process with the developer on your behalf.",
                },
              },
            ],
          }),
        }}
      />

      {/* Enhanced BreadcrumbList Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.altinalivings.com"
              }
            ]
          }),
        }}
      />

      {/* WebSite Schema for Sitelinks Search Box */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://www.altinalivings.com",
            "name": "ALTINA™ Livings",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.altinalivings.com/projects?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          }),
        }}
      />

      <FloatingCTAs projectId={null} projectName={null} />
    </main>
  );
}
