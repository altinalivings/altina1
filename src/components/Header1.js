"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${scrolled ? "header-glass" : "bg-transparent"}`}>
      <div className="altina-container">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full" style={{background:"linear-gradient(135deg,#c5a250,#e0c070)"}} />
            <span className="font-serif text-lg tracking-wide text-white">Altina Livings</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "/projects", label: "Projects" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="link-gold text-sm text-gray-200 hover:text-white">
                {item.label}
              </Link>
            ))}
            <a href="#enquire" className="btn-gold text-sm">Enquire</a>
          </nav>

          {/* Mobile menu */}
          <button
            aria-label="Open Menu"
            className="md:hidden text-white"
            onClick={() => setOpen(true)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: .25 }}
            className="absolute right-0 top-0 h-full w-72 bg-[#141416] text-white shadow-2xl ring-1 ring-white/10"
            onClick={(e)=>e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <span className="font-serif">Altina Livings</span>
              <button onClick={()=>setOpen(false)} aria-label="Close Menu" className="text-white/80 hover:text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2"/></svg>
              </button>
            </div>
            <div className="p-4 space-y-2">
              <Link href="/projects" className="block rounded-lg px-3 py-2 hover:bg-white/5">Projects</Link>
              <Link href="/about" className="block rounded-lg px-3 py-2 hover:bg-white/5">About</Link>
              <Link href="/contact" className="block rounded-lg px-3 py-2 hover:bg-white/5">Contact</Link>
              <a href="#enquire" className="btn-gold inline-block w-full text-center mt-2">Enquire</a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </header>
  );
}
