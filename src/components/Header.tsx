// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { getAttribution, initAttributionOnce } from "@/lib/attribution";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // toast state
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ✅ Init attribution once so first-touch is captured on landing
  useEffect(() => {
    initAttributionOnce();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

    const page =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : undefined;

    setSubmitting(true);
    try {
      // ✅ Attach attribution (utm_*, click ids, first/last touch, device, session, timezone, etc.)
      const attrib =
        typeof window !== "undefined"
          ? getAttribution({
              source: "header_enquiry",
              page,
              project: project || "",
              mode: "contact",
            })
          : {};

      const payload = {
        ...attrib,
        name,
        // ✅ always send normalized 10-digit phone
        phone,
        project: project || "",
        message,
        source: "header_enquiry",
        // ✅ keep page consistent across all forms
        page,
        mode: "contact",
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Request failed");
      }

      form.reset();
      setPhone("");
      setPhoneErr(null);

      showToast("Thanks! We’ll get in touch shortly.", "ok");
      setOpen(false);
    } catch (err) {
      showToast("Something went wrong. Please try again.", "err");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-[#0b0b0b]"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logos/Altina.png"
              alt="ALTINA™ Livings"
              width={40}
              height={40}
              className="h-20 w-20 rounded"
              priority
            />

            <div className="leading-tight">
              <div className="font-semibold text-white">
                ALTINA<span className="align-top text-[12px] ml-0.8">™</span>{" "}
                <span className="opacity-80">Livings</span>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-white">
            <Link href="/" className="hover:text-altina-gold">
              Home
            </Link>
            <Link href="/projects" className="hover:text-altina-gold">
              Projects
            </Link>
            <Link href="/services" className="hover:text-altina-gold">
              Services We Offer
            </Link>
            <Link href="/about" className="hover:text-altina-gold">
              About
            </Link>
            <Link href="/contact" className="hover:text-altina-gold">
              Contact
            </Link>
          </nav>

          {/* CTA Zone */}
          <div className="flex items-center gap-3 whitespace-nowrap">
            {/* WhatsApp */}
            <a
              href="https://wa.me/919891234195"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#C5A657] text-[#C5A657] px-3 py-1.5 text-sm font-semibold hover:bg-[#C5A657] hover:text-black transition"
            >
              WhatsApp
            </a>

            {/* Call Number */}
            <a
              href="tel:+919891234195"
              className="text-[#C5A657] font-semibold text-sm hover:text-white transition"
            >
              +91&nbsp;98912&nbsp;34195
            </a>

            {/* Enquiry – styled same as WhatsApp */}
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg border border-[#C5A657] text-[#C5A657] px-3 py-1.5 text-sm font-semibold hover:bg-[#C5A657] hover:text-black transition"
              aria-expanded={open}
              aria-controls="altina-contact-form"
            >
              Enquire
            </button>
          </div>
        </div>
      </header>

      {/* Enquiry Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-labelledby="altina-enquiry-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#0d0d0d] shadow-[0_0_32px_rgba(197,166,87,0.20)] border border-[#C5A657]/60 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#C5A657]/40" />

            <div className="flex items-center justify-between px-5 py-4 border-b border-[#C5A657]/30">
              <h2 id="altina-enquiry-title" className="text-[15px] font-semibold text-[#f6eac9]">
                Quick Enquiry
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/80 hover:text-white">
                ✕
              </button>
            </div>

            <form id="altina-contact-form" onSubmit={onSubmit} className="px-5 pt-5 pb-4">
              <div className="space-y-3">
                <Input name="name" placeholder="Your name" autoFocus required />

                {/* Phone (digits only, max 10) */}
                <Input
                  name="phone"
                  placeholder="Phone number (10 digits)"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  inputMode="numeric"
                  maxLength={10}
                  required
                  aria-invalid={!!phoneErr}
                  aria-describedby={phoneErr ? "phone-err" : undefined}
                />
                {phoneErr && (
                  <p id="phone-err" className="text-[11px] text-red-400 -mt-2">
                    {phoneErr}
                  </p>
                )}

                <Input name="project" placeholder="Project (optional)" />
                <Textarea name="message" placeholder="Message" rows={4} required />

                <label className="flex items-start gap-2 text-xs text-white/80">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-[#C5A657]" />
                  <span>
                    I authorize company representatives to Call, SMS, Email or WhatsApp me about its products and
                    offers. This consent overrides any registration for DNC/NDNC.
                  </span>
                </label>
              </div>

              <div className="mt-4 mb-4 flex items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-[#0D0D0D] bg-gradient-to-r from-[#C5A657] to-[#e2cb7a] border border-[#C5A657]/60 shadow-[0_0_18px_rgba(197,166,87,0.25)] disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit"}
                </button>

                <a
                  href="https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%27d%20like%20to%20know%20more%20about%20your%20projects."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5A657] text-sm hover:underline"
                >
                  or chat on WhatsApp →
                </a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-40 right-30 z-[70] rounded-xl px-4 py-2 text-sm shadow-lg ${
            toast.type === "ok"
              ? "bg-[#0f0f0f] border border-[#29c759]/30 text-[#d4ffd6]"
              : "bg-[#1a0f0f] border border-[#ff5e5e]/30 text-[#ffdada]"
          }`}
          role="status"
        >
          {toast.msg}
        </div>
      )}

      {/* Spacer */}
      <div className="h-16 md:h-[72px]" aria-hidden />
    </>
  );
}

/* ---------- Small styled inputs ---------- */

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border border-[#C5A657]/45 bg-[#0f0f0f] px-3 py-2.5 text-[13.5px] text-white placeholder-white/45 outline-none
      focus:border-[#C5A657] focus:ring-2 focus:ring-[#C5A657]/30 ${className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full rounded-xl border border-[#C5A657]/45 bg-[#0f0f0f] px-3 py-2.5 text-[13.5px] text-white placeholder-white/45 outline-none
      focus:border-[#C5A657] focus:ring-2 focus:ring-[#C5A657]/30 ${className ?? ""}`}
    />
  );
}
