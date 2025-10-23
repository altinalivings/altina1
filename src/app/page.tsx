import type { Metadata } from "next";
import Script from "next/script";

import projects from "@/data/projects.json";
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
  title: "Luxury Apartments & Builder Floors in Delhi NCR | ALTINA™ Livings",
  description:
    "Explore luxury flats, independent floors, and commercial projects by DLF, Sobha & Godrej across Delhi NCR. ALTINA™ Livings — Your Gateway to Luxury Living.",
  alternates: { canonical: "https://www.altinalivings.com" },
  openGraph: {
    title: "Luxury Properties Delhi NCR | ALTINA™ Livings",
    description:
      "Discover premium residential & commercial projects in Delhi NCR with ALTINA™ Livings, trusted channel partner for marquee developers.",
    images: ["/og-default.jpg"],
    url: "https://www.altinalivings.com",
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
      <PageHero
        title="ALTINA™ Livings"
        subtitle="Curated launches across Delhi NCR. Luxury channel partner for leading developers."
        image="/hero/home.jpg"
        height="h-[64vh]"
      />

      {/* Search Bar */}
      <section className="max-w-6xl mx-auto px-4 mt-4 sm:mt-6 lg:mt-10 relative z-10">
        <div className="golden-frame glow modal-surface p-4">
          <h2 className="text-xl font-semibold mb-4">
            Let's Start Your Search for Luxury Livings
          </h2>
          <div className="golden-divider my-4" />
          <form action="/projects" method="get" className="grid gap-3 sm:grid-cols-5 items-center">
            <input
              name="q"
              placeholder="Search projects, locations, developers…"
              aria-label="Search"
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
      {/* <FeaturedDevelopers items={(developers as any[])} /> */}
      <ServicesWeOffer />
      <ValueProposition />
      <MiniCTA />
      <TestimonialsSection />
      <LocationsSection />

      {/* Optional: Homepage FAQ rich result */}
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
                    "ALTINA™ Livings curates luxury residential and commercial projects across Delhi NCR, partnering with marquee developers like DLF, Sobha, and Godrej.",
                },
              },
              {
                "@type": "Question",
                name: "Which areas does ALTINA™ Livings operate in?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "We specialize in premium properties in Delhi, Gurugram, and Noida — including DLF Midtown, Independent Floors, and SCO plots.",
                },
              },
            ],
          }),
        }}
      />

      <FloatingCTAs projectId={null} projectName={null} />
    </main>
  );
}
