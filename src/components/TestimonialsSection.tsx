// src/components/TestimonialsSection.tsx
const items = [
  {
    q: "Altina guided us from shortlisting to possession. Super smooth experience throughout!",
    a: "Rohit & Nisha",
    project: "DLF Crest",
    rating: 5,
  },
  {
    q: "Great allocations and honest advice. They never pushed us into anything — truly transparent.",
    a: "Shivani M.",
    project: "Golf Course Extn.",
    rating: 5,
  },
  {
    q: "They got us an excellent deal and helped with the home loan too. One stop shop!",
    a: "Prakash G.",
    project: "Dwarka Expressway",
    rating: 5,
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`w-4 h-4 ${i < count ? "text-altina-gold" : "text-white/20"}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12" aria-labelledby="testimonials-heading">
      <div className="flex items-end justify-between mb-1">
        <h2 id="testimonials-heading" className="text-2xl font-semibold gold-text">What Clients Say</h2>
        <div className="hidden sm:flex items-center gap-1.5 text-sm text-neutral-400">
          <StarRating count={5} />
          <span>500+ Happy Families</span>
        </div>
      </div>
      <div className="golden-divider my-4" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((t, i) => (
          <figure
            key={i}
            className="golden-frame p-6 flex flex-col gap-3 hover:shadow-[0_8px_32px_rgba(191,149,63,0.12)] transition-shadow"
            itemScope
            itemType="https://schema.org/Review"
          >
            <StarRating count={t.rating} />
            <blockquote
              className="text-neutral-200 leading-relaxed flex-1"
              itemProp="reviewBody"
            >
              &ldquo;{t.q}&rdquo;
            </blockquote>
            <figcaption className="border-t border-white/10 pt-3">
              <div className="font-medium text-white text-sm" itemProp="author">{t.a}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{t.project}</div>
            </figcaption>
          </figure>
        ))}
      </div>
      {/* Trust signals */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-neutral-400">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-altina-gold" fill="currentColor">
            <path d="M12 2 3 6v6c0 5 6 8 9 10 3-2 9-5 9-10V6l-9-4z"/>
          </svg>
          RERA Compliant
        </div>
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-altina-gold" fill="currentColor">
            <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 12c-5.3 0-8 2.7-8 4v2h16v-2c0-1.3-2.7-4-8-4z"/>
          </svg>
          500+ Families Served
        </div>
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-altina-gold" fill="currentColor">
            <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm1-11V7h-2v6l4 2.5 1-1.7L13 11z"/>
          </svg>
          8+ Years Experience
        </div>
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-altina-gold" fill="currentColor">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-7 9H5v-2h8v2zm4-4H5V7h12v2z"/>
          </svg>
          Zero Buyer Fees
        </div>
      </div>
    </section>
  );
}
