import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact | Altina Livings" };

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-6">Leave your details and we’ll get back to you.</p>
      <div className="max-w-lg">
        <ContactForm />
      </div>
    </div>
  );
}
