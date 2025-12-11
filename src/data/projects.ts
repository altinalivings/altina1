// src/data/projects.ts
// Auto-generated projects configuration for Altina Livings

export type Project = {
  id: string;
  slug: string;
  name: string;
  developer?: string;
  brand?: string;
  rating?: number;
  location?: string;
  city?: string;
  state?: string;
  sector?: string;
  micro_market?: string;
  rera?: string;
  status?: string;
  construction_status?: string;
  possession?: string;
  launch?: string;
  price?: string;
  configuration?: string;
  typologies?: string[];
  sizes?: string;
  land_area?: string;
  towers?: number;
  floors?: string;
  total_units?: string | number;
  usp?: string[];
  highlights?: string[];
  amenities?: string[];
  hero?: string;
  heroAlt?: string;
  gallery?: string[];
  map?: { embed?: string; lat?: number; lng?: number };
  seo?: { title?: string; description?: string; canonical?: string };
  featured?: boolean;
  featured_order?: number;
  description?: string;
};

const projects: Project[] = [
  {
    id: "dlf-one-midtown",
    slug: "dlf-one-midtown-moti-nagar",
    name: "DLF One Midtown",
    developer: "DLF",
    brand: "DLF",
    rating: 4.7,
    location: "Shivaji Marg, Moti Nagar, West Delhi",
    city: "New Delhi",
    state: "Delhi",
    sector: "Moti Nagar",
    micro_market: "Central-West Delhi",
    rera: "DLRERA2021P0007",
    status: "Ready to Move",
    construction_status: "Completed",
    possession: "2024",
    launch: "2021",
    price: "₹4.7 Cr onwards",
    configuration: "2, 3 & 4 BHK Residences",
    typologies: ["2 BHK", "3 BHK", "4 BHK + SQ"],
    sizes: "1,732 – 3,000 sq.ft.",
    land_area: "≈ 5.1 acres",
    towers: 4,
    floors: "G+39",
    total_units: "≈ 915 apartments",
    usp: [
      "Central Delhi–adjacent luxury address on Shivaji Marg",
      "Surrounded by large landscaped greens (DLF Capital Greens belt)",
      "International quality clubhouse & amenities",
    ],
    highlights: [
      "Multiple metro connectivity – Moti Nagar & Kirti Nagar",
      "Low-density luxury community with high-rise views",
    ],
    amenities: [
      "Clubhouse",
      "Swimming Pool",
      "Gymnasium",
      "Kids’ Play Area",
      "Jogging Track",
      "Landscaped Gardens",
      "24x7 Security",
    ],
    hero: "/projects/dlf-one-midtown/hero.jpg",
    heroAlt: "DLF One Midtown towers with landscaped greens in Moti Nagar",
    gallery: [
      "/projects/dlf-one-midtown/g1.webp",
      "/projects/dlf-one-midtown/g2.webp",
      "/projects/dlf-one-midtown/g3.webp",
      "/projects/dlf-one-midtown/g4.webp"
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.6657,77.1543&z=16&output=embed",
      lat: 28.6657,
      lng: 77.1543,
    },
    seo: {
      title: "DLF One Midtown – Luxury 2, 3 & 4 BHK in Moti Nagar, Central Delhi",
      description: "DLF One Midtown offers ready-to-move luxury 2, 3 & 4 BHK residences at Shivaji Marg, Moti Nagar with international clubhouse, greens and excellent connectivity.",
      canonical: "https://altinalivings.com/projects/dlf-one-midtown-moti-nagar",
    },
    featured: true,
    featured_order: 1,
    description: "DLF One Midtown is a landmark luxury high-rise community in Moti Nagar with premium specifications, ready clubhouse and proximity to Central Delhi.",
  },
  {
    id: "dlf-independent-floors-phase-2-3",
    slug: "dlf-independent-floors-phase-2-3",
    name: "DLF Independent Floors (Phase 2 & 3)",
    developer: "DLF",
    brand: "DLF",
    rating: 4.6,
    location: "DLF Garden City, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    micro_market: "New Gurugram",
    status: "Under Construction",
    construction_status: "Ongoing",
    price: "₹2.5 Cr onwards",
    configuration: "3 & 4 BHK Low-rise Independent Floors",
    typologies: ["3 BHK + Store", "4 BHK + Store + Utility"],
    usp: [
      "Low-rise independent floors with private lifestyle feel",
      "Located inside DLF Garden City ecosystem",
    ],
    highlights: [
      "Better privacy vs. typical high-rise group housing",
      "Access to planned parks, retail and social infra",
    ],
    amenities: ["Community Greens", "Gated Complex Pockets"],
    hero: "/projects/dlf-independent-floors/hero.jpg",
    heroAlt: "DLF Independent low-rise floors in DLF Garden City, Gurugram",
    gallery: [
      "/projects/dlf-independent-floors/g1.webp",
      "/projects/dlf-independent-floors/g2.webp",
      "/projects/dlf-independent-floors/g3.webp"
    ],
    seo: {
      title: "DLF Independent Floors – Phase 2 & 3 | DLF Garden City, Gurugram",
      description: "DLF Independent Floors (Phase 2 & 3) offer premium low-rise 3 & 4 BHK homes inside DLF Garden City, ideal for families preferring fewer neighbours and open surroundings.",
      canonical: "https://altinalivings.com/projects/dlf-independent-floors-phase-2-3",
    },
    featured: false,
    description: "DLF Independent Floors combine the feel of independent living with the security and planning of a gated township in New Gurugram.",
  },
  {
    id: "dlf-central-67-sco",
    slug: "dlf-central-67-sco-sector-67-gurgaon",
    name: "DLF Central 67 SCO",
    developer: "DLF",
    brand: "DLF",
    rating: 4.5,
    location: "Sector 67, Golf Course Extension Road, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    sector: "Sector 67",
    micro_market: "Golf Course Extension Road",
    status: "Under Construction",
    construction_status: "Ongoing",
    configuration: "Shop-cum-Office (SCO) Plots",
    price: "Price on Request",
    usp: [
      "Freehold SCO plots on Golf Course Extension Road",
      "Ideal for retail, F&B, offices and boutique brands",
    ],
    highlights: [
      "High visibility frontage on sector road",
      "Strong residential catchment along GCX and SPR",
    ],
    amenities: ["High Street Retail Environment", "Parking"],
    hero: "/projects/dlf-central-67-sco/hero.jpg",
    heroAlt: "DLF Central 67 SCO site on Golf Course Extension Road",
    gallery: [
      "/projects/dlf-central-67-sco/g1.webp",
      "/projects/dlf-central-67-sco/g2.webp",
      "/projects/dlf-central-67-sco/g3.webp"
    ],
    seo: {
      title: "DLF Central 67 – SCO Plots in Sector 67 Gurugram",
      description: "DLF Central 67 offers freehold SCO plots in Sector 67 on Golf Course Extension Road, suitable for retail, F&B and office use in a high-visibility corridor.",
      canonical: "https://altinalivings.com/projects/dlf-central-67-sco-sector-67-gurgaon",
    },
    featured: false,
    description: "DLF Central 67 SCO is a freehold commercial opportunity for investors and business owners on Golf Course Extension Road.",
  },
  {
    id: "sobha-altus",
    slug: "sobha-altus-sector-106-gurgaon",
    name: "SOBHA Altus",
    developer: "SOBHA Ltd.",
    brand: "SOBHA",
    rating: 4.8,
    location: "Sector 106, Dwarka Expressway, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    sector: "Sector 106",
    micro_market: "Dwarka Expressway",
    status: "Under Construction",
    construction_status: "Ongoing",
    price: "₹3.5 Cr onwards",
    configuration: "Luxury 3 & 4 BHK Residences",
    typologies: ["3 BHK", "4 BHK"],
    sizes: "≈ 2,000 – 3,500 sq.ft*",
    land_area: "≈ 8.5 acres*",
    usp: [
      "Signature SOBHA high-rise on Dwarka Expressway",
      "Low-density luxury with expansive views",
    ],
    highlights: [
      "High-spec finishes and international-quality detailing",
      "Close to Delhi border and IGI via Dwarka Expressway",
    ],
    amenities: [
      "Clubhouse",
      "Swimming Pool",
      "Gymnasium",
      "Landscaped Gardens",
      "Kids’ Play Area",
    ],
    hero: "/projects/sobha-altus/hero.jpg",
    heroAlt: "SOBHA Altus towers on Dwarka Expressway at dusk",
    gallery: [
      "/projects/sobha-altus/g1.webp",
      "/projects/sobha-altus/g2.webp",
      "/projects/sobha-altus/g3.webp",
      "/projects/sobha-altus/g4.webp"
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.5324,77.0463&z=16&output=embed",
      lat: 28.5324,
      lng: 77.0463,
    },
    seo: {
      title: "SOBHA Altus – Luxury 3 & 4 BHK on Dwarka Expressway",
      description: "SOBHA Altus in Sector 106 offers luxury 3 & 4 BHK residences along Dwarka Expressway with a premium clubhouse, curated amenities and signature SOBHA quality.",
      canonical: "https://altinalivings.com/projects/sobha-altus-sector-106-gurgaon",
    },
    featured: true,
    featured_order: 2,
    description: "SOBHA Altus is a landmark luxury high-rise development with expansive residences and SOBHA’s meticulous build quality.",
  },
  {
    id: "sobha-aurum",
    slug: "sobha-aurum-sector-36-greater-noida",
    name: "SOBHA Aurum",
    developer: "SOBHA Ltd.",
    brand: "SOBHA",
    rating: 4.8,
    location: "Sector 36, Greater Noida",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    sector: "Sector 36",
    micro_market: "Noida–Greater Noida Expressway",
    status: "Under Construction",
    construction_status: "Ongoing",
    configuration: "1, 2, 3 & 4 BHK Residences",
    price: "₹21,500 / sq.ft* (indicative)",
    usp: [
      "SOBHA’s flagship eco-luxury launch in Greater Noida",
      "Curated amenities for all age groups",
    ],
    highlights: [
      "Large multi-phase development",
      "Good connectivity via Noida–Greater Noida Expressway",
    ],
    amenities: [
      "Clubhouse",
      "Swimming Pool",
      "Gymnasium",
      "Jogging Track",
      "Kids’ Play Area",
    ],
    hero: "/projects/sobha-aurum/hero.jpg",
    heroAlt: "SOBHA Aurum residential towers in Greater Noida",
    gallery: [
      "/projects/sobha-aurum/g1.webp",
      "/projects/sobha-aurum/g2.webp",
      "/projects/sobha-aurum/g3.webp"
    ],
    seo: {
      title: "SOBHA Aurum – Luxury Apartments in Sector 36 Greater Noida",
      description: "SOBHA Aurum is an upcoming eco-luxury residential project in Sector 36, Greater Noida offering 1–4 BHK homes with SOBHA’s quality and full lifestyle amenities.",
      canonical: "https://altinalivings.com/projects/sobha-aurum-sector-36-greater-noida",
    },
    featured: true,
    featured_order: 3,
    description: "SOBHA Aurum brings SOBHA’s eco-luxury philosophy to Greater Noida with a carefully planned residential community.",
  },
  {
    id: "sobha-aranya",
    slug: "sobha-aranya-delhi-ncr",
    name: "SOBHA Aranya",
    developer: "SOBHA Ltd.",
    brand: "SOBHA",
    rating: 4.8,
    location: "Karma Lakelands, NH-48, Gurugram outskirts",
    city: "Gurugram",
    state: "Haryana",
    micro_market: "NH-48 Eco Corridor",
    status: "Pre-launch",
    construction_status: "Planned",
    configuration: "3 & 4 BHK Eco-luxury Residences",
    usp: [
      "Eco-luxury residences with golf and resort-style ambience",
      "Located inside Karma Lakelands golf resort community",
    ],
    highlights: [
      "Resort-style living with SOBHA craftsmanship",
      "Green, low-density environment yet close to NH-48",
    ],
    amenities: [
      "Clubhouse",
      "Swimming Pool",
      "Gym & Fitness",
      "Jogging & Cycling Tracks",
      "Kids’ Play Areas",
    ],
    hero: "/projects/sobha-aranya/hero.jpg",
    heroAlt: "SOBHA Aranya eco-luxury homes amidst greens at Karma Lakelands",
    gallery: [
      "/projects/sobha-aranya/g1.webp",
      "/projects/sobha-aranya/g2.webp",
      "/projects/sobha-aranya/g3.webp"
    ],
    seo: {
      title: "SOBHA Aranya – Eco-Luxury Residences at Karma Lakelands",
      description: "SOBHA Aranya is an eco-luxury residential development inside Karma Lakelands along NH-48, offering resort-style living with SOBHA’s quality.",
      canonical: "https://altinalivings.com/projects/sobha-aranya-delhi-ncr",
    },
    featured: true,
    featured_order: 5,
    description: "SOBHA Aranya combines eco-luxury living, golf-course ambience and SOBHA craftsmanship at Karma Lakelands.",
  },
  {
    id: "m3m-jacob-co-residences",
    slug: "m3m-jacob-and-co-sector-97-noida",
    name: "M3M Jacob & Co. Residences",
    developer: "M3M",
    brand: "Jacob & Co.",
    rating: 4.7,
    location: "Sector 97, Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    sector: "Sector 97",
    status: "Pre-launch",
    construction_status: "Planned",
    configuration: "3, 4 & 5 BHK Branded Residences",
    usp: [
      "First Jacob & Co. branded residential address in India",
      "Ultra-luxury segment targeting UHNI / HNI buyers",
    ],
    highlights: [
      "High-fashion inspired interiors and curated amenities",
      "Planned sky lounges and experiential amenities",
    ],
    amenities: [
      "Branded Clubhouse",
      "Swimming Pool",
      "Sky Lounges",
      "Gymnasium",
      "Spa / Wellness",
    ],
    hero: "/projects/m3m-jacob/hero.jpg",
    heroAlt: "M3M Jacob & Co. branded luxury residence towers in Noida",
    gallery: [
      "/projects/m3m-jacob/g1.jpg",
      "/projects/m3m-jacob/g2.jpg",
      "/projects/m3m-jacob/g3.jpg"
    ],
    seo: {
      title: "M3M Jacob & Co. Residences – Branded Luxury in Noida",
      description: "M3M Jacob & Co. Residences bring Jacob & Co.’s design sensibilities to ultra-luxury homes in Noida with limited residences and couture-inspired amenities.",
      canonical: "https://altinalivings.com/projects/m3m-jacob-and-co-sector-97-noida",
    },
    featured: true,
    featured_order: 7,
    description: "M3M Jacob & Co. Residences are ultra-luxury branded homes designed in collaboration with Jacob & Co.",
  },
  {
    id: "gygy-mentis",
    slug: "gygy-mentis-sector-140-noida",
    name: "GYGY Mentis",
    developer: "GYGY Group",
    brand: "GYGY",
    rating: 4.7,
    location: "Sector 140, Noida Expressway, Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    sector: "Sector 140",
    micro_market: "Noida Expressway",
    rera: "UPRERAPRJ251909",
    status: "Under Construction",
    construction_status: "Ongoing",
    possession: "Dec 2026 (indicative)",
    launch: "2024",
    price: "Retail @ ₹35,000/sq.ft • Offices @ ₹8,999/sq.ft",
    configuration: "Retail Shops & IT/ITeS Office Spaces",
    typologies: [
      "Ground Floor Retail Shops – 102.09 sq.ft onwards",
      "Office Spaces – 475 sq.ft onwards"
    ],
    sizes: "Retail from 102.09 sq.ft • Offices from 475 sq.ft",
    land_area: "≈ 5 acres (fully paid-up land)",
    usp: [
      "Fully paid-up 5-acre commercial land",
      "Limited ground floor high-street retail shops",
      "12% assured return on select retail inventory",
    ],
    highlights: [
      "Walking distance to Sector 137 & 142 Metro Stations",
      "Surrounded by 30,000+ families in nearby sectors",
      "Connected to Noida Expressway, FNG & Yamuna Expressway",
      "Approx. 35 mins from upcoming Noida International Airport",
    ],
    amenities: [
      "Premium Retail High Street",
      "Office Lobby & Business Centre",
      "Food Court & F&B Options",
      "Landscaped Courtyards",
      "Basement Parking",
      "24x7 Security & CCTV",
    ],
    hero: "/projects/gygy-mentis/hero.jpg",
    heroAlt: "GYGY Mentis commercial towers and retail plaza in Sector 140 Noida",
    gallery: [
      "/projects/gygy-mentis/g1.jpg",
      "/projects/gygy-mentis/g2.jpg",
      "/projects/gygy-mentis/g3.jpg",
      "/projects/gygy-mentis/g4.jpg"
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.5115,77.4130&z=16&output=embed",
      lat: 28.5115,
      lng: 77.413,
    },
    seo: {
      title: "GYGY Mentis Sector 140 Noida – Retail & Office Spaces",
      description: "GYGY Mentis in Sector 140 offers ground-floor retail shops from 102.09 sq.ft with 12% assured return and office spaces from 475 sq.ft on Noida Expressway.",
      canonical: "https://altinalivings.com/projects/gygy-mentis-sector-140-noida",
    },
    featured: true,
    featured_order: 6,
    description: "GYGY Mentis is a 5-acre commercial development on Noida Expressway offering retail shops and office spaces with strong residential and corporate catchment.",
  },
  {
    id: "sobha-sector-1-gnw",
    slug: "sobha-sector-1-greater-noida-west",
    name: "SOBHA Sector 1 – Greater Noida West",
    developer: "SOBHA Ltd.",
    brand: "SOBHA",
    rating: 4.8,
    location: "Sector 1, Greater Noida West",
    city: "Greater Noida West",
    state: "Uttar Pradesh",
    sector: "Sector 1",
    micro_market: "Noida Extension / GNW",
    rera: "TBA",
    status: "Pre-launch / New Launch",
    construction_status: "Planned",
    possession: "Approx. 5 years from launch (as per developer)",
    launch: "Launching this December (EOI phase)",
    price: "2, 3 & 4 BR Premium Apartments starting @ ₹2.25 Cr*",
    configuration: "2, 3 & 4 BR Premium Apartments",
    typologies: [
      "2 BR + 2T – 1,300 sq.ft (approx.)",
      "3 BR + 2T – 1,600 sq.ft (approx.)",
      "3 BR + 3T – 1,850 sq.ft (approx.)",
      "4 BR + 4T – 2,200–2,500 sq.ft (approx.)"
    ],
    sizes: "1,300 – 2,500 sq.ft* (approx.)",
    land_area: "≈ 12 acres",
    towers: 8,
    floors: "G+45",
    total_units: "≈ 1,375 units",
    usp: [
      "Ultra-luxury high-rise community in Sector 1, Greater Noida West",
      "Only 4 apartments per floor with 3+1 lifts",
      "3-level basement parking",
      "Large ultra-luxury clubhouse & world-class amenities",
      "Iconic architecture with limited edition homes",
    ],
    highlights: [
      "Excellent connectivity to FNG (~2 km), NH 24 (~10 km) and Pari Chowk (~18 km)",
      "Approx. 45 mins to Noida International Airport & ~8 km to nearest metro",
      "Yatharth Hospital & D-Mart ~500 m; Gaur City Mall ~4.4 km; Fortis ~10 km; Kailash ~12 km",
      "Noida Golf Course ~12 km; F1 Track ~30 km",
      "GD Goenka International ~4.5 km; Lotus Valley ~3 km",
    ],
    amenities: [
      "Ultra-luxury Clubhouse",
      "Swimming Pool",
      "Kids’ Pool",
      "Gymnasium",
      "Indoor Games",
      "Multi-purpose Hall",
      "Landscaped Gardens",
      "Jogging / Walking Track",
      "Kids’ Play Area",
      "3-level Basement Parking",
      "24x7 Security & Surveillance",
    ],
    hero: "/projects/SobhaSector1GNW/hero.jpg",
    heroAlt: "SOBHA Sector 1 ultra-luxury towers in Greater Noida West",
    gallery: [
      "/projects/SobhaSector1GNW/g1.jpg",
      "/projects/SobhaSector1GNW/g2.jpg",
      "/projects/SobhaSector1GNW/g3.jpg",
      "/projects/SobhaSector1GNW/g4.jpg"
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.603,77.420&z=15&output=embed",
      lat: 28.603,
      lng: 77.42,
    },
    seo: {
      title: "SOBHA Sector 1 Greater Noida West – Ultra-Luxury 2, 3 & 4 BR",
      description: "New launch SOBHA Sector 1 Greater Noida West offers ultra-luxury 2, 3 & 4 BR premium apartments starting @ ₹2.25 Cr* across 12 acres with G+45 towers and large clubhouse.",
      canonical: "https://altinalivings.com/projects/sobha-sector-1-greater-noida-west",
    },
    featured: true,
    featured_order: 4,
    description: "SOBHA Sector 1 GNW is an ultra-luxury high-rise community with 2, 3 & 4 BR residences, iconic architecture and strong connectivity in the Noida Extension belt.",
  },
  {
    id: "sobha-strada",
    slug: "sobha-strada-sector-106-gurgaon",
    name: "SOBHA STRADA – SOBHA Downtown",
    developer: "SOBHA Ltd.",
    brand: "SOBHA",
    rating: 4.8,
    location: "SOBHA Downtown, Sector 106, Dwarka Expressway, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    sector: "Sector 106",
    micro_market: "Dwarka Expressway",
    rera: "TBA",
    status: "New Launch",
    construction_status: "Planned",
    possession: "To be announced",
    launch: "2025",
    price: "Under ₹2.5 Cr* all-inclusive (select units) with 4+ year easy payment plan",
    configuration: "1 Bed Serviced Residences + Premium Retail",
    typologies: [
      "1 Bed Serviced Residences",
      "High-Street Retail & F&B Spaces"
    ],
    sizes: "Serviced Residences: 856 sq.ft* onwards; Retail: 257 sq.ft* onwards",
    land_area: "≈ 2.03 acres (commercial)",
    towers: 1,
    floors: "4 Basements + Ground + 31 Floors",
    total_units: "≈ 251 serviced residence keys + multiple retail units",
    usp: [
      "SOBHA’s 1st commercial project in Delhi NCR at SOBHA Downtown",
      "Iconic glass façade tower inspired by global/Dubai-style skyline",
      "Smartly planned 1 Bed serviced residences + premium retail on Dwarka Expressway",
      "Low ticket size under ₹2.5 Cr* with long, easy payment plan",
    ],
    highlights: [
      "Corner plot on 84 m main sector road – less than 1 minute from Dwarka Expressway (NH 248BB)",
      "Part of SOBHA Downtown (Sectors 106, 108 & 109) with SOBHA City, International City, SOBHA Altus and upcoming launches",
      "Approx. 15 min* drive to IGI Airport & Aerocity with excellent Delhi connectivity",
      "High-demand, low-supply 1 Bed format in Delhi NCR – easily tradable, investor-friendly size",
      "Proximity to Yashobhoomi (India International Convention Centre), Udyog Vihar, Sheetla Mata Medical College, upcoming Global City and marquee developments",
    ],
    amenities: [
      "Triple height entrance lobby",
      "Club amenities over two levels",
      "Infinity edge swimming pool",
      "State-of-the-art gymnasium",
      "Fine-dining / renowned F&B options",
      "Business lounge & meeting spaces",
      "Alfresco dining decks",
      "Outdoor gym & recreation zones",
      "EV charging points",
      "100% power backup",
      "Professional hospitality operator (proposed)",
      "24x7 security & surveillance",
    ],
    hero: "/projects/sobha-strada/hero.jpg",
    heroAlt: "SOBHA STRADA iconic glass façade tower at SOBHA Downtown Gurugram",
    gallery: [
      "/projects/sobha-strada/g1.jpg",
      "/projects/sobha-strada/g2.jpg",
      "/projects/sobha-strada/g3.jpg",
      "/projects/sobha-strada/g4.jpg"
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.5324,77.0463&z=16&output=embed",
      lat: 28.5324,
      lng: 77.0463,
    },
    seo: {
      title: "SOBHA STRADA – Serviced Residences & Retail at SOBHA Downtown",
      description: "SOBHA STRADA at SOBHA Downtown, Sector 106 Gurugram is SOBHA’s first commercial project in Delhi NCR with 1 Bed serviced residences and premium retail just off Dwarka Expressway.",
      canonical: "https://altinalivings.com/projects/sobha-strada",
    },
    featured: true,
    description: "SOBHA STRADA is a never-before investment opportunity at SOBHA Downtown, combining an iconic glass façade commercial tower with 1 Bed serviced residences and high-street retail.",
  },
  {
    id: "gygy-fiveo",
    slug: "gygy-fiveo-sector-50-noida",
    name: "GYGY FIVEO",
    developer: "GYGY Group",
    brand: "GYGY",
    rating: 4.6,
    location: "Sector 50, Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    sector: "Sector 50",
    micro_market: "Central Noida",
    status: "New Launch",
    construction_status: "Under Construction",
    configuration: "High-Street Retail, F&B & Entertainment",
    usp: [
      "Prime high-street concept in dense, premium Sector 50 catchment",
      "Designed as a lifestyle, shopping and dining hub",
    ],
    highlights: [
      "Serves 12,000+ families in nearby residential societies (approx.)",
      "Focus on experience-led retail instead of bare shell shops",
    ],
    amenities: [
      "High-Street Retail Boulevard",
      "Restaurants & Outdoor Seating",
      "Central Plaza / Courtyard",
      "Elevators & Escalators",
      "24x7 Security",
      "Ample Parking",
    ],
    hero: "/projects/gygy-fiveo/hero.jpg",
    heroAlt: "GYGY FIVEO high-street retail and lifestyle hub in Sector 50 Noida",
    gallery: [
      "/projects/gygy-fiveo/g1.jpg",
      "/projects/gygy-fiveo/g2.jpg",
      "/projects/gygy-fiveo/g3.jpg",
      "/projects/gygy-fiveo/g4.jpg"
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.580,77.365&z=16&output=embed",
      lat: 28.58,
      lng: 77.365,
    },
    seo: {
      title: "GYGY FIVEO Sector 50 Noida – High-Street Retail & Lifestyle",
      description: "GYGY FIVEO in Sector 50, Noida is a high-street commercial hub offering retail, F&B and lifestyle spaces in a dense, upscale residential catchment.",
      canonical: "https://altinalivings.com/projects/gygy-fiveo-sector-50-noida",
    },
    featured: false,
    description: "GYGY FIVEO is a high-street retail and lifestyle destination in Sector 50 Noida catering to an upscale catchment.",
  }
];

export default projects;
