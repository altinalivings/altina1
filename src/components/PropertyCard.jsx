// src/components/PropertyCard.jsx
"use client";
import React from "react";

export default function PropertyCard({ property }) {
  const { title, price, area, type_of_property, amenities, image, id, brochure } = property;

  return (
    <div
      className="property-card"
      style={{
        background: "#07101a",
        padding: 16,
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
      }}
    >
      {/* Image */}
      <div style={{ height: 160, overflow: "hidden", borderRadius: 8, marginBottom: 12 }}>
        <img
          src={image}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Title & Info */}
      <h3 style={{ margin: "6px 0" }}>{title}</h3>
      <div style={{ color: "#9aa4b2", fontSize: 14, marginBottom: 8 }}>
        {type_of_property} • {area}
      </div>
      <div style={{ fontWeight: 800, color: "#e9a826", marginBottom: 8 }}>{price}</div>

      {/* Amenities */}
      <div style={{ fontSize: 13, color: "#9aa4b2", marginBottom: 12 }}>
        {amenities &&
          amenities.slice(0, 3).map((a) => (
            <span key={a} style={{ marginRight: 8 }}>
              {a}
            </span>
          ))}
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 8 }}>
        <a href={`/listings/${id}`} className="btn" style={{ flex: 1, textAlign: "center" }}>
          View
        </a>
        {brochure && (
          <a
            href={brochure}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-secondary"
            style={{ flex: 1, textAlign: "center" }}
          >
            Brochure
          </a>
        )}
      </div>
    </div>
  );
}
