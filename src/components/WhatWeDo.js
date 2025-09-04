export default function WhatWeDo() {
  const items = [
    { title: "Property Consulting", text: "Helping you choose the right investment or dream home." },
    { title: "Project Promotion", text: "Marketing premium residential & commercial projects." },
    { title: "Channel Partnerships", text: "Exclusive ties with DLF, M3M, Sobha & Godrej." }
  ];
  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title">What We Do</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(it => (
            <div key={it.title} className="rounded-xl bg-white border shadow-sm p-6 text-center">
              <div className="font-semibold">{it.title}</div>
              <p className="text-sm text-gray-600 mt-2">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
