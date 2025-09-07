"use client";
import { MessageCircle, Phone } from "lucide-react";

export default function StickyCTA({
  label = "Request Callback",
  whatsapp = "919891234195", // fallback
  tel = "+919891234195",     // fallback
  enquireHref = "#enquire",
}) {
  const wa = `https://wa.me/${String(whatsapp).replace(/\D+/g, "")}?text=${encodeURIComponent(
    "Hi Altina, I’d like to know more."
  )}`;

  return (
    <div className="fixed right-4 top-1/2 z-[60] -translate-y-1/2 hidden md:flex flex-col gap-2">
      <a
        href={enquireHref}
        className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
        aria-label="Request callback"
      >
        {label}
      </a>
      <a
        href={wa}
        target="_blank"
        className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={16} /> WhatsApp
      </a>
      <a
        href={`tel:${tel.replace(/\s+/g, "")}`}
        className="inline-flex items-center justify-center gap-1 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-black"
        aria-label="Call Altina"
      >
        <Phone size={16} /> Call
      </a>
    </div>
  );
}
