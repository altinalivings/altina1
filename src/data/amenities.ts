// src/data/amenities.ts

type Amenity = {
  id: string;
  label: string;
  icon: string;
};

const AMENITIES: Amenity[] = [
  {
    "id": "clubhouse",
    "label": "Clubhouse",
    "icon": "/icons/clubhouse.svg"
  },
  {
    "id": "pool",
    "label": "Swimming Pool",
    "icon": "/icons/pool.svg"
  },
  {
    "id": "gym",
    "label": "Gymnasium",
    "icon": "/icons/gym.svg"
  },
  {
    "id": "spa",
    "label": "Spa & Sauna",
    "icon": "/icons/spa.svg"
  },
  {
    "id": "yoga",
    "label": "Yoga Deck",
    "icon": "/icons/yoga.svg"
  },
  {
    "id": "jogging",
    "label": "Jogging Track",
    "icon": "/icons/jogging.svg"
  },
  {
    "id": "kids",
    "label": "Kids Play Area",
    "icon": "/icons/kids.svg"
  },
  {
    "id": "tennis",
    "label": "Tennis Court",
    "icon": "/icons/tennis.svg"
  },
  {
    "id": "basketball",
    "label": "Basketball Court",
    "icon": "/icons/basketball.svg"
  },
  {
    "id": "cricket",
    "label": "Cricket Net",
    "icon": "/icons/cricket.svg"
  },
  {
    "id": "theatre",
    "label": "Mini Theatre",
    "icon": "/icons/theatre.svg"
  },
  {
    "id": "cowork",
    "label": "Co-working Lounge",
    "icon": "/icons/cowork.svg"
  },
  {
    "id": "smart",
    "label": "Smart Home",
    "icon": "/icons/smart_home.svg"
  },
  {
    "id": "security",
    "label": "24\u00d77 Security",
    "icon": "/icons/security.svg"
  },
  {
    "id": "powerbackup",
    "label": "Power Backup",
    "icon": "/icons/power_backup.svg"
  },
  {
    "id": "multipurpose",
    "label": "Multipurpose Hall",
    "icon": "/icons/multipurpose_hall.svg"
  },
  {
    "id": "library",
    "label": "Library",
    "icon": "/icons/library.svg"
  },
  {
    "id": "salon",
    "label": "Salon",
    "icon": "/icons/salon.svg"
  },
  {
    "id": "gardens",
    "label": "Landscaped Gardens",
    "icon": "/icons/gardens.svg"
  },
  {
    "id": "parking",
    "label": "Parking",
    "icon": "/icons/parking.svg"
  },
  {
    "id": "wifi",
    "label": "Wi\u2011Fi",
    "icon": "/icons/wifi.svg"
  },
  {
    "id": "concierge",
    "label": "Concierge",
    "icon": "/icons/concierge.svg"
  },
  {
    "id": "indoor",
    "label": "Indoor Games",
    "icon": "/icons/indoor_games.svg"
  },
  {
    "id": "cycling",
    "label": "Cycling Track",
    "icon": "/icons/cycling_track.svg"
  },
  {
    "id": "petpark",
    "label": "Pet Park",
    "icon": "/icons/pet_park.svg"
  },
  {
    "id": "cafeteria",
    "label": "Cafeteria",
    "icon": "/icons/cafeteria.svg"
  },
  {
    "id": "banquet",
    "label": "Banquet",
    "icon": "/icons/banquet.svg"
  },
  {
    "id": "retail",
    "label": "Retail",
    "icon": "/icons/retail.svg"
  },
  {
    "id": "dining",
    "label": "Dining Options",
    "icon": "/icons/dining.svg"
  },
  {
    "id": "rooftop",
    "label": "Rooftop Lounge",
    "icon": "/icons/rooftop.svg"
  }
]
 

export function resolveAmenities(ids: string[]): Amenity[] {
  return ids
    .map((id) => AMENITIES.find((a) => a.id === id))
    .filter((a): a is Amenity => Boolean(a));
}
