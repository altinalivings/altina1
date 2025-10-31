// src/components/LocationsSection.tsx
const areas = [
  { t: "Gurgaon", s: "Golf Course Road, Golf Course Extn., Dwarka Expressway, Southern Peripheral Road" },
  { t: "New Delhi", s: "Central & South Delhi select micro-markets" },
  { t: "Noida", s: "Noida Expressway, Sector 150 belt" },
  { t: "Greater Noida (W)", s: "Emerging residential pockets" },
  { t: "Faridabad", s: "Select luxury townships" },
  { t: "Sohna", s: "South of Gurgaon developments" },
];
export default function LocationsSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold">Locations We Serve</h2>
      <div className="golden-divider my-4" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((a) => (
          <div key={a.t} className="golden-frame p-6">
            <h3 className="font-semibold">{a.t}</h3>
            <p className="text-neutral-300 mt-1">{a.s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
