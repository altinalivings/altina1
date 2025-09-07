"use client";

export default function PremiumServices() {
  const items = [
    { title: "Property Consulting", text: "Helping you choose the right investment or dream home." },
    { title: "Project Promotion", text: "Marketing premium residential & commercial projects." },
    { title: "Channel Partnerships", text: "Exclusive ties with DLF, M3M, Sobha & Godrej." },
    { title: "Priority Allotment", text: "Access hot stacks on Day 0." },
    { title: "NRI Desk", text: "End-to-end support incl. remittances." },
    { title: "RERA Verified", text: "Compliance-first processes." },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((f) => (
        <div key={f.title} className="card-gold">
          <h3 className="text-base font-semibold bg-gradient-to-r from-[#c5a250] to-[#e0c070] bg-clip-text text-transparent">
            {f.title}
          </h3>
          <p className="mt-2 text-sm text-gray-600">{f.text}</p>
        </div>
      ))}
    </div>
  );
}
