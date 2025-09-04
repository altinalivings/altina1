"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitLead } from "@/lib/submitLead";
import Notification from "@/components/Notification";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
      project: "General Contact",
    };

    const res = await submitLead(formData);

    if (res.success) {
      setMessage("✅ Thank you! Our team will contact you soon.");
      e.target.reset();
      setTimeout(() => {
        router.push("/thank-you");
      }, 1000); // small delay so toast appears before redirect
    } else {
      setMessage("❌ Failed to submit enquiry. Try again!");
    }

    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Your Name"
          required
          className="w-full border rounded p-3"
        />
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          required
          className="w-full border rounded p-3"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Your Phone"
          required
          className="w-full border rounded p-3"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="4"
          className="w-full border rounded p-3"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <Notification message={message} onClose={() => setMessage("")} />
    </>
  );
}
