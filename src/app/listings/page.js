import React from "react";
import PropertyCard from "../../components/PropertyCard";
import projects from "../../data/projects.json";

export default function ListingsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Featured Properties</h1>
      <p style={{ color: "#9aa4b2" }}>
        Hand-picked premium listings. Work with us as a channel partner to get exclusive deals.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 16,
          marginTop: 18,
        }}
      >
        {projects.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </main>
  );
}
