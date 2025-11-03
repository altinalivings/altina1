// src/data/projects.ts
export type Project = {
  id: string;
  slug?: string;
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
  bank_approvals?: string[];
  usp?: string[];
  highlights?: string[];
  amenities?: string[];
  specs?: Record<string, string>;
  about?: string;
  brochure?: string;
  hero?: string;
  gallery?: string[];
  map?: { embed?: string; lat?: number; lng?: number };
  nearby?: Record<string, any>;
  legal?: Record<string, any>;
  seo?: { title?: string; description?: string; canonical?: string };
  virtualTourUrl?: string;
  featured?: boolean;
  featured_order?: number;
  heroAlt?: string;
  galleryAlt?: string[];
  faq?: { q: string; a: string }[];
  paymentPlan?: Record<string, string>;
  description?: string;
};

const projects: Project[] = [
  {
    id: "dlf-one-midtown",
    slug: "dlf-one-midtown-moti-nagar",
    name: "DLF One Midtown",
    developer: "DLF (DLF Urban Pvt. Ltd.)",
    brand: "DLF",
    rating: 4.7,
    location: "Shivaji Marg, Moti Nagar, West Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    sector: "Moti Nagar / Shivaji Marg",
    micro_market: "Moti Nagar, West Delhi",
    rera: "DLRERA2021P0007",
    status: "Ready to Move",
    construction_status: "Complete / Near-Complete",
    possession: "Jul 2024",
    launch: "2021",
    price: "₹4.7 Cr onwards",
    configuration: "2, 3 & 4 BHK Residences",
    typologies: ["2 BHK", "3 BHK", "4 BHK + SQ"],
    sizes: "1,732 – 3,000 sq.ft.",
    land_area: "≈ 5.14 acres",
    towers: 4,
    floors: "Up to 39 floors",
    total_units: "≈ 915 apartments",
    bank_approvals: ["HDFC", "ICICI", "SBI"],
    usp: [
      "Surrounded by 128 acres of landscaped park",
      "Luxury finishes & premium design partners",
      "Excellent connectivity via multiple metro lines and arterial roads",
      "Resident-exclusive clubhouse with full amenity set",
    ],
    highlights: [
      "Infinity-edge swimming pool",
      "Lush landscaped greens & gardens",
      "Expansive balconies with laminated glass railings",
      "Premium flooring: marble in living/dining; wooden/laminate in bedrooms",
      "On-site retail/dining and banquet options",
    ],
    amenities: [
      "Clubhouse",
      "Swimming Pool",
      "Gymnasium",
      "Spa",
      "Kids’ Play Area",
      "Jogging Track",
      "Landscaped Gardens",
      "24x7 Security",
    ],
    specs: {
      structure: "High-rise towers (RCC framed) with premium façade finishes",
      air_conditioning: "VRV / VRF systems",
      flooring: "Imported marble in living/dining; wooden/laminated in bedrooms",
      kitchen: "Modular kitchens with premium fittings",
      bathrooms: "Glass shower partitions; premium sanitary & CP fittings",
      lifts:
        "High-speed lifts; destination control / smart access (as per tower)",
    },
    about:
      "DLF One Midtown is an ultra-luxury development in Moti Nagar, West Delhi. Spread over ~5 acres and surrounded by expansive green open spaces, it offers 2/3/4 BHK residences with premium amenities and excellent connectivity. RERA-registered and largely ready for possession.",
    brochure: "/brochures/dlf-one-midtown.pdf",
    hero: "/projects/dlf-one-midtown/hero.jpg",
    gallery: [
      "/projects/dlf-one-midtown/g1.jpg",
      "/projects/dlf-one-midtown/g2.jpg",
      "/projects/dlf-one-midtown/g3.jpg",
      "/projects/dlf-one-midtown/g4.jpg",
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.650,77.135&z=16&output=embed",
      lat: 28.65,
      lng: 77.135,
    },
    nearby: {
      schools: [
        "St. Michael’s Sr. Sec. School",
        "Springdales (Pusa Road)",
        "Ramjas Public School",
      ],
      hospitals: [
        "BLK-Max Super Speciality",
        "Apollo Spectra Karol Bagh",
        "Kalra Hospital",
      ],
      malls: [
        "Moments Mall",
        "Pacific Mall Tagore Garden",
        "City Square, Rajouri Garden",
      ],
      connectivity: [
        { label: "Metro (Moti Nagar / Kirti Nagar)", time: "≈ 5–10 min" },
        { label: "IGI Airport", time: "≈ 25–40 min (traffic dependent)" },
      ],
    },
    legal: {
      disclaimer:
        "All imagery & specifications are indicative. Buyers should verify RERA, possession status, unit sizes, pricing, and approvals from official documentation.",
    },
    seo: {
      title:
        "DLF One Midtown – Luxury 2, 3 & 4 BHK Residences in Moti Nagar, Delhi",
      description:
        "Explore DLF One Midtown — ready luxury apartments in West Delhi with premium amenities and excellent connectivity. Book a site visit with Altina™ Livings.",
      canonical:
        "https://www.altinalivings.com/projects/dlf-one-midtown-moti-nagar",
    },
    virtualTourUrl: "https://www.youtube.com/watch?v=t2UzbAW6-D8",
    featured: true,
    featured_order: 1,
    heroAlt:
      "DLF One Midtown – 2, 3 & 4 BHK Residences in Moti Nagar, West Delhi by DLF",
    galleryAlt: [
      "DLF One Midtown – exterior tower view",
      "DLF One Midtown – clubhouse & amenities",
      "DLF One Midtown – landscaped gardens",
      "DLF One Midtown – interiors & living spaces",
    ],
    faq: [
      {
        q: "What is the price of DLF One Midtown?",
        a: "Prices start from ₹4.7 Cr onwards (subject to availability).",
      },
      {
        q: "Where is DLF One Midtown located?",
        a: "Shivaji Marg, Moti Nagar, West Delhi with excellent metro and road connectivity.",
      },
      {
        q: "Is DLF One Midtown RERA registered?",
        a: "Yes, RERA ID: DLRERA2021P0007.",
      },
    ],
    description:
      "DLF One Midtown in Moti Nagar, West Delhi offers luxury 2/3/4 BHK residences with premium amenities and great metro connectivity—curated by Altina™ Livings.",
  },
  {
    id: "dlf-independent-floors-phase-2-3",
    slug: "dlf-independent-floors-phase-2-3",
    name: "DLF Independent Floors (Phase 2 & 3)",
    developer: "DLF",
    brand: "DLF",
    rating: 4.7,
    location: "DLF City Phase 2 & Phase 3, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    sector: "DLF Phase 2 & 3",
    micro_market: "DLF City",
    rera: "TBA",
    status: "Launched",
    construction_status: "Under Construction",
    possession: "TBA (phase-wise)",
    launch: "2025",
    price: "₹TBA",
    configuration: "3 & 4 BHK Independent Floors",
    typologies: ["3 BHK", "4 BHK"],
    sizes: "1,800 – 3,200 sq.ft.",
    land_area: "Low-rise plotted (multiple pockets)",
    towers: 0,
    floors: "Stilt + 4",
    total_units: "TBA",
    bank_approvals: ["HDFC", "ICICI", "SBI", "Axis"],
    usp: [
      "Low-rise independent floors in prime DLF City",
      "Walkable access to MG Road, CyberHub & Rapid Metro",
      "Gated pockets with DLF estate management",
    ],
    highlights: [
      "Private low-density living (one floor per level)",
      "Stilt parking & lift in each block",
      "Premium modular kitchens & branded fittings",
      "Multi-tier security, access-controlled lobbies",
    ],
    amenities: [
      "24x7 Security",
      "Lift (per block)",
      "Stilt Parking",
      "Power Backup",
      "Kids’ Play Area",
      "Green Pockets",
      "Estate Maintenance",
    ],
    specs: {
      structure: "RCC framed, low-rise",
      air_conditioning: "Provisioned; VRV/VRF in select offerings",
      flooring: "Vitrified/stone in living; wooden/laminate in bedrooms",
      kitchen:
        "Modular with hob/hood, stone countertop, premium fittings",
      bathrooms:
        "Branded sanitary & CP fittings, shower enclosures",
      lifts: "Lift in each low-rise block",
    },
    about:
      "DLF Independent Floors (Phase 2 & 3) bring low-rise luxury to DLF City—offering privacy, stilt parking, lifts, premium finishes and estate-managed living with unmatched access to MG Road, CyberHub and Rapid Metro.",
    brochure: "/brochures/dlf-independent-floors-phase-2-3.pdf",
    hero: "/projects/dlf-independent-floors-phase-2-3/hero.jpg",
    gallery: [
      "/projects/dlf-independent-floors-phase-2-3/g1.jpg",
      "/projects/dlf-independent-floors-phase-2-3/g2.jpg",
      "/projects/dlf-independent-floors-phase-2-3/g3.jpg",
      "/projects/dlf-independent-floors-phase-2-3/g4.jpg",
    ],
    map: {
      embed:
        "https://www.google.com/maps?q=DLF+City+Phase+2,+Gurugram&z=14&output=embed",
      lat: 28.476,
      lng: 77.096,
    },
    nearby: {
      schools: ["Shalom Hills", "The Shri Ram School Moulsari"],
      hospitals: ["Artemis Hospital", "Medanta"],
      malls: ["DLF CyberHub", "DLF City Centre", "Ambience Mall"],
      connectivity: [
        { label: "Rapid Metro (Phase 2/3)", time: "≈ 5–10 min" },
        { label: "NH-48", time: "≈ 10–15 min" },
        { label: "IGI Airport", time: "≈ 20–30 min" },
      ],
    },
    legal: {
      disclaimer:
        "All imagery & details are indicative. Specifications/approvals are subject to change. Verify latest RERA details and availability.",
    },
    seo: {
      title:
        "DLF Independent Floors Phase 2 & 3 – Premium Builder Floors in Gurugram",
      description:
        "Experience low-rise independent floors by DLF in Gurugram Phase 2 & 3 — private living with lift, stilt parking and DLF estate management. Book your visit with Altina™ Livings.",
      canonical:
        "https://www.altinalivings.com/projects/dlf-independent-floors-phase-2-3",
    },
    featured: true,
    featured_order: 3,
    heroAlt:
      "DLF Independent Floors (Phase 2 & 3) – 3 & 4 BHK Independent Floors in DLF City by DLF",
    galleryAlt: [
      "DLF Independent Floors (Phase 2 & 3) – façade view",
      "DLF Independent Floors (Phase 2 & 3) – streetscape and green pockets",
      "DLF Independent Floors (Phase 2 & 3) – interiors",
      "DLF Independent Floors (Phase 2 & 3) – living & dining spaces",
    ],
    faq: [
      {
        q: "What is the price of DLF Independent Floors (Phase 2 & 3)?",
        a: "Prices are TBA (subject to inventory and specification).",
      },
      {
        q: "Where is the project located?",
        a: "In DLF City Phases 2 & 3, Gurugram with quick access to MG Road and Rapid Metro.",
      },
      {
        q: "Is it RERA registered?",
        a: "Registration details are TBA; please verify latest status.",
      },
    ],
    description:
      "DLF Independent Floors (Phase 2 & 3), Gurugram—premium builder floors in a low-density neighborhood with strong connectivity and lifestyle comforts.",
  },
  {
    id: "dlf-sco-67",
    slug: "dlf-sco-67",
    name: "DLF Central 67 (SCO Plots)",
    developer: "DLF Home Developers Limited",
    brand: "DLF",
    rating: 4.8,
    location: "DLF Central 67, Sohna Road, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    sector: "Sector 67",
    micro_market: "Sohna Road",
    rera: "RC/REP/HARERA/GGM/768/500/2023/112",
    status: "Launched",
    construction_status: "Under Construction",
    possession: "TBA",
    launch: "2025",
    price: "₹TBA",
    configuration: "SCO Plots (B+G+4)",
    typologies: ["Commercial Plots", "SCO"],
    sizes: "118 sq.m (~141 sq. yd.) onwards",
    land_area: "3.52 hectares (~8.69 acres)",
    towers: 0,
    floors: "Basement + Ground + 4",
    total_units: "75 SCO plots",
    bank_approvals: ["HDFC", "ICICI", "SBI", "Axis"],
    usp: [
      "Located on Sohna Road opposite ARIA Mall",
      "Grand 6,039 sq.m (≈65,000 sq.ft) internal plaza",
      "Landscape design by MPFP",
      "Architecture by Hafeez Contractor",
    ],
    highlights: [
      "60m/80m wide entrances from Sohna Road",
      "Catchment of 7 lakh+ residents in vicinity",
      "Pedestrian-friendly arcaded walkways (≈3m wide)",
      "Largest central open area: 74m x 51m",
      "Dedicated periphery & surface parking",
      "Curated plot sizes including corner plots",
      "FAR of 4.28",
    ],
    amenities: [
      "Grand Internal Plaza",
      "Ample Parking",
      "Curated Landscaping",
      "Wide Access Roads",
      "Pedestrian Walkways",
      "Green Belts",
      "Estate Management",
    ],
    specs: {
      structure: "RCC framed SCO blocks",
      floors: "Basement + Ground + 4",
      far: "4.28",
      plaza: "6,039 sq.m central plaza",
      plot_sizes: "From 118 sq.m (~141 sq. yd.)",
      landscaping: "MPFP (global landscape designers)",
    },
    about:
      "DLF Central 67 is a landmark commercial plotted development at Sector 67, Gurugram. With 75 premium SCO plots, a ~65,000 sq.ft. internal plaza, pedestrian-centric arcades, global-grade landscaping, and strong Sohna Road frontage opposite ARIA Mall, it’s a prime investment opportunity.",
    brochure: "/brochures/dlf-sco-67.pdf",
    hero: "/projects/dlf-sco-67/hero.jpg",
    gallery: [
      "/projects/dlf-sco-67/g1.jpg",
      "/projects/dlf-sco-67/g2.jpg",
      "/projects/dlf-sco-67/g3.jpg",
      "/projects/dlf-sco-67/g4.jpg",
    ],
    map: {
      embed:
        "https://www.google.com/maps?q=DLF+Central,+Sector+67,+Gurugram&z=14&output=embed",
      lat: 28.404,
      lng: 77.067,
    },
    nearby: {
      schools: ["GD Goenka World School", "DPS International"],
      hospitals: ["Artemis Hospital", "Medanta"],
      malls: ["ARIA Mall", "Bestech Mall", "Good Earth City Centre"],
      connectivity: [
        { label: "Golf Course Extension Road", time: "≈ 5–7 min" },
        { label: "NH-48 / Rajiv Chowk", time: "≈ 9–15 min" },
        { label: "DLF CyberHub", time: "≈ 17 min" },
        { label: "IGI Airport", time: "≈ 26–30 min" },
      ],
    },
    legal: {
      disclaimer:
        "This is not a legal offering. All details/drawings/specs are indicative. Verify latest RERA details, approvals and availability with DLF.",
    },
    seo: {
      title:
        "DLF SCO 67 Gurugram – Premium Shop-cum-Office Plots on Sohna Road",
      description:
        "Own freehold SCO plots by DLF in Sector 67, Gurugram with a ~65,000 sq.ft plaza and prime Sohna Road frontage. Curated by Altina™ Livings.",
      canonical: "https://www.altinalivings.com/projects/dlf-sco-67",
    },
    featured: true,
    featured_order: 4,
    heroAlt:
      "DLF Central 67 (SCO Plots) – B+G+4 SCO plots on Sohna Road by DLF",
    galleryAlt: [
      "DLF Central 67 – streetscape and plaza visual",
      "DLF Central 67 – arcaded walkways",
      "DLF Central 67 – plotted grid and access",
      "DLF Central 67 – evening render of central plaza",
    ],
    faq: [
      {
        q: "What is the pricing at DLF Central 67?",
        a: "Pricing is TBA; please enquire for current availability.",
      },
      { q: "Where is it located?", a: "Sector 67, Sohna Road, opposite ARIA Mall." },
      {
        q: "Is it RERA registered?",
        a: "Yes, RERA ID: RC/REP/HARERA/GGM/768/500/2023/112.",
      },
    ],
    description:
      "DLF Central 67 offers freehold shop-cum-office plots in Gurugram’s prime corridor—high visibility, strong footfall potential and long-term brand presence.",
  },
  {
    id: "sobha-aurum",
    slug: "sobha-aurum-sector-36-greater-noida",
    name: "SOBHA Aurum",
    developer: "SOBHA Ltd.",
    brand: "SOBHA",
    rating: 4.8,
    location: "Sector 36, Greater Noida, Uttar Pradesh",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    sector: "Sector 36",
    micro_market: "Noida–Greater Noida Expressway Corridor",
    rera: "UPRERAPRJ361748/06/2025",
    status: "Under Construction",
    construction_status: "Ongoing",
    possession: "Apr 2030",
    launch: "2025",
    price: "₹2.73 Cr onwards",
    configuration: "1, 2, 3 & 4 BHK Residences",
    typologies: [
      "1 BHK (739 sq.ft.)",
      "2 BHK (1,270 sq.ft.)",
      "3 BHK Luxe (1,571 sq.ft.)",
      "3 BHK Grande (1,805 sq.ft.)",
      "4 BHK Grande (2,285–2,306 sq.ft.)",
    ],
    sizes: "739 – 2,306 sq.ft.",
    land_area: "3.46 acres (14,001 sq.m.)",
    towers: 2,
    floors: "Tower 1 – G + 35 | Tower 2 – G + 45",
    total_units: "420 residences",
    bank_approvals: ["HDFC", "ICICI", "Axis", "SBI"],
    usp: [
      "Tallest residential towers in the vicinity with crown-topped façade",
      "Vastu-compliant square plot with two towers maximising privacy and sunlight",
      "≈2.5 acres of open space dedicated to amenities",
      "Vehicular movement limited to periphery for uninterrupted recreation zones",
    ],
    highlights: [
      "≈15,072 sq.ft. clubhouse with banquet hall, indoor games and yoga studio",
      "Temperature-controlled leisure pool",
      "Reflexology walk and outdoor fitness deck",
      "Amphitheatre, party plaza and celebration lawn",
      "Pet park and multi-sport courts (cricket, tennis, badminton)",
    ],
    amenities: [
      "Clubhouse",
      "Banquet Hall",
      "Badminton Court",
      "Indoor Games Room",
      "Yoga / Gym / Aerobics Studio",
      "Reflexology Walk",
      "Swimming Pool",
      "Kids’ Pool",
      "Amphitheatre",
      "Party Plaza",
      "Outdoor Fitness Deck",
      "Cricket Pitch",
      "Tennis Court",
      "Multi-Sport Court",
      "Landscaped Lawns",
      "Kids’ Play Area",
      "Pet Park",
      "Alfresco Deck",
    ],
    specs: {
      structure:
        "RCC framed seismic-compliant towers with premium façade cladding",
      floor_height: "≈ 3.1 m floor-to-floor height",
      air_conditioning: "Provision for split/VRV AC systems",
      flooring:
        "Marble in living/dining and wooden flooring in bedrooms",
      kitchen: "Modular kitchen with premium fittings",
      bathrooms:
        "Modern sanitary ware and glass shower enclosures",
      lifts: "High-speed elevators with smart access control",
    },
    about:
      "SOBHA Aurum in Sector 36, Greater Noida is a limited-edition residential development offering 1, 2, 3 and 4 bedroom luxury residences across 3.46 acres. Featuring two sleek towers with the tallest in the neighbourhood, Aurum offers 420 homes surrounded by expansive amenities — from pools and party lawns to a 15,000 sq.ft. clubhouse.",
    brochure: "/brochures/sobha-aurum.pdf",
    hero: "/projects/sobha-aurum/hero.jpg",
    gallery: [
      "/projects/sobha-aurum/g1.webp",
      "/projects/sobha-aurum/g2.webp",
      "/projects/sobha-aurum/g3.webp",
      "/projects/sobha-aurum/g4.webp",
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.4746,77.5209&z=16&output=embed",
      lat: 28.4746,
      lng: 77.5209,
    },
    nearby: {
      schools: [
        "Jaypee Public School",
        "Somerville School",
        "DPS World Public School",
        "Ryan International School",
        "Aster Public School",
      ],
      hospitals: [
        "Sharda Hospital",
        "Yatharth Super Speciality Hospital",
        "Apollo Cradle & Children Hospital",
        "Kailash Hospital",
      ],
      malls: [
        "Grand Venice Mall",
        "Omaxe Connaught Place Mall",
        "Ansal Plaza Greater Noida",
      ],
      connectivity: [
        { label: "Jewar International Airport", time: "≈ 53 min (≈39 km)" },
        { label: "Pari Chowk & Alpha Market", time: "≈ 10–15 min" },
        { label: "Delta 1 Metro Station", time: "≈ 20 min" },
      ],
    },
    legal: {
      disclaimer:
        "All renderings and data are conceptual and subject to change. Buyers should verify details from official SOBHA documentation and the UP RERA portal. RERA Registration No: UPRERAPRJ361748/06/2025.",
    },
    seo: {
      title:
        "SOBHA Aurum – 1 to 4 BHK Luxury Residences in Sector 36, Greater Noida",
      description:
        "SOBHA Aurum offers 1, 2, 3 & 4 BHK residences in Sector 36, Greater Noida across 3.46 acres with 420 homes and a ~15,000 sq.ft. clubhouse.",
      canonical:
        "https://www.altinalivings.com/projects/sobha-aurum-sector-36-greater-noida",
    },
    virtualTourUrl: "https://www.youtube.com/watch?v=KHnW1vKcErM",
    featured: true,
    featured_order: 5,
    heroAlt:
      "SOBHA Aurum – 1 to 4 BHK Luxury Residences in Sector 36 Greater Noida",
    galleryAlt: [
      "SOBHA Aurum – architectural day view",
      "SOBHA Aurum – clubhouse and pool area",
      "SOBHA Aurum – landscaped amenities deck",
      "SOBHA Aurum – residence interiors and balconies",
    ],
    faq: [
      {
        q: "What is the starting price of SOBHA Aurum?",
        a: "₹2.73 Crore onwards (subject to availability).",
      },
      {
        q: "Where is SOBHA Aurum located?",
        a: "Sector 36, Greater Noida with connectivity to Noida and Delhi.",
      },
      {
        q: "What apartment types are available?",
        a: "1, 2, 3 and 4 bedroom residences from 739 to 2,306 sq.ft.",
      },
      { q: "What is the project size?", a: "3.46 acres (14,001 sq.m.) with two towers." },
      {
        q: "What are the key amenities?",
        a: "Clubhouse (~15,072 sq.ft.), pools, sports courts, celebration lawn, reflexology walk, pet park, etc.",
      },
      { q: "How many residences are there?", a: "420 residences across two towers." },
      { q: "What is the RERA number?", a: "UPRERAPRJ361748/06/2025." },
      { q: "When is completion expected?", a: "April 2030 (indicative)." },
    ],
    description:
      "SOBHA Aurum in Sector 36, Greater Noida offers 1–4 BHK luxury residences across 3.46 acres with a ~15,000 sq.ft. clubhouse and 420 homes.",
  },
  {
    id: "sobha-altus-tower-2",
    slug: "sobha-altus-tower-2",
    name: "SOBHA Altus – Tower 2 (SOBHA Downtown)",
    developer: "SOBHA Ltd.",
    brand: "SOBHA",
    rating: 4.9,
    location: "Sector 106, Dwarka Expressway, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    sector: "Sector 106",
    micro_market: "Upper Dwarka Expressway",
    rera: "RC/REP/HARERA/GGM/828/560/2024/55 (27/05/2024)",
    status: "New Launch",
    construction_status: "Launched (Tower 2)",
    possession: "Apr 2028 (indicative)",
    launch: "2025",
    price: "₹21,500 / sq.ft (launch)",
    configuration:
      "3, 4 & 5 BHK Luxury Residences (+ select private terrace options)",
    typologies: [
      "3 BHK (2,870–2,958 sq.ft.)",
      "4 BHK (3,045–3,109 sq.ft.)",
      "4 BHK + Private Terrace (3,216–3,340 sq.ft.)",
      "5 BHK (3,690–3,779 sq.ft.)",
      "5 BHK + Private Terrace (3,853 sq.ft.)",
    ],
    sizes: "2,870 – 3,853 sq.ft. (SBA)",
    land_area: "≈ 5.51 acres",
    towers: 2,
    floors: "3B + G + 28 (residential towers)",
    total_units: "293 (incl. studios/annex as per master plan)",
    bank_approvals: ["HDFC", "ICICI", "SBI", "Axis"],
    usp: [
      "Iconic twin towers with fluidic, parametric façade",
      "Only ~104 residences per tower (4 per floor) for high exclusivity",
      "270° wrap-around balconies with wave-like elevation",
      "‘The Waverly Club’ – ~46,081 sq.ft. lifestyle clubhouse",
      "Premium Retail Boulevard at doorstep",
      "Biophilic-inspired landscape; IGBC Green Homes pre-certified (Gold)",
    ],
    highlights: [
      "Podium-level infinity pool + temperature-controlled indoor pool",
      "State-of-the-art gym, squash & badminton courts, table tennis",
      "Banquet halls, café & co-working lounge",
      "Kids’ play deck, hobby rooms, zen garden & reflexology walk",
      "Party lawns, yoga lawn, alfresco deck & jogging loop (≈840 m)",
      "Guest suites; steam/sauna/massage rooms",
      "Premium retail boulevard with cafés and lifestyle brands",
    ],
    amenities: [
      "Clubhouse",
      "Infinity Pool",
      "Indoor Temperature-Controlled Pool",
      "Gymnasium",
      "Squash Court",
      "Badminton Courts",
      "Table Tennis",
      "Indoor Games Lounge",
      "Banquet Halls",
      "Cafe",
      "Business Lounge / Co-working",
      "Steam / Sauna / Massage",
      "Guest Suites",
      "Kids’ Play Area",
      "Hobby Rooms",
      "Jogging Track",
      "Zen Garden",
      "Reflexology Walk",
      "Party Lawns",
      "Alfresco Deck",
      "Retail Boulevard",
      "Multi-tier Security",
    ],
    specs: {
      structure:
        "RCC framed, seismic-compliant towers with contemporary parametric façade",
      air_conditioning: "Provision for split/VRV",
      floor_height: "Premium floor-to-floor height (~3.0 m class)",
      flooring:
        "Premium marble/tiles in living-dining; engineered/wood in bedrooms",
      kitchen: "Modern modular kitchen with provision for dishwasher",
      bathrooms:
        "Branded sanitaryware; glass shower partitions; vanity provision",
      lifts: "High-speed elevators with smart access",
      green: "IGBC Green Homes pre-certified (Gold)",
    },
    about:
      "SOBHA Altus (Tower 2) at Sector 106 is a skyline-defining, ultra-luxury address with wave-like wraparound balconies and a ~46,081 sq.ft. clubhouse. With ~4 residences per floor and biophilic landscapes, Altus brings indoor–outdoor living to life.",
    brochure: "/brochures/sobha-altus.pdf",
    hero: "/projects/sobha-altus-tower-2/hero.jpg",
    gallery: [
      "/projects/sobha-altus-tower-2/gallery/Altus-3.webp",
      "/projects/sobha-altus-tower-2/g2.jpg",
      "/projects/sobha-altus-tower-2/g3.jpg",
      "/projects/sobha-altus-tower-2/g4.jpg",
    ],
    map: {
      embed:
        "https://www.google.com/maps?q=SOBHA+Altus,+Sector+106,+Gurugram&z=15&output=embed",
      lat: 28.52,
      lng: 76.996,
    },
    nearby: {
      schools: [
        "Mount Carmel School",
        "Imperial Heritage School",
        "The Shri Ram School (nearby campuses)",
        "Euro International School",
      ],
      hospitals: [
        "Artemis Hospital",
        "Medanta – The Medicity",
        "Manipal Hospital",
        "Aakash Healthcare",
      ],
      malls: [
        "Ambience Mall (NH-48/Aerocity belt)",
        "Vegas Mall (Dwarka)",
        "Neo Centra / Conscient One / local high-street cluster",
      ],
      connectivity: [
        { label: "Dwarka Expressway", time: "Immediate access" },
        { label: "IGI Airport / Aerocity", time: "≈ 25–30 min" },
        { label: "Diplomatic Enclave 2 (planned)", time: "Proposed proximity" },
        { label: "CPR / KMP / NH-48 network", time: "Quick arterial connectivity" },
      ],
    },
    paymentPlan: {
      launchOffer:
        "Pay 25% now; 2-year payment holiday; balance linked to milestones",
      note:
        "Limited-period inaugural plan; terms & eligibility as per developer policy",
    },
    legal: {
      disclaimer:
        "All details/specifications are indicative and subject to change. Verify current RERA, availability, prices and payment plans from official SOBHA documentation and HARERA.",
    },
    seo: {
      title:
        "SOBHA Altus Tower 2 – Ultra-Luxury 3/4/5 BHK on Dwarka Expressway, Sector 106, Gurugram",
      description:
        "Presenting SOBHA Altus – Tower 2 at Sector 106. Iconic twin-tower residences with 270° wraparound balconies and The Waverly Club (~46,081 sq.ft.). Launch price ₹21,500/sq.ft. Enquire now with Altina™ Livings.",
      canonical:
        "https://www.altinalivings.com/projects/sobha-altus-tower-2",
    },
    virtualTourUrl: "https://www.youtube.com/watch?v=KHnW1vKcErM",
    featured: true,
    featured_order: 2,
    heroAlt:
      "SOBHA Altus – Tower 2 on Dwarka Expressway with wave-like wraparound balconies",
    galleryAlt: [
      "SOBHA Altus – parametric façade day view",
      "The Waverly Club – pool & leisure deck",
      "SOBHA Altus – landscaped podium and retail boulevard",
      "Residence interiors with wraparound balcony",
    ],
    faq: [
      { q: "What is the starting price of SOBHA Altus?", a: "₹6.5 Cr onwards (subject to availability)." },
      { q: "Where is SOBHA Altus located?", a: "Sector 106, Dwarka Expressway, Gurugram." },
      {
        q: "What apartment types are there in SOBHA Altus?",
        a: "4 & 5 bedroom residences and 1-bedroom studio residences.* *The 4th/5th bedroom shown in the plan is meant for service personnel as per the sanctioned building plan; use as a bedroom is at the buyer’s discretion.",
      },
      { q: "What is the total site size of SOBHA Altus?", a: "≈ 5.51 acres (22,298.20 sq.m.)." },
      {
        q: "How many residences are there in SOBHA Altus?",
        a: "293 residences (204 units of 4 & 5 bed residences and 85 studio units, as per plan).",
      },
      { q: "What is the RERA registration number?", a: "RC/REP/HARERA/GGM/828/560/2024/55 (dated 27/05/2024)." },
      { q: "When is the completion date?", a: "April 2028 (indicative; subject to approvals and construction progress)." },
    ],
    description:
      "💥 New Launch: SOBHA Altus – Tower 2 at SOBHA Downtown, Sec-106. Ultra-luxury 3/4/5 BHK residences with iconic parametric façade, 270° wraparound balconies and The Waverly Club (~46k sq.ft.). Limited inventory, launch price ₹21,500/sq.ft.",
  },

  // NEW: SOBHA Aranya
  {
    id: "sobha-aranya",
    slug: "sobha-aranya-sector-80-gurugram",
    name: "SOBHA Aranya",
    developer: "SOBHA Ltd.",
    brand: "SOBHA",
    rating: 4.8,
    location: "Karma Lakelands, Sector 80, Gurugram (off NH-48)",
    city: "Gurugram",
    state: "Haryana",
    sector: "Sector 80",
    micro_market: "NH-48 / Manesar – SPR belt",
    rera: "RC/REP/HARERA/GGM/808/540/2024/35 (01-Apr-2024)",
    status: "Launched",
    construction_status: "Under Construction",
    possession: "TBA (phase-wise)",
    launch: "2025",
    price: "₹7.1 Cr onwards",
    configuration: "3 & 4 BHK Eco-luxe Residences",
    typologies: ["3 BHK", "4 BHK"],
    sizes: "TBA",
    land_area: "≈ 31 acres (≈ 1,25,453 sq.m.)",
    towers: 5,
    floors: "Phase 1: 3B + G + 43/46",
    total_units: "524 residences (Phase 1)",
    bank_approvals: ["HDFC", "ICICI", "SBI", "Axis"],
    usp: [
      "Eco-luxe community within Karma Lakelands",
      "85%+ open spaces with large central amenity zone",
      "Signal-free connectivity to Delhi & IGI Airport via Dwarka Expressway/NH-48",
      "SOBHA quality with 1,400+ QC checks before handover",
    ],
    highlights: [
      "6-lane Olympic-size pool",
      "≈75,000 sq.ft. clubhouse (Club Antara)",
      "Green terraces on various floors",
      "Privacy-first tower planning (no homes face each other)",
      "Thermal-insulation glass sliders; balcony wood-like finish",
    ],
    amenities: [
      "Clubhouse",
      "Indoor Temperature-Controlled Pool",
      "Leisure Pool",
      "Kids’ Pool",
      "Badminton Court",
      "Squash",
      "Gym & Yoga / Activity Rooms",
      "Co-working Lounge & Cafe",
      "Mini Theatre",
      "Jogging / Cycling Path",
      "Outdoor Fitness Deck",
      "Reflexology Pavilion",
      "Camping Grounds",
      "Amphitheatre",
      "Celebration & Party Lawns",
      "Zen-themed Hanging Garden",
      "Healing / Scented / Feature Gardens",
      "Pet Park",
      "Forest Groves & Ecology Deck",
      "Eco Pond",
      "Periphery vehicular circulation (amenities zone kept car-free)",
    ],
    specs: {
      structure: "RCC framed high-rise towers",
      floor_height: "Premium high-rise class (tower-wise)",
      air_conditioning: "Provisioned; VRV/VRF readiness (as per tower)",
      flooring:
        "Premium tiles/marble in living-dining; wooden/engineered in bedrooms",
      kitchen: "Modern modular kitchen provisions",
      bathrooms:
        "Branded sanitaryware; glass shower partitions (typ.)",
      green: "Solar panels, rainwater harvesting, sustainable landscape planning",
    },
    about:
      "SOBHA Aranya is an eco-luxe residential address inside Karma Lakelands, Sector 80, Gurugram. Phase 1 offers 524 residences across five towers with expansive green zones, a 75,000 sq.ft. clubhouse, an Olympic-size pool and nature-first planning for inside-outside living.",
    brochure: "/brochures/sobha-aranya.pdf",
    hero: "/projects/sobha-aranya/hero.jpg",
    gallery: [
      "/projects/sobha-aranya/g1.jpg",
      "/projects/sobha-aranya/g2.jpg",
      "/projects/sobha-aranya/g3.jpg",
      "/projects/sobha-aranya/g4.jpg",
    ],
    map: {
      embed:
        "https://www.google.com/maps?q=Karma+Lakelands,+Sector+80,+Gurugram&z=14&output=embed",
    },
    nearby: {
      schools: [
        "Bal Bharti School (≈3.7 km)",
        "DPS Sector 84 (≈6.6 km)",
        "Maitri Kiran School",
        "Indian School of Hospitality",
        "Amity University (≈14 km)",
      ],
      hospitals: [
        "Aarvy Hospital (≈7.5 km)",
        "Medanta – Medicity (≈16 km)",
        "Artemis (≈19 km)",
        "Signature Advanced Hospital (≈15 km)",
      ],
      malls: ["Trehan IRIS Broadway (≈5.8 km)", "Aria Mall (≈15 km)"],
      connectivity: [
        { label: "NH-48 / Kherki Daula", time: "Immediate access" },
        { label: "Dwarka Expressway", time: "Signal-free drive to Delhi/IGI" },
        { label: "IMT Manesar", time: "≈ 6 km" },
      ],
    },
    legal: {
      disclaimer:
        "All images/specifications are indicative and subject to change. Verify latest details, approvals, availability and prices with the developer and HARERA.",
    },
    seo: {
      title:
        "SOBHA Aranya – Eco-Luxe 3 & 4 BHK at Karma Lakelands, Sector 80 Gurugram",
      description:
        "Eco-luxe residences by SOBHA inside Karma Lakelands, Sector 80 Gurugram. 31 acres, 524 residences (Phase 1), ~75,000 sq.ft. clubhouse & Olympic-size pool.",
      canonical:
        "https://www.altinalivings.com/projects/sobha-aranya-sector-80-gurugram",
    },
    featured: true,
    featured_order: 6,
    heroAlt:
      "SOBHA Aranya at Karma Lakelands – Eco-luxe towers in Sector 80, Gurugram",
    galleryAlt: [
      "SOBHA Aranya – tower elevation and forest-edge views",
      "Club Antara – clubhouse and leisure pool",
      "Eco-amenities: forest grove, eco pond, reflexology walk",
      "Balcony and living spaces with nature-first design",
    ],
    faq: [
      { q: "What is the starting price of SOBHA Aranya?", a: "₹7.1 Cr onwards (subject to availability)." },
      { q: "Where is SOBHA Aranya located?", a: "Karma Lakelands, Sector 80, Gurugram, Haryana, off NH-48." },
      { q: "What apartment types are available?", a: "3 & 4 bedroom eco-luxe residences." },
      { q: "What is the total site size?", a: "≈ 31 acres (≈ 1,25,453 sq.m.)." },
      { q: "What are the key amenities?", a: "6-lane Olympic-size pool, ~75,000 sq.ft. clubhouse, camping grounds, celebration lawn, zen hanging garden, forest grove, pet park, reflexology pavilion, kids’ pool, fountain deck, and more." },
      { q: "How many residences are there in Phase 1?", a: "524 residences." },
      { q: "What is the RERA number?", a: "RC/REP/HARERA/GGM/808/540/2024/35 (01-Apr-2024)." },
    ],
    description:
      "SOBHA Aranya at Karma Lakelands brings eco-luxe 3 & 4 BHK residences across 31 acres with 85%+ open spaces, a marquee clubhouse and Olympic-size pool—crafted with SOBHA’s quality and nature-first planning.",
  },
  
  {
  "id": "m3m-jacob-co-residences",
  "slug": "m3m-jacob-and-co-sector-97-noida",
  "name": "M3M Jacob & Co. Residences",
  "developer": "M3M",
  "brand": "Jacob & Co. (Branded Residences)",
  "rating": 4.8,
  "location": "Sector 97, Noida, Uttar Pradesh",
  "city": "Noida",
  "state": "Uttar Pradesh",
  "sector": "Sector 97",
  "micro_market": "Noida Expressway / River View Belt (indicative)",
  "status": "Launched",
  "construction_status": "Under Development",
  "possession": "TBA",
  "launch": "2025",
  "price": "Inaugural from ₹31,000–36,000 / sq.ft (typology-wise)",
  "configuration": "3, 4 & 5 BHK Limited Branded Residences",
  "typologies": [
    "3 BHK",
    "4 BHK",
    "5 BHK"
  ],
  "sizes": "TBA",
  "land_area": "≈ 6 acres",
  "towers": 2,
  "floors": "Podium + High-rise (crown lounges)",
  "total_units": "Limited residences (privacy-first; brochure claims exclusive floors)",
  "usp": [
    "First Jacob & Co. branded address in India",
    "Wrap-around balconies; uninterrupted horizons",
    "Residences elevated ≈30 m above ground",
    "Distinct Sky Lounge per tower (Cinema / Whiskey / Music / Conservatory)"
  ],
  "highlights": [
    "Podium temperature-controlled pool",
    "Events pavilion & alfresco terraces",
    "Garden lounge and sculptural lighting",
    "Art & landscaping woven through podium"
  ],
  "amenities": [
    "Clubhouse",
    "Temperature-controlled pool",
    "Events pavilion",
    "Alfresco terrace",
    "Garden lounge",
    "Sky lounges (tower crowns)"
  ],
  "about": "Limited-edition branded residences across ~6 acres in Sector 97, Noida, with dramatic horizons, elevated podium living and Jacob & Co.'s signature sky lounges.",
  "brochure": "/brochures/m3m-jacob-co.pdf",
  "hero": "/projects/m3m-jacob-co-residences/hero.jpg",
  "gallery": [
    "/projects/m3m-jacob-co-residences/g1.jpg",
    "/projects/m3m-jacob-co-residences/g2.jpg",
    "/projects/m3m-jacob-co-residences/g3.jpg",
    "/projects/m3m-jacob-co-residences/g4.jpg"
  ],
  "seo": {
    "title": "M3M Jacob & Co. Residences Sector 97, Noida – Branded 3/4/5 BHK",
    "description": "India’s first Jacob & Co. branded residences by M3M at Sector 97, Noida. ~6 acres, limited residences, elevated podium at ~30m, sky lounges per tower.",
    "canonical": "https://www.altinalivings.com/projects/m3m-jacob-and-co-sector-97-noida"
  },
  "faq": [
    {
      "q": "What is the inaugural pricing?",
      "a": "3 BHK at ₹31,000/sq.ft, 4 BHK at ₹32,000/sq.ft, 5 BHK at ₹36,000/sq.ft (limited period)."
    },
    {
      "q": "Where is the project located?",
      "a": "Sector 97, Noida; with views of Yamuna River and a golf course; ~6 acres site area."
    },
    {
      "q": "What are the unique sky amenities?",
      "a": "Sky Cinema, Whiskey Bar, Music Lounge, Conservatory Garden on tower crowns."
    },
    {
      "q": "How is the podium planned?",
      "a": "At approx 30 m above ground, with temperature-controlled pool, events pavilion, alfresco terraces and garden lounges."
    }
  ],
  "legal": {
    "disclaimer": "All imagery and information are artistic impressions and indicative per the promoter; verify current details directly."
  },
  "featured": true,
  "featured_order": 7
}
];

export default projects;
