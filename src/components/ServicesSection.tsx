// src/components/ServicesSection.tsx
const services = [
  { t: "Primary Sales", s: "End-to-end assistance from discovery to booking for new launches." },
  { t: "Channel Partner Deals", s: "Exclusive allocations with top developers across Delhi NCR." },
  { t: "Home Loan & Documentation", s: "Advisory and assistance through trusted banking partners." },
  { t: "Site Visits", s: "Curated, chauffeured visits with project specialists." },
  { t: "Negotiation Support", s: "We help you secure the best possible terms." },
  { t: "After-Sales Support", s: "Seamless handover, possession and snag resolution." },
];
export default function ServicesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold">Services We Offer</h2>
      <div className="golden-divider my-4" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((c) => (
          <div key={c.t} className="golden-frame p-6">
            <h3 className="font-semibold">{c.t}</h3>
            <p className="text-neutral-300 mt-1">{c.s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
