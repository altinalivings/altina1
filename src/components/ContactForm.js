"use client";

import { useState } from "react";
import { submitLead } from "@/utils/submitLead";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const result = await submitLead({
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
      project: "Contact Form",
    });
    setLoading(false);
    if (result.result === "success") {
      toast.success("✅ Enquiry submitted! Redirecting...");
      window.location.href = "/thank-you";
    } else {
      toast.error("❌ Something went wrong, try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" placeholder="Your Name" required className="w-full px-4 py-2 border rounded" />
      <input type="email" name="email" placeholder="Your Email" required className="w-full px-4 py-2 border rounded" />
      <input type="tel" name="phone" placeholder="Your Phone" required className="w-full px-4 py-2 border rounded" />
      <textarea name="message" placeholder="Message" rows="4" className="w-full px-4 py-2 border rounded"></textarea>
      <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
