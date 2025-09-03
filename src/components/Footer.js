"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "",
            email,
            phone: "",
            message: "Newsletter Subscription",
            project: "",
          }),
        }
      );

      // ✅ Reset tracker so Thank You page events fire
      sessionStorage.removeItem("leadTrkFired");

      router.push("/thank-you");
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row justify-center gap-3">
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-2 rounded text-black w-full sm:w-64" />
          <button type="submit" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
            Subscribe
          </button>
        </form>
        <p className="mt-6 text-gray-400 text-sm">
          © {new Date().getFullYear()} Altina Livings. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
