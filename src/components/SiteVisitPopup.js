"use client";
import { useState } from "react";

export default function SiteVisitPopup({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec", // ✅ replace with your deployed Web App URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            project: project?.title || "General Enquiry",
          }),
        }
      );

      if (!response.ok) {
        // Capture server error
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const result = await response.json();

      if (result.result === "success") {
        setSuccess("✅ Your site visit request has been submitted!");
        setFormData({ name: "", phone: "", email: "" });
      } else {
        throw new Error(result.details || "Unknown error");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(`❌ Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-1/3 bg-blue-600 text-white px-4 py-2 rounded-l-lg shadow-lg hover:bg-blue-700"
      >
        Organize Site Visit
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Book a Site Visit</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full p-3 border rounded"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full p-3 border rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full p-3 border rounded"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                {loading ? "Submitting..." : "Confirm Site Visit"}
              </button>
            </form>

            {/* Messages */}
            {success && <p className="text-green-600 mt-3">{success}</p>}
            {error && <p className="text-red-600 mt-3">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
