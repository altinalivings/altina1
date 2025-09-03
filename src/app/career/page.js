import Hero from "@/components/Hero";

export const metadata = {
  title: "Careers – Altina Livings",
  description:
    "Join Altina Livings and grow your career in premium real estate consulting and partnerships.",
};

export default function CareerPage() {
  return (
    <main>
      <Hero
        title="Careers at Altina Livings"
        subtitle="Join our growing team of real estate experts"
        image="https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&w=1600&h=600"
      />

      <section className="py-16 container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold mb-6">Why Work With Us?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          At Altina Livings, we believe in building careers along with communities.
          We provide a collaborative environment, growth opportunities, and the
          chance to work on premium real estate projects.
        </p>
      </section>
    </main>
  );
}
