// src/data/amenities.ts

type Amenity = {
  id: string;
  label: string;
  icon: string;
};

const AMENITIES: Amenity[] = [
  { id: "garden", label: "Landscape Gardens", icon: "/icons/garden.png" },
  { id: "parking", label: "Parking", icon: "/icons/parking.png" },
  { id: "power", label: "Power Backup", icon: "/icons/power.png" },

  { id: "clubhouse",   label: "Clubhouse",          icon: "/icons/clubhouse.png" },
  { id: "pool",        label: "Swimming Pool",      icon: "/icons/pool.png" },
  { id: "gym",         label: "Gymnasium",          icon: "/icons/gym.png" },
  { id: "spa",         label: "Spa & Sauna",        icon: "/icons/spa.png" },
  { id: "yoga",        label: "Yoga Deck",          icon: "/icons/yoga.png" },
  { id: "jogging",     label: "Jogging Track",      icon: "/icons/jogging.png" },
  { id: "kids",        label: "Kids Play Area",     icon: "/icons/kids.png" },
  { id: "tennis",      label: "Tennis Court",       icon: "/icons/tennis.png" },
  { id: "basketball",  label: "Basketball Court",   icon: "/icons/basketball.png" },
  { id: "cricket",     label: "Cricket Net",        icon: "/icons/cricket.png" },
  { id: "theatre",     label: "Mini Theatre",       icon: "/icons/theatre.png" },
  { id: "cowork",      label: "Co-working Lounge",  icon: "/icons/cowork.png" },
  { id: "smart",       label: "Smart Home",         icon: "/icons/smarthome.png" },
  { id: "security",    label: "24×7 Security",      icon: "/icons/security.png" },
  { id: "powerbackup", label: "Power Backup",       icon: "/icons/power.png" },
  { id: "multipurpose",label: "Multipurpose Hall",  icon: "/icons/hall.png" },
  { id: "library",     label: "Library",            icon: "/icons/library.png" },
  { id: "salon",       label: "Salon",              icon: "/icons/salon.png" }
]
 

export function resolveAmenities(ids: string[]): Amenity[] {
  return ids
    .map((id) => AMENITIES.find((a) => a.id === id))
    .filter((a): a is Amenity => Boolean(a));
}
