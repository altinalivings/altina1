"use client";

import { useState } from "react";
import { submitLead } from "@/utils/submitLead";
import toast from "react-hot-toast";

export default function ProjectEnquiryModal({ onClose, source = "Project Detail" }) {
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
      project: source,
    });
    setLoading(false);
    if (result.result === "success") {
      toast.success("✅ Thank you! Unlocking content...");
      onClose();
    } else {
      toast.error("❌ Failed to submit enquiry.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Enquire Now</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="name" placeholder="Your Name" required className="w-full px-4 py-2 border rounded" />
          <input type="email" name="email" placeholder="Your Email" required className="w-full px-4 py-2 border rounded" />
          <input type="tel" name="phone" placeholder="Your Phone" required className="w-full px-4 py-2 border rounded" />
          <textarea name="message" placeholder="Message" rows="3" className="w-full px-4 py-2 border rounded"></textarea>
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
