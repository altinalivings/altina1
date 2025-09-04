import Hero from "@/components/Hero";

export const metadata = {
  title: "About Us – Altina Livings",
  description:
    "Learn more about Altina Livings – Premium real estate channel partner with DLF, M3M, Sobha & Godrej. 15+ years of expertise, 3200+ happy clients.",
};

export default function AboutPage() {
  return (
    <main>
      <Hero
        title="About Altina Livings"
        subtitle="Your trusted partner in premium real estate"
        image="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&h=600"
      />

      <section className="py-16 container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Founded in 2009, Altina Livings is a premier channel partner for India’s
          top developers including DLF, M3M, Sobha & Godrej. We’ve served over
          <b> 3200+ homebuyers and investors </b> with trust, transparency, and
          excellence.
        </p>
      </section>
    </main>
  );
}
