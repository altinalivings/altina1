// src/components/SocialIcons.tsx
"use client";

type Item = { href: string; label: string; icon: JSX.Element };

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 17v-6M8 7.5v.01M12 17v-3.5a2 2 0 1 1 4 0V17" />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 3l18 18M21 3L3 21" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M13 10h3V7h-3V6c0-1 .2-1.5 1.6-1.5H16V1.7C15.3 1.6 14.3 1.5 13.4 1.5 10.9 1.5 9 3.1 9 6v1H6v3h3v10h4V10z" />
    </svg>
  );
}
function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M23 7.5a4 4 0 0 0-2.8-2.8C18.7 4 12 4 12 4s-6.7 0-8.2.7A4 4 0 0 0 1 7.5 41 41 0 0 0 1 16.5a4 4 0 0 0 2.8 2.8C5.3 20 12 20 12 20s6.7 0 8.2-.7A4 4 0 0 0 23 16.5a41 41 0 0 0 0-9Z" />
      <path d="M10 15l5-3-5-3v6z" fill="#0B0B0C" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function SocialIcons({
  className = "",
  links = {
    linkedin: "#",
    x: "#",
    facebook: "#",
    youtube: "#",
    instagram: "#",
  },
}: {
  className?: string;
  links?: Partial<Record<"linkedin" | "x" | "facebook" | "youtube" | "instagram", string>>;
}) {
  const items: Item[] = [
    { href: links.linkedin ?? "#", label: "LinkedIn", icon: <IconLinkedIn /> },
    { href: links.x ?? "#", label: "X", icon: <IconX /> },
    { href: links.facebook ?? "#", label: "Facebook", icon: <IconFacebook /> },
    { href: links.youtube ?? "#", label: "YouTube", icon: <IconYouTube /> },
    { href: links.instagram ?? "#", label: "Instagram", icon: <IconInstagram /> },
  ];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={it.label}
          className="group rounded-full border border-altina-gold/50 bg-black/40 px-2 py-2 text-altina-ivory/90 transition hover:text-altina-gold hover:border-altina-gold/80"
        >
          <span className="block">{it.icon}</span>
        </a>
      ))}
    </div>
  );
}