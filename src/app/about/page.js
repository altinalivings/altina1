import PageHero from "@/components/PageHero";
import SeoJsonLd from "@/components/SeoJsonLd";

export const metadata = {
  title: "About Us | ALTINA™ Livings",
  description:
    "ALTINA™ Livings — Premium Channel Partner for DLF, M3M, Sobha & Godrej.",
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    name: "ALTINA™ Livings",
    url: "https://www.altina.example",
    logo: "https://www.altina.example/images/logos/Altina.png",
    brand: [
      { "@type": "Brand", name: "DLF" },
      { "@type": "Brand", name: "M3M" },
      { "@type": "Brand", name: "Sobha" },
      { "@type": "Brand", name: "Godrej" },
    ],
    areaServed: ["Gurugram", "Delhi NCR"],
  };

  return (
    <>
      <SeoJsonLd schema={schema} />
      <PageHero
        title="About ALTINA™ Livings"
        subtitle="Premium advisory. Priority allocations. Transparent process."
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2400&auto=format&fit=crop"
      />
      <div className="altina-container py-16">
        <p className="text-lg text-gray-700 leading-relaxed">
          ALTINA™ Livings is a trusted channel partner of India’s top developers
          — DLF, M3M, Sobha & Godrej. We specialize in luxury residences,
          commercial assets and investment-grade inventories, ensuring our
          clients get the best options at the right time.
        </p>
      </div>
    </>
  );
}
