"use client";

export default function Testimonials() {
  const items = [
    {
      q: "They got us an allocation in the most sought-after tower within 48 hours.",
      n: "R. Sharma",
    },
    { q: "Transparent advice and excellent post-booking support.", n: "Neha & Arjun" },
    { q: "Good investment picks and quick site visits. Smooth paperwork.", n: "S. Mehra" },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((t) => (
        <figure key={t.n} className="card">
          <blockquote className="text-gray-800">“{t.q}”</blockquote>
          <figcaption className="mt-4 text-sm font-medium text-gray-600">— {t.n}</figcaption>
        </figure>
      ))}
    </div>
  );
}
