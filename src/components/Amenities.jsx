"use client";
import { iconForAmenity } from "@/lib/amenityIcons";

export default function Amenities({ items = [] }) {
  if (!items?.length) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((raw, i) => {
        const label = typeof raw === "string" ? raw : raw?.name || "";
        const Icon = iconForAmenity(label);
        return (
          <li key={`${label}-${i}`} className="flex items-center gap-2 text-gray-800">
            <Icon className="h-5 w-5 text-teal-600" />
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
