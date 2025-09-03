"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitLead } from "@/utils/leadSubmit";

export default function ContactForm({ project = "General Enquiry" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    project: project,
    utm_source: "",
    utm_campaign: "",
    utm_medium: "",
    utm_term: "",
    utm_content: "",
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await submitLead(formData);
  if (result.success) {
    router.push("/thank-you");
  } else {
    alert("Error submitting form. Please try again.");
  }
};

  return (
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
  );
}
