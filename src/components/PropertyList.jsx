
"use client";
import React from "react";
import PropertyCard from "./PropertyCard";

export default function PropertyList({ projects }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
      gap: 16
    }}>
      {projects.map(p => <PropertyCard key={p.id} property={p} />)}
    </div>
  );
}
