// src/components/Header.js
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const tickerItems = [
    "No brokerage on select launches",
    "Book a site visit today",
    "Exclusive pre-launch deals",
  ];

  return (
    <header className="border-b">
      {/* Simple announcement bar */}
      <div className="w-full bg-amber-600 text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex gap-6 overflow-x-auto">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-6">
              {tickerItems.map((txt, j) => (
                <span key={`${i}-${j}`} className="whitespace-nowrap">
                  {txt}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          Altina Livings
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/projects">Projects</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden border rounded px-3 py-1 text-sm"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden border-t">
          <div className="px-4 py-3 flex flex-col gap-3 text-sm">
            <Link href="/projects" onClick={() => setOpen(false)}>Projects</Link>
            <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
            <Link href="/about" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
