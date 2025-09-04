import Hero from "@/components/Hero";

export const metadata = {
  title: "Blog – Altina Livings",
  description:
    "Read the latest insights, market trends, and updates from Altina Livings in Gurgaon real estate.",
};

export default function BlogPage() {
  return (
    <main>
      <Hero
        title="Our Blog"
        subtitle="Latest insights & real estate trends"
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&h=600"
      />

      <section className="py-16 container mx-auto px-6 text-center">
        <p className="text-gray-600">
          Blog posts will be updated here soon. Stay tuned for expert insights on
          Gurgaon real estate.
        </p>
      </section>
    </main>
  );
}
