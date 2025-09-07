// src/lib/amenityIcons.js
import * as Icons from "lucide-react";

// Helper: safely pick a lucide icon by name; fallback to Circle if missing
const pick = (name) => (Icons && Icons[name] ? Icons[name] : Icons.Circle);

// Canonical labels → icon *names* (strings). No named imports = no import errors.
const MAP = {
  // Security & Access
  "24x7 Security": "Shield",
  "CCTV": "Camera",
  "Gated Access": "Lock",
  "Smart Entry": "Key",

  // Health & Fitness
  "Gym": "Dumbbell",
  "Health Club": "HeartPulse",
  "Jogging Track": "Footprints",
  "Cycling Track": "Bike",
  "Yoga Deck": "PersonStanding",
  "Sports": "Activity",

  // Outdoors & Greenery
  "Garden": "Leaf",
  "Roof Garden": "Leaf",
  "Landscaped Greens": "Trees",
  "Nature Trail": "Flower2",
  "Open Spaces": "Sun",
  "Scenic Views": "Mountain",

  // Recreation & Lifestyle
  "Banquet Hall": "Building2",
  "Clubhouse": "Building2",
  "Indoor Games": "Gamepad2",
  "Amphitheatre": "Music2",
  "Lounge": "Wine",
  "Mini Theatre": "Clapperboard",

  // Family & Kids
  "Kids Play Area": "Baby",
  "Daycare": "School",
  "Library": "BookOpen",
  "Community Hall": "Users",

  // Water & Leisure
  "Swimming Pool": "Waves",
  "Water Features": "Droplet",
  "Spa": "ShowerHead",

  // Business & Utilities
  "Business Centre": "Briefcase",
  "Co-working Lounge": "Laptop",
  "Parking": "Car",
  "EV Charging": "PlugZap",
  "Power Backup": "BatteryCharging",

  // Retail & Convenience
  "Retail Plaza": "ShoppingBag",
  "Convenience Store": "Store",
  "Café": "Coffee",

  // Infrastructure
  "High-rise Towers": "Building2",  // ← NOT "Tower"
  "Commercial Spaces": "Factory",
  "Climate Control": "Thermometer",
};

export const defaultAmenityIcon = Icons.Circle;

// Case/space tolerant resolver
export function iconForAmenity(label) {
  if (!label || typeof label !== "string") return defaultAmenityIcon;
  const normalized = label.trim().toLowerCase();
  const hit = Object.keys(MAP).find((k) => k.toLowerCase() === normalized);
  return pick(hit ? MAP[hit] : "Circle");
}

// Optional: export a ready map of components if you prefer iterating it
export const amenityIcons = Object.fromEntries(
  Object.entries(MAP).map(([k, v]) => [k, pick(v)])
);
