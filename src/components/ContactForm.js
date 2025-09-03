'use client';
import { useState } from "react";
import { submitLead } from "../lib/submitLead";
import { usePathname } from "next/navigation";
import Toast from "./Toast";

export default function ContactForm({ project, isProjectDetail = false }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const pathname = usePathname();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      let type = "enquiry";
      if (isProjectDetail) {
        type = "interested";
      }

      await submitLead({
        ...data,
        type,
        project: isProjectDetail ? project : "",
      });

      setToast({ type: "success", message: "✅ Thank you! We’ll contact you soon." });
      e.target.reset();
    } catch (err) {
      setToast({ type: "error", message: "❌ Failed to submit enquiry." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="contact-form">
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <input type="tel" name="phone" placeholder="Your Phone" required />
        <textarea name="message" placeholder="Message (optional)" />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
}
