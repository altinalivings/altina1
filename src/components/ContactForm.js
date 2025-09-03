"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContactForm({ projectName }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    project: "",
  });
  const [status, setStatus] = useState("");

  // If `projectName` prop is passed (from ProjectDetailClient), set it
  useEffect(() => {
    if (projectName) {
      setForm((prev) => ({ ...prev, project: projectName }));
    }
  }, [projectName]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            utm_source: new URLSearchParams(window.location.search).get("utm_source"),
            utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
            utm_medium: new URLSearchParams(window.location.search).get("utm_medium"),
            utm_term: new URLSearchParams(window.location.search).get("utm_term"),
            utm_content: new URLSearchParams(window.location.search).get("utm_content"),
          }),
        }
      );

      // ✅ Reset tracker so Thank You page events fire again
      sessionStorage.removeItem("leadTrkFired");

      router.push("/thank-you");
    } catch (err) {
      console.error(err);
      setStatus("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* hidden project name field */}
      {form.project && (
        <input type="hidden" name="project" value={form.project} readOnly />
      )}

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Your Phone"
        value={form.phone}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Submit
      </button>
      {status && <p className="text-sm mt-2">{status}</p>}
    </form>
  );
}
