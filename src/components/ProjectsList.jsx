"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { iconForAmenity } from "@/lib/amenityIcons";

function AmenityBadges({ amenities = [], take = 3 }) {
  const router = useRouter();
  const list = Array.isArray(amenities) ? amenities.slice(0, take) : [];
  if (!list.length) return null;

  const goToAmenity = (label) => {
    const name = typeof label === "string" ? label : label?.name || "";
    if (!name) return;
    // Navigate to projects page with amenity filter
    router.push(`/projects?amenity=${encodeURIComponent(name)}`);
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {list.map((raw, i) => {
        const label = typeof raw === "string" ? raw : raw?.name || "";
        const Icon = iconForAmenity(label);
        return (
          <button
            key={`${label}-${i}`}
            type="button"
            title={`Filter by ${label}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // prevent parent card <Link> navigation
              goToAmenity(label);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white/70 px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-teal-50 hover:border-teal-200"
          >
            <Icon className="h-3.5 w-3.5 text-teal-600" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function ProjectsList({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <Link
          key={p.id}
          href={`/projects/${p.id}`}
          className="group overflow-hidden rounded-2xl border transition-shadow hover:shadow-md"
        >
          <div className="relative aspect-[16/10]">
            {p.badge && (
              <span className="absolute left-3 top-3 z-10 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">
                {p.badge}
              </span>
            )}
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold leading-snug">{p.name}</h3>
              {p.typology && (
                <span className="shrink-0 rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700">
                  {p.typology}
                </span>
              )}
            </div>

            {p.location && (
              <p className="mt-1 text-sm text-gray-600">{p.location}</p>
            )}

            <div className="mt-2 flex items-center justify-between">
              {p.priceNumeric != null ? (
                <p className="text-sm font-semibold">
                  ₹ {(Number(p.priceNumeric) / 100).toFixed(1)} Cr
                </p>
              ) : (
                <span className="text-sm text-gray-500">Price on request</span>
              )}
              {p.status && (
                <span className="rounded-md border border-gray-200 px-2 py-0.5 text-[11px] text-gray-700">
                  {p.status}
                </span>
              )}
            </div>

            {/* NEW: first 3 amenities with icons (click to filter) */}
            <AmenityBadges amenities={p.amenities} take={3} />
          </div>
        </Link>
      ))}
    </div>
  );
}
