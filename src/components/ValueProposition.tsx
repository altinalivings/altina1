// src/components/ValueProposition.tsx
type Props = { size?: 'default' | 'compact' };
export default function ValueProposition({ size = 'default' }: Props) {
  const isCompact = size === 'compact';
  const items = [
    {
      title: "Curated Luxury Launches",
      desc: "Only hand‑picked projects from Delhi NCR’s most trusted developers.",
      icon: (
        <svg viewBox="0 0 24 24" className={isCompact ? "h-5 w-5" : "h-6 w-6"}>
          <path fill="currentColor" d="M12 2 2 7l10 5 10-5-10-5Zm0 9L2 6v11l10 5 10-5V6l-10 5Z" />
        </svg>
      ),
    },
    {
      title: "Developer Relationships",
      desc: "Preferred channel partner access for inventory, pricing and allotments.",
      icon: (
        <svg viewBox="0 0 24 24" className={isCompact ? "h-5 w-5" : "h-6 w-6"}>
          <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-9 9a9 9 0 0 1 18 0H3Z" />
        </svg>
      ),
    },
    {
      title: "Transparent Advice",
      desc: "Clear comparisons, paperwork guidance and zero hidden fees.",
      icon: (
        <svg viewBox="0 0 24 24" className={isCompact ? "h-5 w-5" : "h-6 w-6"}>
          <path fill="currentColor" d="M21 7 9 19l-6-6 2-2 4 4 10-10 2 2Z" />
        </svg>
      ),
    },
    {
      title: "RERA & Compliance",
      desc: "Thorough documentation checks. All imagery for representation only.",
      icon: (
        <svg viewBox="0 0 24 24" className={isCompact ? "h-5 w-5" : "h-6 w-6"}>
          <path fill="currentColor" d="M12 2 3 6v6c0 5 6 8 9 10 3-2 9-5 9-10V6l-9-4Zm0 4 5 2.2V12c0 3.1-3.1 5.2-5 6.4-1.9-1.2-5-3.3-5-6.4V8.2L12 6Z" />
        </svg>
      ),
    },
    {
      title: "Concierge Experience",
      desc: "Site visits, finance connects and negotiations handled end‑to‑end.",
      icon: (
        <svg viewBox="0 0 24 24" className={isCompact ? "h-5 w-5" : "h-6 w-6"}>
          <path fill="currentColor" d="M12 2a7 7 0 0 1 7 7v1h2v2h-2v6a2 2 0 0 1-2 2h-3v-2h3v-6H7v6h3v2H7a2 2 0 0 1-2-2v-6H3v-2h2V9a7 7 0 0 1 7-7Z" />
        </svg>
      ),
    },
    {
      title: "Post‑Sale Support",
      desc: "From allotment to possession—updates, reminders and documentation.",
      icon: (
        <svg viewBox="0 0 24 24" className={isCompact ? "h-5 w-5" : "h-6 w-6"}>
          <path fill="currentColor" d="M12 22a10 10 0 1 1 7.07-2.93L12 12v10Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className={"max-w-6xl mx-auto px-4 " + (isCompact ? "py-8" : "py-12")}>
      <div className="text-center">
        {!isCompact && (
          <>
            <h2 className="text-2xl sm:text-3xl font-semibold">Why choose <span className="tracking-wider">ALTINA™</span></h2>
            <div className="golden-divider my-4" />
            <p className="text-neutral-300 max-w-2xl mx-auto">
              Premium channel partner for luxury real estate across Delhi NCR. We bring access, clarity and a white‑glove journey from discovery to possession.
            </p>
          </>
        )}
      </div>

      <div className={(isCompact ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8")}>
        {items.map((it) => (
          <div key={it.title} className={"golden-frame modal-surface " + (isCompact ? "p-4" : "p-5") + " flex items-start gap-3"}>
            <div className="text-amber-300/90">{it.icon}</div>
            <div>
              <h3 className="font-medium">{it.title}</h3>
              <p className={"text-neutral-300 mt-1 " + (isCompact ? "text-[13px]" : "text-sm")}>{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}