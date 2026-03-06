// src/app/trust/page.tsx
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Why Trust ALTINA™ | Real Estate Channel Partner in Delhi NCR",
  description:
    "ALTINA™ is a trusted channel partner for luxury real estate in Delhi NCR. Backed by DLF, Sobha, Godrej, and M3M, we ensure RERA-compliant, transparent property advisory.",
  alternates: { canonical: "/trust" },
};

export default function TrustPage() {
  return (
    <main>
      <PageHero
        title="Why Trust ALTINA™"
        subtitle="Transparency • RERA Compliance • Top Developer Partnerships"
        image="/hero/trust.jpg"
        height="h-[40vh]"
      />

      <section className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Credibility */}
        <div id="credibility">
          <h1 className="text-3xl font-semibold">Our Credibility</h1>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              ALTINA™ is more than a name — it is a promise of <strong>credibility and trust</strong>. 
              Every interaction is backed by integrity, transparency, and compliance with 
              <strong> RERA regulations</strong> across Delhi NCR.
            </p>
            <p className="text-neutral-300 mt-3">
              With ALTINA™, buyers enjoy confidence in every step — from brochure requests to 
              final possession.
            </p>
          </div>
        </div>

        {/* Developer partnerships */}
        <div id="developers">
          <h2 className="text-2xl font-semibold">Partnerships with Leading Developers</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              Our relationships with top developers — <strong>DLF, Sobha, Godrej, and M3M</strong> —
              give our clients <em>priority access to premium launches</em>, pre-booking windows, 
              and exclusive offers not easily available in the open market.
            </p>
          </div>
        </div>

        {/* RERA Compliance */}
        <div id="rera">
          <h2 className="text-2xl font-semibold">100% RERA Compliance</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              Every transaction handled by ALTINA™ is <strong>RERA-registered</strong>, 
              ensuring full legal compliance and protecting our clients’ investments.
            </p>
            <p className="text-neutral-300 mt-3">
              We guide clients with <em>RERA verification</em> before booking, so that trust 
              is never compromised.
            </p>
          </div>
        </div>

        {/* Client-first approach */}
        <div id="client-first">
          <h2 className="text-2xl font-semibold">Client-First Advisory</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li><strong>Transparency</strong> — clear pricing, no hidden charges.</li>
              <li><strong>Priority Access</strong> — to top projects and exclusive launches.</li>
              <li><strong>Concierge Service</strong> — from enquiry, brochures, and site visits to possession.</li>
              <li><strong>Post-Sales Support</strong> — assistance even after purchase.</li>
            </ul>
          </div>
        </div>

        {/* Closing Statement */}
        <div id="closing">
          <h2 className="text-2xl font-semibold">Our Promise of Trust</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              At ALTINA™, we don’t just help you buy property — 
              we help you make <strong>informed, secure, and confident decisions</strong>. 
              Trust is not an add-on, it is the foundation of everything we do.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
