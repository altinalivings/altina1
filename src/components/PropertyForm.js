// src/components/PropertyForm.jsx
import React, { useState } from "react";

export default function PropertyForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    amenities: [],
    cost: "",
    area: "",
    type: "",
  });
  const [floorplan, setFloorplan] = useState(null);
  const [brochure, setBrochure] = useState(null);

  const amenityOptions = ["Pool", "Gym", "Parking", "Garden", "Clubhouse", "Security"];

  function toggleAmenity(a) {
    setForm((prev) => {
      const has = prev.amenities.includes(a);
      return { ...prev, amenities: has ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a] };
    });
  }

  async function submit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("phone", form.phone);
    data.append("cost", form.cost);
    data.append("area", form.area);
    data.append("type", form.type);
    data.append("amenities", JSON.stringify(form.amenities));
    if (floorplan) data.append("floorplan", floorplan);
    if (brochure) data.append("brochure", brochure);

    // POST to your API route
    const res = await fetch("/api/property-lead", {
      method: "POST",
      body: data,
    });

    const json = await res.json().catch(() => ({ ok: false }));
    if (onSubmit) onSubmit(json);
    if (window.site && window.site.showToast) window.site.showToast("Submitted — thank you");
  }

  return (
    <form onSubmit={submit} className="lead-form" style={{ maxWidth: 760 }}>
      <div style={{ display: "grid", gap: 10 }}>
        <input name="name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Amenities (select multiple):</label>
          <div>
            {amenityOptions.map((a) => (
              <label key={a} style={{ marginRight: 12 }}>
                <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} /> {a}
              </label>
            ))}
          </div>
        </div>
        <input name="cost" placeholder="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
        <input name="area" placeholder="Area (sq ft)" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
        <input name="type" placeholder="Type of property" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
        <div>
          <label>Floorplan (PDF/image)</label>
          <input type="file" name="floorplan" onChange={(e) => setFloorplan(e.target.files[0])} />
        </div>
        <div>
          <label>Brochure (PDF)</label>
          <input type="file" name="brochure" onChange={(e) => setBrochure(e.target.files[0])} />
        </div>
        <button type="submit" className="btn">Send Enquiry</button>
      </div>
    </form>
  );
}
