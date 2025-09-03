"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitLead } from "@/lib/submitLead";

export default function ContactForm({ project }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
      project: project || "General Enquiry",
      utm_source: sessionStorage.getItem("utm_source") || "",
      utm_campaign: sessionStorage.getItem("utm_campaign") || "",
      utm_medium: sessionStorage.getItem("utm_medium") || "",
      utm_term: sessionStorage.getItem("utm_term") || "",
      utm_content: sessionStorage.getItem("utm_content") || "",
    };

    const result = await submitLead(formData);

    if (result.result === "success") {
      router.push("/thank-you"); // ✅ redirect after success
    } else {
      setError("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <input type="text" name="name" placeholder="Your Name" required className="w-full p-3 border rounded" />
      <input type="email" name="email" placeholder="Your Email" required className="w-full p-3 border rounded" />
      <input type="tel" name="phone" placeholder="Your Phone" required className="w-full p-3 border rounded" />
      <textarea name="message" placeholder="Message" rows="4" className="w-full p-3 border rounded"></textarea>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
