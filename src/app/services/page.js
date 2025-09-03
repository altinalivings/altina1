import Hero from "@/components/Hero";

export const metadata = {
  title: "Our Services – Altina Livings",
  description:
    "Discover the premium services offered by Altina Livings – real estate consulting, project promotions & exclusive deals.",
};

export default function ServicesPage() {
  return (
    <main>
      <Hero
        title="Our Services"
        subtitle="Delivering premium consulting & partnerships for luxury real estate"
        image="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&h=600"
      />

      <section className="container mx-auto px-6 py-16 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Consulting</h3>
            <p className="text-gray-600">
              Expert advice for residential & commercial investments.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Exclusive Offers</h3>
            <p className="text-gray-600">
              Access to deals from India’s top developers.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">End-to-End Support</h3>
            <p className="text-gray-600">
              Assistance from booking to possession with full transparency.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
