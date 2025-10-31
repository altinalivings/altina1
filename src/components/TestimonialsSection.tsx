// src/components/TestimonialsSection.tsx
const items = [
  { q: "Altina guided us from shortlisting to possession. Super smooth!", a: "Rohit & Nisha, DLF Crest" },
  { q: "Great allocations and honest advice. Highly recommended.", a: "Shivani M., Golf Course Extn." },
  { q: "They got us an excellent deal and helped with the loan too.", a: "Prakash G., Dwarka Expressway" },
];
export default function TestimonialsSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold">What Clients Say</h2>
      <div className="golden-divider my-4" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((t, i) => (
          <div key={i} className="golden-frame p-6">
            <p className="text-neutral-200">&ldquo;{t.q}&rdquo;</p>
            <p className="text-sm text-neutral-400 mt-3">— {t.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}