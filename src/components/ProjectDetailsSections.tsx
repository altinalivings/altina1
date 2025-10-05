"use client";

import Link from "next/link";

/* -------------------------------------------------------
 * GOLD “AT-A-GLANCE” STRIP
 * Pulls from projects.json:
 * - price
 * - possession (falls back to status)
 * - nearby.connectivity[0] (falls back to location/city)
 * ----------------------------------------------------- */
export function GlanceBar({ p }: { p: any }) {
  const price = p?.price || "Price on request";
  const possession = p?.possession || p?.status || "TBA";

  const firstConn = Array.isArray(p?.nearby?.connectivity)
    ? p.nearby.connectivity[0]
    : null;
  const connectivity =
    (firstConn?.label
      ? `${firstConn.label}${firstConn.time ? ` • ${firstConn.time}` : ""}`
      : "") || p?.location || p?.city || "Great connectivity";

  return (
    <section className="max-w-6xl mx-auto px-4 mt-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Price", value: price },
          { label: "Possession / Status", value: possession },
          { label: "Connectivity", value: connectivity },
        ].map((it, i) => (
          <div
            key={i}
            className="rounded-2xl p-[1px] bg-gradient-to-b from-[#C5A657]/70 to-[#8E6F2D]/40"
            style={{ boxShadow: "0 0 0 1px rgba(197,166,87,0.35) inset" }}
          >
            <div className="rounded-2xl px-5 py-4 bg-[#0E0E0E]">
              <div className="text-xs tracking-wide text-[#C5A657]">
                {it.label}
              </div>
              <div className="mt-1 text-lg font-semibold">{it.value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------
 * FAQs — kept simple and theme-consistent
 * Expects an array of { q, a }
 * ----------------------------------------------------- */
export function FAQsSection({
  items,
  heading = "Frequently Asked Questions",
}: {
  items: { q: string; a: string }[];
  heading?: string;
}) {
  if (!items?.length) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 mt-10">
      <h2 className="text-xl font-semibold mb-4 text-[#C5A657]">
        {heading}
      </h2>
      <div className="divide-y divide-white/10 rounded-2xl overflow-hidden border border-white/10">
        {items.map((f, idx) => (
          <details key={idx} className="bg-[#0F0F0F] group">
            <summary className="cursor-pointer list-none px-4 py-4 hover:bg-white/[0.03]">
              <span className="text-base">{f.q}</span>
            </summary>
            <div className="px-4 pb-5 text-neutral-300">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------
 * Related Projects — minimal (keeps gold look)
 * Pass { text, href }
 * ----------------------------------------------------- */
export function RelatedProjects({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  return (
    <section className="max-w-6xl mx-auto px-4 mt-8">
      <div className="rounded-2xl border border-white/10 bg-[#0E0E0E] p-5 flex items-center justify-between">
        <div>
          <div className="text-[#C5A657] text-sm mb-1">Related projects</div>
          <div className="text-neutral-300">{text}</div>
        </div>
        <Link
          href={href}
          className="rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            color: "#0D0D0D",
            background:
              "linear-gradient(180deg, rgba(255,246,214,0.92) 0%, rgba(255,246,214,0.8) 100%)",
            boxShadow: "0 0 0 1px rgba(197,166,87,0.45) inset",
          }}
        >
          View all projects
        </Link>
      </div>
    </section>
  );
}
