"use client";
import { useState } from "react";
import { submitLead } from "../lib/submitLead";

export default function ProjectEnquiryModal({ purpose = "Enquiry", onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await submitLead({ ...formData, purpose });
    setLoading(false);
    if (success) {
      alert("✅ Thanks! We will contact you shortly.");
      onClose();
    } else {
      alert("❌ Something went wrong, please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold mb-4">{purpose}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="name" placeholder="Your Name" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
          <input type="email" name="email" placeholder="Your Email" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
          <input type="tel" name="phone" placeholder="Your Phone" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
          <textarea name="message" placeholder="Message" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
