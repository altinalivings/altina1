/*
 * ServicesGrid component
 *
 * Presents the core services offered by the channel partner. Each card
 * succinctly describes a key step: discovery, site visits and booking.
 */
const items = [
  {
    title: 'Project Discovery',
    body: 'We shortlist the right tower, floor and view based on your brief.',
  },
  {
    title: 'Site Visits',
    body: 'White‑glove slots, on‑time escorts, and transparent walkthroughs.',
  },
  {
    title: 'Allocation & Booking',
    body: 'Paperwork assistance and priority allocation windows on launches.',
  },
]

export default function ServicesGrid() {
  return (
    <div>
      <h2 className="h-serif text-2xl font-semibold">What we do</h2>
      <p className="text-muted mt-1">Advisory focused on fit, not push.</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {items.map((i) => (
          <div key={i.title} className="card p-5">
            <div className="text-lg font-semibold h-serif">{i.title}</div>
            <p className="text-white/80 mt-1">{i.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
