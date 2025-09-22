/*
 * Testimonials component
 *
 * Displays short client testimonials to build trust. These are simple cards
 * with quoted feedback and a client name. You can expand this section with
 * real client stories or integrate a slider later.
 */
const items = [
  {
    name: 'Ankit S.',
    text: 'Clear answers. Smooth site visit and a fair perspective on the pros & cons.',
  },
  {
    name: 'Richa M.',
    text: 'They shortlisted 3 options; we booked one after a single visit. No pressure.',
  },
  {
    name: 'Karan J.',
    text: 'Knew the inventory cold and helped secure a better view + floor.',
  },
]

export default function Testimonials() {
  return (
    <div>
      <h2 className="h-serif text-2xl font-semibold">What clients say</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {items.map((t) => (
          <div key={t.name} className="card p-5">
            <p className="text-white/90">“{t.text}”</p>
            <div className="text-white/70 text-sm mt-3">— {t.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}