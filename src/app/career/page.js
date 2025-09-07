import PageHero from "@/components/PageHero";
import SeoJsonLd from "@/components/SeoJsonLd";

export const metadata = {
  title: "Careers | ALTINA™ Livings",
  description:
    "Join ALTINA™ Livings and be part of our growing real estate advisory team.",
};

export default function CareerPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ALTINA™ Livings",
    url: "https://www.altina.example/career",
  };

  return (
    <>
      <SeoJsonLd schema={schema} />
      <PageHero
        title="Careers"
        subtitle="Work with a premium channel partner delivering exceptional client outcomes."
        image="https://images.unsplash.com/photo-1499914485622-a88fac536970?q=80&w=2400&auto=format&fit=crop"
      />
      <div className="altina-container py-16">
        <p className="text-gray-700">
          We’re always looking for passionate real estate professionals and
          relationship managers. Send your CV to{" "}
          <a href="mailto:careers@altina.com" className="text-brand-gold">
            careers@altina.com
          </a>
          .
        </p>
      </div>
    </>
  );
}
