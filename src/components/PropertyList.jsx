"use client";
import React from "react";
import PropertyCard from "./PropertyCard";

export default function PropertyList({ projects }) {
  return (
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
  );
}
