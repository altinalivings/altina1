"use client";

import { useState } from "react";
import { submitLead } from "../utils/submitLead";
import { useRouter } from "next/navigation";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
      project: e.target.project?.value || "General",
    };

    const res = await submitLead(formData);

    setLoading(false);

    if (res.result === "success") {
      router.push("/thank-you");
    } else {
      alert("❌ Failed to submit enquiry.\n\n" + (res.details || res.raw));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" placeholder="Your Name" required className="border p-2 w-full" />
      <input type="email" name="email" placeholder="Your Email" required className="border p-2 w-full" />
      <input type="tel" name="phone" placeholder="Your Phone" required className="border p-2 w-full" />
      <textarea name="message" placeholder="Your Message" rows="4" className="border p-2 w-full" />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
