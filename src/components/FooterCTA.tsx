// src/components/FooterCTA.tsx
"use client";
import UnifiedLeadDialog from "@/components/UnifiedLeadDialog";

type Accent = "gold" | "ivory" | "orange";

/** Top call-to-action band shown above the footer columns */
export default function FooterCTA({
  phone = "+91 98912 34195",
  heading = "Call Us @",
  accent = "ivory",
}: {
  phone?: string;
  heading?: string;
  accent?: Accent;
}) {
  const band =
    accent === "ivory"
      ? "bg-[#F6F3E7] text-[#0E0E10]"
      : accent === "orange"
      ? "bg-[#E07A2E] text-black"
      : "bg-[var(--accent)] text-black"; // gold (theme token)

  return (
    <section className={`w-full ${band}`}>
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 items-center gap-6">
        <div className="text-center md:text-left text-2xl sm:text-3xl font-semibold tracking-tight">
          {heading} {phone}
        </div>
        <div className="flex md:justify-end justify-center">
          <UnifiedLeadDialog ctaLabel="Request Call" variant="callback" />
        </div>
      </div>
    </section>
  );
}
