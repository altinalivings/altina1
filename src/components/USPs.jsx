"use client";

export default function USPs() {
  const items = [
    { t: "Priority Allotment", d: "Pre-launch and Day-0 access in high-demand towers." },
    { t: "Advisory to Possession", d: "Shortlists, site visits, negotiations, paperwork." },
    { t: "Investment Grade", d: "Focused on rental yield & appreciation potential." },
    { t: "NRI Desk", d: "End-to-end support incl. remittances & documentation." },
    { t: "Transparent Process", d: "RERA compliant, price discovery and clean paperwork." },
    { t: "Developer Partnerships", d: "DLF, M3M, Sobha & Godrej allocations." },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((x) => (
        <div key={x.t} className="card">
          <h3 className="h3">{x.t}</h3>
          <p className="mt-2 text-sm text-gray-600">{x.d}</p>
        </div>
      ))}
    </div>
  );
}
