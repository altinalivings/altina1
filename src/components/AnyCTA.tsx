// src/components/AnyCTA.tsx
"use client";

type AnyCTAProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  variant?: "gold" | "emerald" | "neutral";
};

export default function AnyCTA({
  label,
  onClick,
  className,
  variant = "gold",
}: AnyCTAProps) {
  const styleBase =
    "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium tracking-wide";
  const variants: Record<typeof variant, string> = {
    gold:
      "border border-amber-400/45 bg-black/70 backdrop-blur text-white hover:bg-amber-400/15",
    emerald:
      "border border-emerald-400/45 bg-black/70 backdrop-blur text-white hover:bg-emerald-400/15",
    neutral:
      "border border-white/15 bg-black/70 backdrop-blur text-white hover:bg-white/10",
  };
  const style = `${styleBase} ${variants[variant]} ${className ?? ""}`.trim();

  const fire = () => {
    try {
      onClick?.();
    } catch {
      /* no-op */
    }
  };

  return (
    <button type="button" className={style} onClick={fire}>
      {label}
    </button>
  );
}
