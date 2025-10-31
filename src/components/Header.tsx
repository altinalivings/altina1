// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2" onClick={close}>
          <span className="text-lg font-semibold tracking-wide">ALTINA™ Livings</span>
        </Link>

        {/* Desktop nav (placeholder) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/projects" className="opacity-80 hover:opacity-100" onClick={close}>
            Projects
          </Link>
          <Link href="/about" className="opacity-80 hover:opacity-100" onClick={close}>
            About
          </Link>
          <Link href="/contact" className="opacity-80 hover:opacity-100" onClick={close}>
            Contact
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden rounded-lg border border-white/15 px-3 py-2"
          onClick={toggle}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 px-6 py-4 space-y-3 bg-black/95">
          <Link href="/projects" className="block" onClick={close}>
            Projects
          </Link>
          <Link href="/about" className="block" onClick={close}>
            About
          </Link>
          <Link href="/contact" className="block" onClick={close}>
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
