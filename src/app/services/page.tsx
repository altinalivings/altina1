// src/app/services/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import PageHero from "@/components/PageHero";
import ServicesWeOffer from "@/components/ServicesWeOffer";
import ValueProposition from "@/components/ValueProposition";
import FloatingCTAs from "@/components/FloatingCTAs";

export const metadata: Metadata = {
  title: "Services | ALTINA™ Livings — Real Estate Channel Partner in Delhi NCR",
  description:
    "ALTINA™ Livings offers residential & commercial advisory, brochure access, site visits, negotiations, NRI support and home loans across Delhi NCR.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Real Estate Services | ALTINA™ Livings Delhi NCR",
    description:
      "Residential advisory, NRI support, home loans & site visits across Delhi NCR. Zero buyer fees. Expert channel partner for DLF, Sobha, M3M, Godrej.",
    images: ["/og.jpg"],
  },
};

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        title="Our Services"
        subtitle="Trusted, RERA-aware advisory for premium real estate across Delhi NCR."
        image="/hero/services.jpg"
        height="h-[44vh]"
      />

      <section className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Overview */}
        <div id="overview">
          <h2 className="text-2xl font-semibold gold-text">What we do</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              As a real estate <strong>channel partner</strong>, ALTINA™ Livings works alongside leading
              developers (DLF, Sobha, Godrej, M3M and more) to simplify buying decisions—sharing verified
              brochures, shortlisting units, arranging <a href="/about#promise" className="underline">transparent advice</a>,
              and managing <a href="/services#process" className="underline">end-to-end execution</a>.
            </p>
          </div>
        </div>

        {/* Residential */}
        <div id="residential">
          <h2 className="text-2xl font-semibold gold-text">Residential Advisory</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li>Apartments, villas/floors and plots in Gurgaon, Noida and Delhi.</li>
              <li>Curated shortlists with configuration, views, stack & pricing guidance.</li>
              <li>Brochure sharing and unit comparisons for clear decision-making.</li>
              <li>Site visits with developer teams; priority inventory where available.</li>
            </ul>
          </div>
        </div>

        {/* Commercial */}
        <div id="commercial">
          <h2 className="text-2xl font-semibold gold-text">Commercial Advisory</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li>Grade-A offices, retail/SCO and investment-led opportunities.</li>
              <li>Yield modeling, rental outlook and exit considerations.</li>
              <li>Developer due-diligence and paperwork coordination.</li>
            </ul>
          </div>
        </div>

        {/* NRI */}
        <div id="nri">
          <h2 className="text-2xl font-semibold gold-text">NRI Advisory</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li>Remote bookings with video walkthroughs and document support.</li>
              <li>POA, taxation and repatriation guidance via partner professionals.</li>
              <li>Time-zone friendly updates and single point of coordination.</li>
            </ul>
          </div>
        </div>

        {/* Loans */}
        <div id="loans">
          <h2 className="text-2xl font-semibold gold-text">Home Loans</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li>Indicative eligibility and EMI estimates across leading banks.</li>
              <li>Preferential rates wherever developer tie-ups apply.</li>
              <li>Document checklist and swift sanction coordination.</li>
            </ul>
          </div>
        </div>

        {/* Process */}
        <div id="process">
          <h2 className="text-2xl font-semibold gold-text">How we work</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ol className="list-decimal list-inside text-neutral-300 space-y-2">
              <li>Discovery call → understand need, budget, timeline and location.</li>
              <li>Curated shortlist → verified brochures, comparisons, live availability.</li>
              <li>Site visits → coordinated with developers; on-ground clarifications.</li>
              <li>Negotiation → best price, allotment preference and booking support.</li>
              <li>Paperwork → application, KYC, payment schedule and loan assistance.</li>
              <li>Post-booking → builder updates till possession; resale/rental if needed.</li>
            </ol>
          </div>
        </div>

        {/* Quick links */}
        <div id="next-steps">
          <h2 className="text-2xl font-semibold gold-text">Next steps</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              Ready to explore projects? Start with our listings and book a visit:
              {" "}
              <a href="/projects" className="underline">Browse Projects</a>
              {" • "}
              <a href="/contact" className="underline">Contact ALTINA™</a>
            </p>
          </div>
        </div>
      </section>

      {/* Reuse the same home components for visual parity */}
      <ServicesWeOffer size="compact" />
      <ValueProposition size="compact" />
      <FloatingCTAs projectId={null} projectName={null} />

      {/* Breadcrumb Schema */}
      <Script
        id="services-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.altinalivings.com" },
              { "@type": "ListItem", position: 2, name: "Services", item: "https://www.altinalivings.com/services" },
            ],
          }),
        }}
      />

      {/* Service schema */}
      <Script
        id="services-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Real Estate Advisory Services",
            provider: {
              "@type": "Organization",
              name: "ALTINA™ Livings",
              url: "https://www.altinalivings.com",
            },
            areaServed: ["Delhi NCR", "Gurgaon", "Noida", "Delhi"],
            serviceType: "Real Estate Channel Partner",
            description:
              "Residential & commercial advisory, NRI support, home loans, site visits and end-to-end property buying assistance across Delhi NCR.",
            url: "https://www.altinalivings.com/services",
          }),
        }}
      />
    </main>
  );
}
