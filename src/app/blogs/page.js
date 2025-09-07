import PageHero from "@/components/PageHero";
import SeoJsonLd from "@/components/SeoJsonLd";

export const metadata = {
  title: "Blogs | ALTINA™ Livings",
  description: "Insights and updates on luxury real estate and investments.",
};

export default function BlogsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "ALTINA™ Insights",
    url: "https://www.altina.example/blogs",
  };

  return (
    <>
      <SeoJsonLd schema={schema} />
      <PageHero
        title="Insights & Updates"
        subtitle="Market trends, new launches, and investment ideas — curated for you."
        image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2400&auto=format&fit=crop"
      />
      <div className="altina-container py-16">
        <p className="text-gray-700">
          Blogs coming soon. Meanwhile, reach out if you’d like a tailored
          market brief for your preferred micro-market.
        </p>
      </div>
    </>
  );
}
