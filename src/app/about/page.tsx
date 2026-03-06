// src/app/about/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import PageHero from "@/components/PageHero";
import ServicesWeOffer from "@/components/ServicesWeOffer";
import ValueProposition from "@/components/ValueProposition";
import FloatingCTAs from "@/components/FloatingCTAs";

export const metadata: Metadata = {
  title: "About ALTINA™ Livings | Trusted Real Estate Channel Partner in Delhi NCR",
  description:
    "ALTINA™ Livings is a premium real estate channel partner in Delhi NCR. Backed by DLF, Sobha, Godrej, and M3M, we provide transparent, RERA-aware property advisory services.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ALTINA™ Livings | Real Estate Channel Partner Delhi NCR",
    description:
      "Meet ALTINA™ Livings — your RERA-aware luxury real estate partner in Delhi NCR. Expert advisory from DLF, Sobha, M3M, Godrej projects.",
    images: ["/og.jpg"],
  },
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        title="About ALTINA™ Livings"
        subtitle="Premium channel partner for luxury real estate across Delhi NCR."
        image="/hero/about.jpg"
        height="h-[50vh]"
      />

      <section className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* About Section */}
        <div id="about">
          <h2 className="text-2xl font-semibold gold-text">Who We Are</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300 mt-3">
              ALTINA™ Livings is a trusted <strong>real estate channel partner in Delhi NCR</strong>,
              specializing in premium residential and commercial properties. As a RERA-aware advisory,
              we bridge the gap between leading developers and discerning buyers, offering transparency,
              credibility, and a seamless property discovery experience.
            </p>
            <p className="text-neutral-300 mt-3">
              Backed by strong relationships with top developers like <strong>DLF, Sobha, Godrej, and M3M</strong>,
              we provide clients with priority access to inventory, early-bird offers, and trusted guidance
              at every step of their investment journey.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div id="why-choose-us">
          <h2 className="text-2xl font-semibold gold-text">Why Choose Us</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li><strong>RERA-Compliant Partner</strong> — transparent and legally safe transactions.</li>
              <li><strong>Developer Partnerships</strong> — access to DLF, Sobha, Godrej, M3M and more.</li>
              <li><strong>End-to-End Service</strong> — brochures, shortlists, site visits, negotiations, possession.</li>
              <li><strong>Client-First Approach</strong> — personalized advisory and after-sales support.</li>
            </ul>
          </div>
        </div>

        {/* Our Vision */}
        <div id="vision">
          <h2 className="text-2xl font-semibold gold-text">Our Vision</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              To simplify luxury real estate decisions with clarity, trust and world-class service —
              helping families and investors find properties that truly match their aspirations.
            </p>
          </div>
        </div>

        {/* Our Promise */}
        <div id="promise">
          <h2 className="text-2xl font-semibold gold-text">Our Promise</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li><strong>Transparency</strong> — no hidden charges or misinformation.</li>
              <li><strong>Credibility</strong> — verified listings, authentic brochures, trusted developers.</li>
              <li><strong>Service Excellence</strong> — dedicated relationship managers for every client.</li>
            </ul>
          </div>
        </div>
      </section>

      <ServicesWeOffer size="compact" />
      <ValueProposition size="compact" />
      <FloatingCTAs projectId={null} projectName={null} />

      {/* Breadcrumb Schema */}
      <Script
        id="about-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.altinalivings.com" },
              { "@type": "ListItem", position: 2, name: "About", item: "https://www.altinalivings.com/about" },
            ],
          }),
        }}
      />

      {/* AboutPage Schema */}
      <Script
        id="about-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About ALTINA™ Livings",
            description:
              "ALTINA™ Livings is a premium real estate channel partner in Delhi NCR, backed by DLF, Sobha, Godrej, and M3M.",
            url: "https://www.altinalivings.com/about",
            publisher: {
              "@type": "Organization",
              name: "ALTINA™ Livings",
              url: "https://www.altinalivings.com",
              logo: "https://www.altinalivings.com/logos/Altina.png",
            },
          }),
        }}
      />
    </main>
  );
}
