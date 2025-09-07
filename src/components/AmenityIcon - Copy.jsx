"use client";
import {
  Bath, Dumbbell, Trees, ShieldCheck, Baby,
  Crown, Building2, Coffee, Footprints, Activity,
  Wind, BedDouble, MapPin, Users, DoorClosed,
  Utensils, Waves, Shield, DoorOpen, Sun,
  Leaf, Film, HeartPulse
} from "lucide-react";

/** Map amenity keyword → icon */
const MAP = [
  { k: ["gym", "fitness"], I: Dumbbell },
  { k: ["pool", "infinity"], I: Waves },
  { k: ["spa"], I: HeartPulse },
  { k: ["kids", "play"], I: Baby },
  { k: ["tennis"], I: Activity },
  { k: ["jogging", "track"], I: Footprints },
  { k: ["clubhouse", "club"], I: Crown },
  { k: ["banquet", "hall"], I: Users },
  { k: ["co-working", "cowork", "work"], I: Building2 },
  { k: ["security"], I: ShieldCheck },
  { k: ["yoga"], I: Wind },
  { k: ["garden", "green"], I: Trees },
  { k: ["cinema", "theatre"], I: Film },
  { k: ["parking", "car"], I: DoorClosed },
  { k: ["restaurant", "cafe"], I: Utensils },
  { k: ["sun deck", "deck"], I: Sun },
  { k: ["eco", "igbc", "green"], I: Leaf },
  { k: ["bath"], I: Bath },
  { k: ["bed"], I: BedDouble },
  { k: ["lobby"], I: DoorOpen },
  { k: ["map", "location"], I: MapPin },
  { k: ["shield"], I: Shield },
  { k: ["coffee"], I: Coffee },
];

export default function AmenityIcon({ name = "", className = "h-4 w-4" }) {
  const lower = String(name).toLowerCase();
  const match = MAP.find(({ k }) => k.some((t) => lower.includes(t)));
  const Icon = match?.I || Crown; // fallback
  return <Icon className={className} aria-hidden="true" />;
}
