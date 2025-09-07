"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="altina-dark pt-14">
      <div className="altina-container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + blurb */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full" style={{background:"linear-gradient(135deg,#c5a250,#e0c070)"}} />
              <span className="font-serif text-lg">Altina Livings™</span>
            </div>
            <p className="mt-3 text-sm text-gray-300/90">
              RERA-registered channel partner for DLF, M3M, Sobha & Godrej. Concierge-style advisory for luxury homes and investment-grade assets.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-sm font-semibold text-white/90">Company</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
              <Link href="/projects" className="text-gray-300 hover:text-white">Projects</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white">Privacy</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-sm font-semibold text-white/90">Services</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <span className="text-gray-300">Property Consulting</span>
              <span className="text-gray-300">Project Promotion</span>
              <span className="text-gray-300">NRI Desk</span>
              <span className="text-gray-300">Priority Allotment</span>
            </div>
          </div>

          {/* CTA */}
          <div>
            <p className="text-sm font-semibold text-white/90">Talk to us</p>
            <p className="mt-3 text-sm text-gray-300">WhatsApp: <a className="underline" href="https://wa.me/919999999999">+91 99999 99999</a></p>
            <a href="#enquire" className="btn-gold mt-4 inline-block">Enquire Now</a>
          </div>
        </div>

        <div className="hr-gold mt-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Altina Livings™. All rights reserved. Altina™ is a registered trademark.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>RERA Verified</span>
            <span>•</span>
            <span>100% Transparent Process</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
