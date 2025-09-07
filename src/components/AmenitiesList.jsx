"use client";
import AmenityIcon from "./AmenityIcon";

export default function AmenitiesList({ items = [] }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
      {items.map((a) => (
        <li
          key={a}
          className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm text-gray-800"
        >
          <AmenityIcon name={a} className="h-4 w-4 text-teal-700" />
          <span>{a}</span>
        </li>
      ))}
    </ul>
  );
}
