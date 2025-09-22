// src/app/privacy/page.tsx
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy | ALTINA™ Livings",
  description:
    "How ALTINA™ Livings collects, uses, and protects your information. Covers forms, analytics, cookies, marketing consent and your rights.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const updated = "19 Sept 2025"; // update when you change the policy

  return (
    <main>
      <PageHero
        title="Privacy Policy"
        subtitle="Your data, handled with transparency and care."
        image="/hero/privacy.jpg"
        height="h-[40vh]"
      />

      <section className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Intro */}
        <div id="intro">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              This Privacy Policy explains how <strong>ALTINA™ Livings</strong> (“we”, “us”, “our”) collects,
              uses, and protects your information when you browse our website, submit enquiry forms,
              request a callback/site visit, download brochures, or subscribe to updates.
            </p>
            <p className="text-neutral-300 mt-3">
              By using our website or submitting a form, you agree to this Policy. If you do not agree,
              please do not use our website or submit information.
            </p>
            <p className="text-neutral-400 text-sm mt-4">Last updated: {updated}</p>
          </div>
        </div>

        {/* What we collect */}
        <div id="data-we-collect">
          <h2 className="text-2xl font-semibold">1) Information we collect</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li>
                <strong>Contact details</strong> — name, phone, email (mandatory on forms), and any message you send.
              </li>
              <li>
                <strong>Lead context</strong> — project of interest, mode (callback, brochure, visit, contact, subscribe),
                preferred time/date for visits (if provided).
              </li>
              <li>
                <strong>Traffic & attribution</strong> — UTM parameters, referrer, session identifiers (e.g., GA client ID),
                device information, approximate location (city/country), collected via analytics (see Cookies below).
              </li>
            </ul>
          </div>
        </div>

        {/* How we use */}
        <div id="how-we-use">
          <h2 className="text-2xl font-semibold">2) How we use your information</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li>To respond to enquiries, arrange site visits, and share brochures or pricing.</li>
              <li>To connect you with projects by developers such as DLF, Sobha, Godrej, M3M.</li>
              <li>To improve our website and measure campaign performance (analytics).</li>
              <li>To send service or marketing communications where you have provided consent.</li>
            </ul>
            <p className="text-neutral-400 text-sm mt-3">
              Legal bases may include consent, performance of a contract, and legitimate interests (advisory & operations).
            </p>
          </div>
        </div>

        {/* Consent clause (matches your form checkbox) */}
        <div id="marketing-consent">
          <h2 className="text-2xl font-semibold">3) Marketing consent</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              By submitting our forms, you consent to receive communications about projects and offers via{" "}
              <strong>Call, SMS, Email or WhatsApp</strong>. This consent overrides any DNC/NDNC registration. You can
              opt out anytime by replying STOP/UNSUBSCRIBE or emailing{" "}
              <a className="underline" href="mailto:hello@altina.example">hello@altina.example</a>.
            </p>
          </div>
        </div>

        {/* Cookies / Analytics */}
        <div id="cookies">
          <h2 className="text-2xl font-semibold">4) Cookies & analytics</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              We use cookies and similar technologies for website functionality and measurement. We use{" "}
              <strong>Google Analytics 4</strong> and advertising pixels (Google Ads, Meta, LinkedIn) to understand site
              usage and measure conversions. You can control cookies in your browser settings. For Google, you may use
              Ads Settings and Analytics opt-out tools.
            </p>
          </div>
        </div>

        {/* Sharing */}
        <div id="sharing">
          <h2 className="text-2xl font-semibold">5) How we share information</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li>
                <strong>Developers / project partners</strong> — to arrange site visits, pricing, and allotments for
                the properties you ask about.
              </li>
              <li>
                <strong>Service providers</strong> — hosting, analytics, lead storage (e.g., Google Sheets via Apps Script),
                CRM or email tools, solely to operate our services.
              </li>
              <li>
                <strong>Legal & compliance</strong> — if required by applicable law or to protect our rights.
              </li>
            </ul>
            <p className="text-neutral-400 text-sm mt-3">
              We do not sell your personal data.
            </p>
          </div>
        </div>

        {/* Retention & Security */}
        <div id="retention-security">
          <h2 className="text-2xl font-semibold">6) Retention & security</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              We retain enquiry records for as long as necessary to serve you and meet legal obligations. We use
              reasonable technical and organizational measures to protect information; however, no method is 100% secure.
            </p>
          </div>
        </div>

        {/* Your rights */}
        <div id="your-rights">
          <h2 className="text-2xl font-semibold">7) Your choices & rights</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <ul className="list-disc list-inside text-neutral-300 space-y-2">
              <li>Access, correction, or deletion of your information.</li>
              <li>Withdraw consent for marketing at any time.</li>
              <li>Object to certain processing or request portability where applicable.</li>
            </ul>
            <p className="text-neutral-300 mt-3">
              To exercise your rights, email{" "}
              <a className="underline" href="mailto:hello@altina.example">hello@altina.example</a>.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div id="contact">
          <h2 className="text-2xl font-semibold">8) Contact us</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              For questions about this Policy or your data, contact:{" "}
              <a className="underline" href="mailto:hello@altina.example">hello@altina.example</a> • Delhi NCR, India.
            </p>
          </div>
        </div>

        {/* Updates */}
        <div id="updates">
          <h2 className="text-2xl font-semibold">9) Changes to this policy</h2>
          <div className="golden-divider my-3" />
          <div className="golden-frame modal-surface p-6">
            <p className="text-neutral-300">
              We may update this Policy occasionally. Material changes will be posted on this page with a new “Last
              updated” date.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
