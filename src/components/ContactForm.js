"use client";
import { useState } from "react";
import { submitLead } from "../lib/submitLead";

export default function ContactForm({ mode = "callback", fields, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    project: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitLead({
        ...formData,
        source: mode,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("❌ Something went wrong, try again.");
    } finally {
      setLoading(false);
    }
  };

  // Decide which fields to show
  const visibleFields =
    mode === "sitevisit" && fields ? fields : ["name", "email", "phone", "message"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {visibleFields.includes("name") && (
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />
      )}

      {visibleFields.includes("email") && (
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />
      )}

      {visibleFields.includes("phone") && (
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />
      )}

      {visibleFields.includes("message") && (
        <textarea
          name="message"
          placeholder="Message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
