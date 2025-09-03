"use client";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { MdPhone, MdEmail } from "react-icons/md";
import { submitLead } from "@/utils/submitLead";

export default function Footer() {
  return (
    <footer className="bg-[#0d1629] text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-4">Altina Livings</h2>
          <p className="text-gray-300 mb-4">
            Premier channel partners for India&apos;s leading real estate
            developers. Crafting timeless spaces for modern living.
          </p>
          <div className="flex items-center gap-3 mb-2">
            <MdPhone className="text-xl text-yellow-400" />
            <span>+91 9891234195</span>
          </div>
          <div className="flex items-center gap-3">
            <MdEmail className="text-xl text-yellow-400" />
            <span>info@altinalivings.com</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/career">Career</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <form
			  onSubmit={async (e) => {
				e.preventDefault();
				const email = e.target.email.value;
				const result = await submitLead({
				  name: "Newsletter Subscriber",
				  email,
				  phone: "",
				  message: "Subscribed to newsletter",
				  project: "Newsletter",
				});
				if (result.result === "success") {
				  toast.success("✅ Thank you for subscribing!");
				  e.target.reset();
				  window.location.href = "/thank-you";
				} else {
				  toast.error("❌ Something went wrong!");
				}
			  }}
			>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
            />
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded"
            >
              Subscribe
            </button>
          </form>
          <div className="flex gap-4 mt-6 text-2xl">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href="https://wa.me/919891234195" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Altina Livings. All rights reserved.
      </div>
    </footer>
  );
}
