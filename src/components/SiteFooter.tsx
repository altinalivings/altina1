"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";

type Socials = {
  x?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  youtube?: string;
};

const GOLD = "#C5A657";
const GOLD_BORDER = "rgba(197,166,87,0.55)";
const IVORY_BORDER = "rgba(255, 246, 214, 0.8)";
const IVORY_BG = "rgba(255, 255, 240, 0.9)";

/* ---------- inline SVG icons ---------- */
function IconSVG({ name, className }: { name: keyof Socials; className?: string }) {
  const cls = `w-6 h-6 transition-colors duration-200 ${className ?? ""}`;
  switch (name) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path
            fill="currentColor"
            d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8.5h4.9V24H.5zM9 8.5h4.7v2.1h.1c.7-1.2 2.3-2.5 4.7-2.5 5 0 5.9 3.3 5.9 7.6V24h-4.9v-6.8c0-1.6 0-3.6-2.2-3.6-2.2 0-2.5 1.7-2.5 3.5V24H9z"
          />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path
            fill="currentColor"
            d="M18.244 2H21.5l-7.5 8.574L23 22h-6.373l-4.99-6.07L5.85 22H2.5l8.16-9.33L1 2h6.495l4.52 5.59L18.244 2zm-1.115 18h1.63L7.04 4H5.32L17.129 20z"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path
            fill="currentColor"
            d="M22 12a10 10 0 1 0-11.5 9.88v-6.99H7.9V12h2.6V9.8c0-2.57 1.53-3.99 3.87-3.99 1.12 0 2.29.2 2.29.2v2.52h-1.29c-1.27 0-1.66.79-1.66 1.6V12h2.83l-.45 2.89h-2.38v6.99A10 10 0 0 0 22 12z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path
            fill="currentColor"
            d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.9.26 2.35.43.59.23 1.01.5 1.46.95.45.45.72.87.95 1.46.17.45.37 1.14.43 2.35.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.26 1.9-.43 2.35a3.6 3.6 0 0 1-.95 1.46 3.6 3.6 0 0 1-1.46.95c-.45.17-1.14.37-2.35.43-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.9-.26-2.35-.43a3.6 3.6 0 0 1-1.46-.95 3.6 3.6 0 0 1-.95-1.46c-.17-.45-.37-1.14-.43-2.35C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.26-1.9.43-2.35.23-.59.5-1.01.95-1.46.45-.45.87-.72 1.46-.95.45-.17 1.14-.37 2.35-.43C8.4 2.2 8.8 2.2 12 2.2zm0 5.5a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6zm6-2a1.24 1.24 0 1 1 0 2.48 1.24 1.24 0 0 1 0-2.48z"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path
            fill="currentColor"
            d="M23.5 6.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C17.5 2.5 12 2.5 12 2.5s-5.5 0-8.3.4c-.4 0-1.4.1-2.3 1-.7.7-.9 2.3-.9 2.3S0 8.1 0 9.9v2.2c0 1.8.2 3.7.2 3.7s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 8.3.4 8.3.4s5.5 0 8.3-.4c.4 0 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.7V9.9c0-1.8-.2-3.7-.2-3.7zM9.6 14.6V7.9l6.2 3.3-6.2 3.4z"
          />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden>
          <path
            fill="currentColor"
            d="M.5 23.5l1.7-6A10.5 10.5 0 1 1 12 22.5c-1.8 0-3.5-.5-5-1.4L.5 23.5zM12 3.5a8.5 8.5 0 0 0-7.3 12.9l.2.4-1 3.5 3.6-.9.3.2A8.5 8.5 0 1 0 12 3.5z"
          />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------- Social Icon Wrapper ---------- */
function SocialIcon({ href, name }: { href: string; name: keyof Socials }) {
  const hoverClass =
    name === "youtube"
      ? "group-hover:text-[#FF0000]"
      : name === "whatsapp"
      ? "group-hover:text-[#25D366]"
      : name === "linkedin"
      ? "group-hover:text-[#0A66C2]"
      : name === "facebook"
      ? "group-hover:text-[#1877F2]"
      : name === "instagram"
      ? "group-hover:text-[#E1306C]"
      : "group-hover:text-[#1DA1F2]";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="group inline-flex h-10 w-10 items-center justify-center rounded-full transition"
      style={{
        color: "#FFFFFF",
        background: "rgba(13,13,13,0.85)",
        boxShadow: `0 0 0 1px ${GOLD_BORDER} inset, 0 0 12px rgba(0,0,0,0.25)`,
      }}
    >
      <IconSVG name={name} className={hoverClass} />
    </a>
  );
}

/* ---------- Footer ---------- */
export default function SiteFooter({
  phone = "+91 98912 34195",
  socials = {
    x: "https://x.com/Altinalivings",
    linkedin: "https://www.linkedin.com/company/108414321/",
    instagram: "https://www.instagram.com/altinalivings",
    facebook: "https://www.facebook.com/profile.php?id=61581061191134",
    whatsapp: "https://wa.me/919891234195",
    youtube: "https://www.youtube.com/@Altinalivings",
  },
}: {
  phone?: string;
  socials?: Socials;
}) {
  const ref = useRef(false);
  useEffect(() => {}, []);

  const openCallback = () =>
    window.dispatchEvent(
      new CustomEvent("lead:open", {
        detail: { mode: "callback", projectId: "footer", projectName: "Footer" },
      })
    );

  return (
    <footer className="w-full mt-20">
      {/* Golden ivory call strip */}
      <div
        className="w-full"
        style={{
          borderTop: `3px solid ${IVORY_BORDER}`,
          borderBottom: `3px solid ${IVORY_BORDER}`,
          background: IVORY_BG,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <a
              href={`tel:${phone}`}
              className="text-3xl font-bold tracking-wide"
              style={{ color: GOLD }}
            >
              Call Us @ {phone}
            </a>
            <p className="mt-1 text-sm text-black/85">
              We help you find the most exceptional residential and commercial
            </p>
            <p className="mt-1 text-sm text-black/85">
              deals brought by the best and most trusted builders.
            </p>
          </div>
          <button
            onClick={openCallback}
            className="rounded-full px-8 py-3 text-base font-semibold shadow-md"
            style={{
              color: "#0D0D0D",
              background:
                "linear-gradient(180deg, rgba(255,246,214,0.92) 0%, rgba(255,246,214,0.8) 100%)",
              boxShadow: `0 0 0 1px ${IVORY_BORDER} inset`,
            }}
          >
            Request Call
          </button>
        </div>
      </div>

      {/* Footer grid */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logos/Altina.png" alt="ALTINA" className="h-16 w-auto" />
            <span className="text-lg font-semibold">ALTINA™ Livings</span>
          </div>
          <p className="text-neutral-400 mt-2">
            Gateway to Luxury Livings — Premium channel partner for luxury real
            estate across Delhi NCR.
          </p>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            {Object.entries(socials).map(
              ([name, href]) =>
                href && <SocialIcon key={name} href={href} name={name as keyof Socials} />
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Useful Links</h4>
          <ul className="space-y-1 text-neutral-300">
            <li><Link href="/projects" className="hover:text-[#C9A23F]">Projects</Link></li>
            <li><Link href="/developers" className="hover:text-[#C9A23F]">Developers</Link></li>
            <li><Link href="/about" className="hover:text-[#C9A23F]">About</Link></li>
            <li><Link href="/contact" className="hover:text-[#C9A23F]">Contact</Link></li>
            <li><Link href="/blog" className="hover:text-[#C9A23F]">Blog</Link></li>
            <li><Link href="/privacy" className="hover:text-[#C9A23F]">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="font-semibold">Stay in the Loop</h4>
          <p className="text-neutral-400 mt-2">
            Get new launches, price lists and exclusive invites.
          </p>
          <SubscribeForm />
          <label className="mt-3 flex items-start gap-2 text-xs text-neutral-400">
            <input type="checkbox" defaultChecked className="mt-0.5" />
            I authorize company representatives to contact me via Call, SMS, Email
            or WhatsApp. This consent overrides any DNC/NDNC registration.
          </label>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <div>© {new Date().getFullYear()} Altina™ Livings. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/sitemap" className="hover:text-[#C9A23F]">Sitemap</Link>
            <Link href="/privacy" className="hover:text-[#C9A23F]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#C9A23F]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
