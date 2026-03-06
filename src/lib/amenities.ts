// src/lib/amenities.ts
// Resolves amenity IDs to their labels & golden PNG icons from the global library.

import amenities from "@/data/amenities.json";

export type Amenity = {
  id: string;
  label: string;
  icon: string; // public path to golden PNG (e.g., /icons/pool.png)
};

// Build fast lookup map once
const AMENITY_MAP: Record<string, Amenity> = Object.fromEntries(
  (amenities as Amenity[]).map((a) => [a.id, a])
);

/**
 * Resolve a list of amenity IDs (e.g., ["pool","gym"]) to full objects.
 * Unknown IDs are ignored (filtered out).
 */
export function resolveAmenities(ids: string[] = []): Amenity[] {
  return ids.map((id) => AMENITY_MAP[id]).filter(Boolean) as Amenity[];
}

/**
 * Get a single amenity by ID (returns undefined if not found).
 */
export function getAmenity(id: string): Amenity | undefined {
  return AMENITY_MAP[id];
}

/**
 * Expose the whole library when needed (e.g., filters).
 */
export function getAllAmenities(): Amenity[] {
  return amenities as Amenity[];
}
