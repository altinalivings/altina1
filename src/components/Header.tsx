// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // toast state
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Close on Esc
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);
  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onKey]);

  // local field states for validation
  const [phone, setPhone] = useState("");
  const [phoneErr, setPhoneErr] = useState<string | null>(null);

  function handlePhoneChange(v: string) {
    // allow digits only, clamp to 10
    const next = v.replace(/\D/g, "").slice(0, 10);
    setPhone(next);
    if (next.length !== 10) setPhoneErr("Enter a 10-digit number");
    else setPhoneErr(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const name = String(fd.get("name") ?? "").trim();
    const project = String(fd.get("project") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    // Validate phone and message
    if (phone.length !== 10) {
      setPhoneErr("Enter a 10-digit number");
      showToast("Please enter a valid 10-digit phone number.", "err");
      return;
    }
    if (!message) {
      showToast("Message is required.", "err");
      return;
    }

    setSubmitting(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          project,
          message,
          source: "header_enquiry",
          page: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      form.reset();
      setPhone("");
      setPhoneErr(null);
      showToast("Thank you! We'll contact you soon.", "ok");
      setOpen(false);
    } catch {
      showToast("Something went wrong. Please try calling us instead.", "err");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0B0B0C]/95 backdrop-blur-md shadow-lg" : "bg-[#0B0B0C]/80"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logos/Altina.png"
              alt="ALTINA™ Livings - Luxury Properties Delhi NCR"
              width={80}
              height={80}
              className="h-20 w-20 rounded"
              priority
            />
            
            <div className="leading-tight">
              <div className="font-semibold text-white">ALTINA<span className="align-top text-[12px] ml-0.8">™</span> <span className="opacity-80">Livings</span></div>
            </div>
          </Link>

          {/* ✅ UPDATED Navigation - Added Locations link */}
          <nav className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-white" aria-label="Main navigation">
            {[
              { href: "/", label: "Home" },
              { href: "/projects", label: "Projects" },
              { href: "/locations", label: "Locations" },
              { href: "/services", label: "Services" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`hover:text-altina-gold transition-colors relative pb-0.5 ${
                    isActive
                      ? "text-altina-gold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-altina-gold"
                      : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

         {/* CTA Zone */}
        <div className="flex items-center gap-3 whitespace-nowrap">
          {/* WhatsApp */}
          <a
            href="https://wa.me/919891234195"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#BF953F] text-[#BF953F] px-3 py-1.5 text-sm font-semibold hover:bg-[#BF953F] hover:text-black transition"
            aria-label="Contact via WhatsApp"
          >
            WhatsApp
          </a>

          {/* Call Number */}
          <a
            href="tel:+919891234195"
            className="hidden sm:block text-[#BF953F] font-semibold text-sm hover:text-white transition"
            aria-label="Call us at +91 98912 34195"
          >
            +91&nbsp;98912&nbsp;34195
          </a>

          {/* Enquiry – styled same as WhatsApp */}
          <button
            onClick={() => setOpen(true)}
            className="hidden sm:block rounded-lg border border-[#BF953F] text-[#BF953F] px-3 py-1.5 text-sm font-semibold hover:bg-[#BF953F] hover:text-black transition"
            aria-expanded={open}
            aria-controls="altina-contact-form"
            aria-label="Open enquiry form"
          >
            Enquire
          </button>

          {/* Hamburger – mobile only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 justify-center items-center w-9 h-9 rounded-lg border border-white/20 hover:border-altina-gold/60 transition"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[55] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <nav
            className="absolute top-0 right-0 h-full w-72 bg-[#0B0B0C] border-l border-altina-gold/20 flex flex-col pt-20 pb-8 px-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile navigation"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl leading-none"
              aria-label="Close menu"
            >
              ×
            </button>
            <div className="flex flex-col gap-1">
              {[
                { href: "/", label: "Home" },
                { href: "/projects", label: "Projects" },
                { href: "/locations", label: "Locations" },
                { href: "/services", label: "Services" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`py-3 px-4 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "text-altina-gold bg-altina-gold/10"
                        : "text-white hover:text-altina-gold hover:bg-white/5"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-auto flex flex-col gap-3">
              <a
                href="tel:+919891234195"
                className="flex items-center gap-2 text-altina-gold font-semibold text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/>
                </svg>
                +91 98912 34195
              </a>
              <a
                href="https://wa.me/919891234195"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#BF953F] text-[#BF953F] px-4 py-2.5 text-sm font-semibold hover:bg-[#BF953F] hover:text-black transition text-center"
              >
                WhatsApp Us
              </a>
              <button
                onClick={() => { setMobileMenuOpen(false); setOpen(true); }}
                className="rounded-xl bg-altina-gold text-black px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition text-center"
              >
                Enquire Now
              </button>
            </div>
          </nav>
        </div>
      )}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-labelledby="altina-enquiry-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#0D0D0D] border border-altina-gold/40 rounded-xl p-6 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-altina-ivory/60 hover:text-altina-ivory text-2xl leading-none"
              aria-label="Close enquiry form"
            >
              ×
            </button>

            <h2 id="altina-enquiry-title" className="text-2xl font-bold gold-text mb-4">
              Get in Touch
            </h2>
            <p className="text-altina-ivory/70 text-sm mb-6">
              Fill in your details and we'll call you back within 5 minutes.
            </p>

            <form id="altina-contact-form" onSubmit={onSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="header-name" className="block text-sm font-medium text-altina-ivory/80 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="header-name"
                  name="name"
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-altina-gold/30 text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="header-phone" className="block text-sm font-medium text-altina-ivory/80 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="header-phone"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border ${
                    phoneErr ? "border-red-500" : "border-altina-gold/30"
                  } text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40`}
                  placeholder="10-digit mobile number"
                  required
                />
                {phoneErr && <p className="text-red-500 text-xs mt-1">{phoneErr}</p>}
              </div>

              {/* Project Interest */}
              <div>
                <label htmlFor="header-project" className="block text-sm font-medium text-altina-ivory/80 mb-1">
                  Interested In (optional)
                </label>
                <input
                  type="text"
                  id="header-project"
                  name="project"
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-altina-gold/30 text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
                  placeholder="Project name or location"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="header-message" className="block text-sm font-medium text-altina-ivory/80 mb-1">
                  Your Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="header-message"
                  name="message"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1A1C] border border-altina-gold/30 text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
                  placeholder="Tell us about your requirements..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !!phoneErr}
                className="w-full py-3 rounded-lg bg-gold-grad text-[#0D0D0D] font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Request Call Back"}
              </button>

              <p className="text-xs text-altina-ivory/50 text-center">
                By submitting, you agree to our terms and privacy policy
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[70] px-6 py-3 rounded-lg shadow-xl ${
            toast.type === "ok"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
          role="alert"
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
