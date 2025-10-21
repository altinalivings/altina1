import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact ALTINA™ Livings | Enquire Today",
  description:
    "Reach out to ALTINA™ Livings for property consultations, site visits, and brochure requests. Serving Delhi NCR with trusted developer partnerships.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[36vh] min-h-[280px] overflow-hidden">
        <img
          src="/hero/contact.jpg"
          alt="Contact Altina Livings"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-8">
          <div className="golden-frame modal-surface rounded-2xl p-5">
            <h1 className="text-3xl font-semibold">Contact Us</h1>
            <p className="mt-2 text-neutral-300">We’ll get back to you shortly.</p>
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
              className="mt-1 h-4 w-4 accent-[var(--altina-gold)]"
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
          <h3 className="text-lg font-semibold">Reach us</h3>
          <div className="golden-divider my-3" />
          <ul className="space-y-4 text-neutral-300 text-sm">
            <li>
              <strong>Suite C, 704, 7th Floor, Palm Court,</strong>
              <br />
              <a
                href="https://maps.google.com/?q=Suite+C,+704,+Palm+Court,+MG+Road,+Sector+16,+Gurugram,+Haryana+122007"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--altina-gold)] hover:underline"
              >
                Mehrauli–Gurgaon Road, Sector 16, Gurugram, Haryana – 122007
              </a>
            </li>
            <li>
              <strong>26 & 27 A, H-Block, Office No. 401 & 404,</strong>
              <br />
              <a
                href="https://maps.google.com/?q=26+%26+27+A,+H-Block,+Office+No.+401+%26+404,+Vikas+Marg,+Laxmi+Nagar,+Delhi+110092"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--altina-gold)] hover:underline"
              >
                Vikas Marg, Laxmi Nagar, Delhi – 110092
              </a>
            </li>
            <li>
              <strong>Head Office:</strong>{" "}
              <a
                href="https://maps.google.com/?q=301,+Sam+Residency,+Crossing+Republik,+Ghaziabad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--altina-gold)] hover:underline"
              >
                301, Sam Residency, Crossing Republik, Ghaziabad
              </a>
            </li>
            <li>📞 +91 98912 34195</li>
            <li>📧 hello@altinalivings.com</li>
          </ul>

          <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
            <iframe
              src="https://maps.google.com/maps?q=gurugram&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="h-52 w-full"
              loading="lazy"
            />
          </div>
        </aside>
      </section>
    </main>
  );
}