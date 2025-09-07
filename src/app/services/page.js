import PageHero from "@/components/PageHero";
import SeoJsonLd from "@/components/SeoJsonLd";

export const metadata = {
  title: "Services | ALTINA™ Livings",
  description: "End-to-end property consulting and investment services.",
};

export default function ServicesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Real Estate Advisory",
    provider: {
      "@type": "LocalBusiness",
      name: "ALTINA™ Livings",
      areaServed: ["Gurugram", "Delhi NCR"],
    },
  };

  return (
    <>
      <SeoJsonLd schema={schema} />
      <PageHero
        title="Our Services"
        subtitle="From shortlisting to site visits, negotiations and paperwork — done right."
        image="https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2400&auto=format&fit=crop"
      />
      <div className="altina-container py-16 grid gap-6 md:grid-cols-2">
        <div className="card-premium p-6">
          <h3 className="font-semibold">Property Consulting</h3>
          <p className="mt-2 text-sm text-gray-700">
            Helping you choose the right investment or dream home.
          </p>
        </div>
        <div className="card-premium p-6">
          <h3 className="font-semibold">Priority Allotments</h3>
          <p className="mt-2 text-sm text-gray-700">
            Early-bird access to premium inventories.
          </p>
        </div>
        <div className="card-premium p-6">
          <h3 className="font-semibold">Site Visits & Negotiations</h3>
          <p className="mt-2 text-sm text-gray-700">
            Personalized tours and price support.
          </p>
        </div>
        <div className="card-premium p-6">
          <h3 className="font-semibold">NRI Desk</h3>
          <p className="mt-2 text-sm text-gray-700">
            End-to-end assistance for overseas investors.
          </p>
        </div>
      </div>
    </>
  );
}
