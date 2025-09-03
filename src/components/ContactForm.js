"use client";

import { useState } from "react";
import { submitLead } from "../lib/submitLead";
import { useRouter } from "next/navigation";
import Toast from "./Toast";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const lead = Object.fromEntries(formData.entries());

    try {
      await submitLead({ ...lead, type: "enquiry" });

      setToastMessage("✅ Thank you! We’ll contact you soon.");
      setToastType("success");
      setShowToast(true);

      e.target.reset();

      // Redirect only for contact page
      router.push("/thank-you");
    } catch (error) {
      console.error(error);
      setToastMessage("❌ Something went wrong. Please try again.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <input type="tel" name="phone" placeholder="Your Phone" required />
        <textarea name="message" placeholder="Message (optional)" />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}

