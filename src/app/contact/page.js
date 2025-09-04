import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us – Altina Livings",
  description:
    "Get in touch with Altina Livings for enquiries on premium real estate projects in Gurgaon. Partnered with DLF, M3M, Sobha, and Godrej.",
};

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Get in Touch"
        subtitle="We’d love to hear from you. Our team will get back to you soon."
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&h=600"
      />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-10 text-center">
          Have questions about a project? Fill out the form below and our team
          at <b>Altina Livings</b> will reach out to you shortly.
        </p>
        <ContactForm project="Contact Page" />
      </div>
    </>
  );
}
