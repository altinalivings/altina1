// src/components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Blog", href: "/blog" },
  { label: "Gurugram", href: "/gurgaon" },
  { label: "Noida", href: "/noida" },
  { label: "Delhi", href: "/delhi" },
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services We Offer" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // lock body scroll when menu is open (mobile)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // close drawer on route change (when user taps a link)
  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Image
            src="/logos/Altina.png"
            alt="ALTINA™ Livings"
            width={40}
            height={40}
            className="h-10 w-10 rounded"
            priority
          />
          <div className="leading-tight">
            <div className="font-semibold text-white">ALTINA<span className="align-top text-[10px] ml-0.5">™</span> <span className="opacity-80">Livings</span></div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-neutral-200 hover:text-amber-300 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://wa.me/919891234195"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 text-black text-sm font-medium px-4 py-2 shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_20px_rgba(0,0,0,0.35)] hover:opacity-95 transition"
          >
            WhatsApp
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-neutral-200 hover:text-white hover:bg-white/10"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 border-t border-white/10 ${open ? "max-h-[70vh]" : "max-h-0"}`}
      >
        <nav className="bg-neutral-900/95">
          <ul className="flex flex-col p-4 gap-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-3 text-base text-neutral-200 hover:text-white hover:bg-white/10 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <a
                href="https://wa.me/919891234195"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="block text-center rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 text-black font-medium px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_20px_rgba(0,0,0,0.35)] hover:opacity-95 transition"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
