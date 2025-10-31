// src/components/ServicesWeOffer.tsx
type Props = { size?: 'default' | 'compact' };
export default function ServicesWeOffer({ size = 'default' }: Props) {
  const isCompact = size === 'compact';
  const items = [
    { title: "Apartments", desc: "Premium 2/3/4BHK residences across top micro‑markets.", icon: (
      <svg viewBox="0 0 24 24" className={isCompact ? "h-6 w-6" : "h-7 w-7"}><path fill="currentColor" d="M3 3h18v18H3V3Zm2 2v14h6V5H5Zm8 0v4h4V5h-4Zm4 6h-4v8h4v-8Z" /></svg>
    )},
    { title: "Villas & Floors", desc: "Low‑density living with private terraces and amenities.", icon: (
      <svg viewBox="0 0 24 24" className={isCompact ? "h-6 w-6" : "h-7 w-7"}><path fill="currentColor" d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3L12 3Z" /></svg>
    )},
    { title: "Plots", desc: "Secure investments with clear titles in planned townships.", icon: (
      <svg viewBox="0 0 24 24" className={isCompact ? "h-6 w-6" : "h-7 w-7"}><path fill="currentColor" d="M3 3h18v18H3V3Zm2 2v8h6V5H5Zm0 10v4h14v-4H5Zm8-10v8h6V5h-6Z" /></svg>
    )},
    { title: "Commercial", desc: "Grade‑A offices and retail for yield‑led portfolios.", icon: (
      <svg viewBox="0 0 24 24" className={isCompact ? "h-6 w-6" : "h-7 w-7"}><path fill="currentColor" d="M3 13h18v8H3v-8Zm2 2v4h6v-4H5Zm8 0v4h6v-4h-6ZM7 3h10v8H7V3Zm2 2v4h6V5H9Z" /></svg>
    )},
    { title: "NRI Advisory", desc: "Remote bookings, POA, taxation and repatriation support.", icon: (
      <svg viewBox="0 0 24 24" className={isCompact ? "h-6 w-6" : "h-7 w-7"}><path fill="currentColor" d="M12 2a5 5 0 1 1-5 5 5 5 0 0 1 5-5Zm-9 18a9 9 0 0 1 18 0H3Z" /></svg>
    )},
    { title: "Home Loans", desc: "Best‑rate financing with quick approvals from leading banks.", icon: (
      <svg viewBox="0 0 24 24" className={isCompact ? "h-6 w-6" : "h-7 w-7"}><path fill="currentColor" d="M12 3 2 12h3v8h14v-8h3L12 3Zm0 7a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z" /></svg>
    )},
  ];

  return (
    <section className={"max-w-6xl mx-auto px-4 " + (isCompact ? "py-8" : "py-12")}>
      {!isCompact && (
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold">Services we offer</h2>
          <div className="golden-divider my-4" />

          <p className="text-neutral-300 max-w-2xl mx-auto">From discovery to possession—advice, inventory access and concierge‑level execution.</p>
        </div>
      )}
      <div className={(isCompact ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8")}>
        {items.map((it) => (
          <div key={it.title} className={"golden-frame modal-surface " + (isCompact ? "p-4" : "p-5")}>
            <div className="flex items-start gap-3">
              <div className="text-amber-300/90 shrink-0">{it.icon}</div>
              <div>
                <h3 className="font-medium">{it.title}</h3>
                <p className={"mt-1 text-neutral-300 " + (isCompact ? "text-[13px]" : "text-sm")}>{it.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}