"use client";
import Link from "next/link";
import { useState } from "react";

const TICKER_TEXT = [
  "Commercial Spaces",
  "Villas",
  "Ready to Move",
  "Under Construction",
  "New Launch",
  "Premium Channel Partner for DLF, M3M, Sobha & Godrej",
  "Exclusive Projects",
  "Luxury Apartments",
].join("  •  ");

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      {/* top gold ticker */}
      <div className="w-full bg-[var(--brand)] text-white text-[11px]">
        <div className="container mx-auto px-4 py-2 ticker">
          <div className="ticker__inner">{TICKER_TEXT}</div>
        </div>
      </div>

      {/* nav bar */}
      <div className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Altina" className="h-6 w-auto hidden sm:block" />
            <span className="font-semibold tracking-wide">ALTINA™ Livings</span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/">Home</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blogs</Link>
            <Link href="/career">Career</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          {/* mobile */}
          <button
            className="md:hidden border rounded px-3 py-1 text-sm"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>
        {open && (
          <nav className="md:hidden bg-white border-t">
            <div className="px-4 py-3 flex flex-col gap-3 text-sm">
              <Link href="/" onClick={() => setOpen(false)}>Home</Link>
              <Link href="/projects" onClick={() => setOpen(false)}>Projects</Link>
              <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
              <Link href="/about" onClick={() => setOpen(false)}>About</Link>
              <Link href="/blog" onClick={() => setOpen(false)}>Blogs</Link>
              <Link href="/career" onClick={() => setOpen(false)}>Career</Link>
              <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
