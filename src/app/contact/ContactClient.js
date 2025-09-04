"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    project: "General Enquiry",
    utm_source: "",
    utm_campaign: "",
    utm_medium: "",
    utm_term: "",
    utm_content: "",
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        }
      );

      // Tracking
      if (typeof window !== "undefined") {
        if (window.gtag) {
          window.gtag("event", "generate_lead", {
            event_category: "Leads",
            event_label: "Contact Page",
          });
        }
        if (window.fbq) window.fbq("track", "Lead", { content_name: "Contact Page" });
        if (window.lintrk) window.lintrk("track", { conversion_id: 515682278 });
        if (window.gtag) {
          window.gtag("event", "conversion", {
            send_to: "AW-17510039084/L-MdCP63l44bEKz8t51B",
          });
        }
      }

      router.push("/thank-you");
    } catch (err) {
      console.error("Contact form error:", err);
      alert("Error submitting form.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="text-lg text-gray-600 mb-10 text-center">
        Have questions about a project? Fill out the form below and our team at{" "}
        <b>Altina Livings</b> will reach out to you shortly.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-50 p-6 rounded-xl shadow"
      >
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 border rounded"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full p-3 border rounded"
          required
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <textarea
          placeholder="Your Message"
          className="w-full p-3 border rounded"
          rows="4"
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
