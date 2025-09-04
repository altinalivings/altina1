import Hero from "@/components/Hero";

export const metadata = {
  title: "Terms & Conditions – Altina Livings",
  description: "Read the terms & conditions for using Altina Livings services and website.",
};

export default function TermsPage() {
  return (
    <main>
      <Hero
        title="Terms & Conditions"
        subtitle="Please review our service terms before engaging with us"
        image="https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1600&h=600"
      />

      <section className="py-16 container mx-auto px-6 text-gray-600">
        <p>
          By using Altina Livings’ services or website, you agree to these terms
          and conditions. Please read carefully before proceeding with any
          transactions.
        </p>
      </section>
    </main>
  );
}
