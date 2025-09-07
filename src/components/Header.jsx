"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Home, User, FileText, Briefcase, BookOpen, Layers, Phone } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // classes that switch with scroll
  const wrapClasses = scrolled
    ? "bg-gray-900/95 shadow-lg text-white"
    : "bg-transparent text-white";

  return (
    <header className="fixed top-0 inset-x-0 z-[9999]">
      {/* background (transparent mode gets a subtle top gradient for readability) */}
      <div className={`transition-colors duration-300 ${wrapClasses}`}>
        {!scrolled && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45),rgba(0,0,0,0))]" />
        )}

        <div className="altina-container relative flex items-center justify-between py-3">
          {/* Left: Logo + Name */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logos/Altina.png"
              alt="Altina Logo"
              className="h-20 w-auto md:h-15 object-contain drop-shadow-[0_0_2px_rgba(0,0,0,0.25)]"
            />
            <span className={`font-serif text-lg md:text-xl tracking-wide ${scrolled ? "text-white" : "text-white"}`}>
              ALTINA™ <span className="font-sans">Livings</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <A href="/" icon={<Home size={16} />} scrolled={scrolled}>Home</A>
            <A href="/projects" icon={<FileText size={16} />} scrolled={scrolled}>Projects</A>
            <A href="/services" icon={<Briefcase size={16} />} scrolled={scrolled}>Services</A>
            <A href="/about" icon={<User size={16} />} scrolled={scrolled}>About</A>
            <A href="/blogs" icon={<BookOpen size={16} />} scrolled={scrolled}>Blogs</A>
            <A href="/career" icon={<Layers size={16} />} scrolled={scrolled}>Career</A>
            <A href="/contact" icon={<Phone size={16} />} scrolled={scrolled}>Contact</A>
          </nav>

          {/* CTA (desktop) */}
          <Link
            href="#enquire"
            className={`hidden md:inline-flex rounded-lg px-4 py-2 text-sm font-semibold transition
              ${scrolled ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-white/90 text-gray-900 hover:bg-white"}`}
          >
            Enquire
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className={`md:hidden inline-flex items-center justify-center p-2 rounded-md transition ${
              scrolled ? "text-white hover:bg-white/10" : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer (always dark for contrast) */}
      {open && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900/98 text-white">
          <nav className="altina-container grid gap-2 py-2 text-[15px] font-medium">
            {[
              ["Home","/"],
              ["Projects","/projects"],
              ["Services","/services"],
              ["About","/about"],
              ["Blogs","/blogs"],
              ["Career","/career"],
              ["Contact","/contact"],
            ].map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="px-1 py-1.5 hover:text-white/90">
                {label}
              </Link>
            ))}
            <Link href="#enquire" onClick={() => setOpen(false)} className="mt-2 inline-flex justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900">
              Enquire
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

/* Small helper for desktop links to keep hover styles tidy */
function A({ href, icon, children, scrolled }) {
  return (
    <Link href={href} className={`flex items-center gap-1 hover:opacity-90 ${scrolled ? "text-white" : "text-white"}`}>
      {icon} {children}
    </Link>
  );
}
