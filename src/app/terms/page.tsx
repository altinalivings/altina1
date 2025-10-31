// src/app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | ALTINA™ Livings",
  description:
    "Read the terms and conditions for using ALTINA™ Livings. Information accuracy, pricing, RERA compliance, consent for communications, and other legal notices.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[36vh] min-h-[280px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/about.jpg"
          alt="Terms & Conditions"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-8">
          <div className="golden-frame modal-surface rounded-2xl p-5">
            <h1 className="text-3xl font-semibold">Terms &amp; Conditions</h1>
            <p className="mt-2 text-neutral-300">
              Please review these terms carefully before using our website or services.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 grid gap-10">
        {/* Intro */}
        <section>
          <h2 className="text-xl font-semibold">Introduction</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <p className="text-neutral-300">
              These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of the
              website operated by ALTINA<span className="align-super text-xs">™</span> Livings
              (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By using this site or engaging with our services,
              you agree to these Terms.
            </p>
          </div>
        </section>

        {/* Who we are */}
        <section>
          <h2 className="text-xl font-semibold">Who We Are (Channel Partner)</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <p className="text-neutral-300">
              We operate as a real estate <strong>channel partner</strong> for leading developers in
              Delhi NCR. We facilitate discovery, brochure requests, site visits, and introductions
              to developers or their authorized sales teams. We do not claim ownership of developer
              projects, nor do we provide financial or legal advice.
            </p>
          </div>
        </section>

        {/* Information accuracy */}
        <section>
          <h2 className="text-xl font-semibold">Information &amp; Accuracy</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li>
                Project details (price, inventory, specifications, amenities, possession dates, RERA
                numbers, etc.) are provided on a best-effort basis and may change without notice.
              </li>
              <li>
                Users must independently verify all critical information with the developer and
                applicable authorities before making a decision.
              </li>
              <li>
                Nothing on this site constitutes a binding offer; it is an invitation to explore.
              </li>
            </ul>
          </div>
        </section>

        {/* RERA */}
        <section>
          <h2 className="text-xl font-semibold">Regulatory / RERA</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <p className="text-neutral-300">
              We support <strong>RERA-aware processes</strong>. Users should verify the relevant
              project&apos;s RERA registration, sanctioned plans, and approvals directly with the
              developer or via official RERA portals.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section>
          <h2 className="text-xl font-semibold">Pricing &amp; Offers</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <p className="text-neutral-300">
              Any pricing, payment plans, or promotional offers displayed are subject to change and
              availability as communicated by the developer. Taxes, statutory charges, and additional
              costs may apply.
            </p>
          </div>
        </section>

        {/* Contact/Lead consent */}
        <section>
          <h2 className="text-xl font-semibold">Consent for Communications</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <p className="text-neutral-300">
              By submitting your details on our forms, you authorize our representatives to contact
              you via <strong>Call, SMS, Email, or WhatsApp</strong> regarding products and offers.
              This consent overrides any registration for DNC/NDNC. You can withdraw consent by
              contacting us using the details below.
            </p>
          </div>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-xl font-semibold">Intellectual Property</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <p className="text-neutral-300">
              The content on this website (text, graphics, UI, and assets) is protected by applicable
              IP laws. ALTINA<span className="align-super text-xs">™</span> is used as a trademark. Logos and names of developers
              are property of their respective owners and used for identification only.
            </p>
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="text-xl font-semibold">Privacy</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <p className="text-neutral-300">
              Your data is handled as described in our{" "}
              <a href="/privacy" className="text-amber-300 underline">
                Privacy Policy
              </a>
              . We may use analytics and advertising pixels to measure performance and conversions.
            </p>
          </div>
        </section>

        {/* Liability */}
        <section>
          <h2 className="text-xl font-semibold">Limitation of Liability</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <p className="text-neutral-300">
              We will not be liable for indirect, incidental, or consequential damages arising from
              use of the website or reliance on information herein. Your sole remedy for dissatisfaction
              is to discontinue use of the site.
            </p>
          </div>
        </section>

        {/* Governing law */}
        <section>
          <h2 className="text-xl font-semibold">Governing Law &amp; Disputes</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <p className="text-neutral-300">
              These Terms are governed by the laws of India. Any disputes shall be subject to the
              exclusive jurisdiction of competent courts in Delhi NCR.
            </p>
          </div>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-xl font-semibold">Changes to Terms</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <p className="text-neutral-300">
              We may update these Terms from time to time. Continued use of the site after changes
              constitutes acceptance of the revised Terms.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <div className="golden-divider my-3" />
          <div className="modal-surface golden-frame p-6">
            <ul className="text-neutral-300 space-y-1">
              <li>ALTINA™ Livings, Delhi NCR</li>
              <li>+91 98912 34195</li>
              <li>hello@altina.example</li>
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}