import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact ALTINA™ Livings | Enquire Today",
  description:
    "Reach out to ALTINA™ Livings for property consultations, site visits, and brochure requests. Serving Delhi NCR with trusted developer partnerships.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact ALTINA™ Livings | Property Advisory Delhi NCR",
    description:
      "Speak to our property experts. Site visits, brochures, and personalised advisory for luxury real estate in Gurgaon, Noida & Delhi. Zero buyer fees.",
    images: ["/og.jpg"],
  },
};

export default function ContactPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[36vh] min-h-[280px] overflow-hidden">
        <Image
          src="/hero/contact.jpg"
          alt="Contact Altina Livings — Property Advisory Delhi NCR"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-8">
          <div className="golden-frame modal-surface rounded-2xl p-5">
            <h1 className="text-3xl font-semibold">Contact Us</h1>
            <p className="mt-2 text-neutral-300">We&apos;ll get back to you within 5 minutes.</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-6xl px-4 py-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 modal-surface golden-frame p-6">
          <h2 className="text-xl font-semibold">Send a message</h2>
          <div className="golden-divider my-3" />

          <ContactForm source="contact-page" />

          {/* Consent checkbox */}
          <div className="mt-4 flex items-start gap-2 text-sm text-neutral-400">
            <input
              type="checkbox"
              id="consent"
              defaultChecked
              className="mt-1 h-4 w-4 accent-altina-gold"
            />
            <label htmlFor="consent" className="leading-tight">
              I authorize company representatives to Call, SMS, Email or WhatsApp me
              about its products and offers. This consent overrides any registration
              for DNC/NDNC.
            </label>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="modal-surface golden-frame p-6">
          <h2 className="text-lg font-semibold">Reach us</h2>
          <div className="golden-divider my-3" />
          <ul className="space-y-4 text-neutral-300 text-sm">
            <li>
              <strong>Head Office — 342, Third Floor, Orbit Plaza,</strong>
              <br />
              <a
                href="https://maps.app.goo.gl/79QDhX59oD3HJD428"
                target="_blank"
                rel="noopener noreferrer"
                className="text-altina-gold hover:underline"
              >
                Crossing Republik, Ghaziabad, UP – 201016
              </a>
            </li>
            <li>
              <strong>Suite C, 704, 7th Floor, Palm Court,</strong>
              <br />
              <a
                href="https://maps.google.com/?q=Suite+C,+704,+Palm+Court,+MG+Road,+Sector+16,+Gurugram,+Haryana+122007"
                target="_blank"
                rel="noopener noreferrer"
                className="text-altina-gold hover:underline"
              >
                Mehrauli–Gurgaon Road, Sector 16, Gurugram, Haryana – 122007
              </a>
            </li>
            <li>
              <strong>26 &amp; 27 A, H-Block, Office No. 401 &amp; 404,</strong>
              <br />
              <a
                href="https://maps.google.com/?q=26+%26+27+A,+H-Block,+Office+No.+401+%26+404,+Vikas+Marg,+Laxmi+Nagar,+Delhi+110092"
                target="_blank"
                rel="noopener noreferrer"
                className="text-altina-gold hover:underline"
              >
                Vikas Marg, Laxmi Nagar, Delhi – 110092
              </a>
            </li>
            <li>
              <strong>Registered Office — Apartment No. 301, 12th Floor,</strong>
              <br />
              <a
                href="https://maps.google.com/?q=301,+Sam+Residency,+Crossing+Republik,+Ghaziabad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-altina-gold hover:underline"
              >
                GH Plot No. 6, Sam Residency, Crossing Republik, Ghaziabad – 201016
              </a>
            </li>
            <li>
              <a href="tel:+919891234195" className="text-altina-gold hover:underline">
                📞 +91 98912 34195
              </a>
            </li>
            <li>
              <a href="mailto:hello@altinalivings.com" className="text-altina-gold hover:underline">
                📧 hello@altinalivings.com
              </a>
            </li>
          </ul>

          <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.950297272844!2d77.43520339999999!3d28.631251700000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6f127b4f689db23%3A0x9b812459f30b5043!2sAltina%20Livings!5e0!3m2!1sen!2sin!4v1772573748307!5m2!1sen!2sin"
              title="ALTINA™ Livings — Orbit Plaza, Crossing Republik, Ghaziabad"
              className="h-52 w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Map showing ALTINA™ Livings office at Orbit Plaza, Crossing Republik, Ghaziabad"
            />
          </div>
        </aside>
      </section>

      {/* Breadcrumb Schema */}
      <Script
        id="contact-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.altinalivings.com" },
              { "@type": "ListItem", position: 2, name: "Contact", item: "https://www.altinalivings.com/contact" },
            ],
          }),
        }}
      />

      {/* ContactPage Schema */}
      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact ALTINA™ Livings",
            url: "https://www.altinalivings.com/contact",
            description:
              "Reach out to ALTINA™ Livings for property consultations, site visits, and brochure requests across Delhi NCR.",
            mainEntity: {
              "@type": "Organization",
              name: "ALTINA™ Livings",
              telephone: "+91-9891234195",
              email: "hello@altinalivings.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "342, Third Floor, Orbit Plaza, Crossing Republik",
                addressLocality: "Ghaziabad",
                addressRegion: "Uttar Pradesh",
                postalCode: "201016",
                addressCountry: "IN",
              },
            },
          }),
        }}
      />
    </main>
  );
}
