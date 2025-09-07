import PageHero from "@/components/PageHero";
import SeoJsonLd from "@/components/SeoJsonLd";

export const metadata = {
  title: "Contact | ALTINA™ Livings",
  description:
    "Get in touch with ALTINA™ Livings for enquiries and collaborations.",
};

export default function ContactPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact ALTINA™ Livings",
    url: "https://www.altina.example/contact",
  };

  return (
    <>
      <SeoJsonLd schema={schema} />
      <PageHero
        title="Contact Us"
        subtitle="Reach out for enquiries, partnerships, or to schedule a site visit."
        image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2400&auto=format&fit=crop"
      />
      <div className="altina-container py-16">
        <form className="card-premium p-6 max-w-xl mx-auto">
          <div className="grid gap-4">
            <input type="text" name="name" placeholder="Name" className="input" />
            <input type="tel" name="phone" placeholder="Phone" className="input" />
            <input type="email" name="email" placeholder="Email (optional)" className="input" />
            <textarea name="message" rows={4} placeholder="Message" className="input" />
          </div>
          <button type="submit" className="btn-gold mt-4 w-full">Submit</button>
        </form>
      </div>
    </>
  );
}
