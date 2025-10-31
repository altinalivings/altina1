// src/app/about/page.tsx
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServicesWeOffer from "@/components/ServicesWeOffer";
import ValueProposition from "@/components/ValueProposition";
import FloatingCTAs from "@/components/FloatingCTAs";

export const metadata: Metadata = {
  title: "About ALTINA™ Livings | Trusted Real Estate Channel Partner in Delhi NCR",
  description:
    "ALTINA™ Livings is a premium real estate channel partner in Delhi NCR. Backed by DLF, Sobha, Godrej, and M3M, we provide transparent, RERA-aware property advisory services.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        title="About ALTINA™"
        subtitle="Premium channel partner for luxury real estate across Delhi NCR."
        image="/hero/about.jpg"
        height="h-[50vh]"
      />

      <section className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* About Section */}
        <div id="about">
          <h1 className="text-3xl font-semibold">About ALTINA™ Livings</h1>
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
          <h2 className="text-2xl font-semibold">Why Choose Us</h2>
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
          <h2 className="text-2xl font-semibold">Our Vision</h2>
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
          <h2 className="text-2xl font-semibold">Our Promise</h2>
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
    </main>
  );
}
