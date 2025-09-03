import Hero from "@/components/Hero";

export const metadata = {
  title: "Privacy Policy – Altina Livings",
  description: "Read the privacy policy of Altina Livings regarding data usage and user rights.",
};

export default function PrivacyPage() {
  return (
    <main>
      <Hero
        title="Privacy Policy"
        subtitle="How we collect, use & protect your data"
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&h=600"
      />

      <section className="py-16 container mx-auto px-6 text-gray-600">
        <p>
          At Altina Livings, we value your privacy. This policy outlines how we
          collect, use, and safeguard your data. By using our website, you agree
          to the terms outlined here.
        </p>
      </section>
    </main>
  );
}
