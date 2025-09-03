'use client';
import { useState } from "react";
import { submitLead } from "../lib/submitLead";
import Toast from "./Toast";

export default function ProjectEnquiryModal({ isOpen, onClose, mode, project }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      let type = "enquiry";
      if (mode === "callback") type = "interested";
      if (mode === "sitevisit") type = "sitevisit";

      await submitLead({
        ...data,
        type,
        project: project || "",
      });

      setToast({ type: "success", message: "✅ Thank you! We’ll contact you soon." });
      e.target.reset();
      setTimeout(() => {
        setToast(null);
        onClose();
      }, 3000);
    } catch (err) {
      setToast({ type: "error", message: "❌ Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{mode === "sitevisit" ? "Organize a Site Visit" : "Request a Callback"}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <input type="tel" name="phone" placeholder="Your Phone" required />
          {mode === "callback" && <textarea name="message" placeholder="Message (optional)" />}
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}
