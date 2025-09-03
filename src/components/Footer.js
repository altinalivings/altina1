"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Altina Livings</h2>
          <p className="text-gray-400 text-sm">
            Redefining real estate with premium projects and trusted partnerships.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <p className="text-gray-300 text-sm">📍 Gurgaon, Haryana</p>
          <p className="text-gray-300 text-sm">📞 +91 9876543210</p>
          <p className="text-gray-300 text-sm">✉️ info@altinalivings.com</p>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Altina Livings. All rights reserved.
      </div>
    </footer>
  );
}
