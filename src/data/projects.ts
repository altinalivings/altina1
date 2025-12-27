// src/data/projects.ts
// Projects configuration for Altina Livings

export type PropertyType = "Residential" | "Commercial" | "Mixed";

export type LocationAdvantage = {
  connectivity?: string[];
  schools?: string[];
  healthcare?: string[];
  markets?: string[];
};

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

  // ✅ Page sections (as per our standard)
  usp?: string[];
  location_advantage?: LocationAdvantage;
  highlights?: string[];
  specifications?: string[];

  // Optional blocks (keep for future expansion)
  amenities?: string[];
  overview?: string;
  payment_plan?: string;
  inventory_note?: string;

  hero?: string;
  heroAlt?: string;
  gallery?: string[];
  map?: { embed?: string; lat?: number; lng?: number };

  // SEO
  tags?: string[];
  seo?: { title?: string; description?: string; canonical?: string };

  featured?: boolean;
  featured_order?: number;
  description?: string;

  // ✅ Explicit classification for filters
  propertyType?: PropertyType;

  // Optional media (render only when present)
  brochure_pdf?: string; // place brochure in /public/brochures/...
  video_url?: string; // youtube walkthrough / reel
  whatsapp_prefill?: string; // prefilled WA text (optional)
};

const projects: Project[] = [
  // -----------------------------
  // DLF | Residential | Delhi
  // -----------------------------
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
    propertyType: "Residential",
    configuration: "2, 3 & 4 BHK Residences",
    typologies: ["2 BHK", "3 BHK", "4 BHK + SQ"],
    sizes: "1,732 – 3,000 sq.ft.",
    land_area: "≈ 5.1 acres",
    towers: 4,
    floors: "G+39",
    total_units: "≈ 915 apartments",

    // ✅ As per page structure
    usp: [
      "Central Delhi–adjacent address on Shivaji Marg",
      "Gated high-rise living with clubhouse amenities",
      "Green belt surroundings and planned community ecosystem",
    ],
    location_advantage: {
      connectivity: [
        "Strong West–Central Delhi road connectivity via Shivaji Marg",
        "Metro in the wider Moti Nagar / Kirti Nagar belt (verify approach)",
      ],
      schools: ["Established schools available in West Delhi catchment (shortlist by commute)"],
      healthcare: ["Hospitals and clinics across West/Central Delhi corridor (verify nearest options)"],
      markets: ["Daily convenience and retail options in the wider Moti Nagar / Kirti Nagar belt"],
    },
    highlights: [
      "Ready-to-move luxury high-rise community",
      "Tower / floor / facing based options (view-led pricing)",
      "Clubhouse and lifestyle amenities within the community",
      "Good fit for end-use and long-hold buyers",
      "Best shortlisted by: tower + facing + size + budget",
    ],
    specifications: [
      "High-rise towers with premium common areas (inventory-dependent)",
      "Landscaped internal greens and community spaces",
      "Managed gated security and community upkeep",
      "Apartment features and inclusions vary by unit (verify unit-wise)",
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
    overview:
      "DLF One Midtown is a premium high-rise residential community in Moti Nagar for buyers seeking a Central-Delhi adjacent address and a complete lifestyle ecosystem.",
    inventory_note:
      "Availability and pricing change frequently. Share size, budget, tower preference and facing to get the current live inventory shortlist.",

    hero: "/projects/dlf-one-midtown/hero.jpg",
    heroAlt: "DLF One Midtown towers with landscaped greens in Moti Nagar",
    gallery: [
      "/projects/dlf-one-midtown/g1.webp",
      "/projects/dlf-one-midtown/g2.webp",
      "/projects/dlf-one-midtown/g3.webp",
      "/projects/dlf-one-midtown/g4.webp",
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.6657,77.1543&z=16&output=embed",
      lat: 28.6657,
      lng: 77.1543,
    },
    tags: [
      "DLF One Midtown",
      "Moti Nagar",
      "Shivaji Marg",
      "West Delhi luxury apartments",
      "Central Delhi adjacent",
      "Ready to move",
      "2 BHK",
      "3 BHK",
      "4 BHK",
    ],
    seo: {
      title: "DLF One Midtown, Moti Nagar – Luxury 2, 3 & 4 BHK | Altina Livings",
      description:
        "Explore DLF One Midtown in Moti Nagar: ready-to-move luxury 2/3/4 BHK residences with clubhouse amenities and strong West–Central Delhi connectivity.",
      canonical: "https://altinalivings.com/projects/dlf-one-midtown-moti-nagar",
    },
    featured: true,
    featured_order: 1,
    description:
      "DLF One Midtown is a landmark luxury high-rise community in Moti Nagar with premium specifications and proximity to Central Delhi.",
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
    propertyType: "Residential",
    price: "₹2.5 Cr onwards",
    configuration: "3 & 4 BHK Low-rise Independent Floors",
    typologies: ["3 BHK + Store", "4 BHK + Store + Utility"],

    usp: [
      "Low-rise floors with fewer neighbours and higher privacy",
      "Township ecosystem inside DLF Garden City",
      "Gated pockets with greens and planned circulation",
    ],
    location_advantage: {
      connectivity: [
        "New Gurugram corridor connectivity (pocket-specific)",
        "Verify expressway access and daily commute routes by exact pocket",
      ],
      schools: ["Schools in the wider New Gurugram catchment (shortlist by pocket and route)"],
      healthcare: ["Healthcare options available across Gurugram catchment (verify nearest facilities)"],
      markets: ["Daily convenience within township catchment and surrounding sectors (verify pocket-wise)"],
    },
    highlights: [
      "Independent-floor lifestyle inside a township framework",
      "Better privacy vs typical high-rise group housing",
      "Inventory varies by phase and pocket—unit-wise shortlisting recommended",
    ],
    specifications: [
      "Low-rise floor layouts (phase and inventory dependent)",
      "Gated pockets with community greens",
      "Unit-wise inclusions vary—verify exact specification sheet",
    ],

    amenities: ["Community Greens", "Gated Complex Pockets"],
    overview:
      "DLF Independent Floors (Phase 2 & 3) are for buyers who prefer low-density living with township planning and gated security.",
    inventory_note:
      "Availability varies by phase and pocket. Share configuration, budget range and pocket preference for the live inventory list.",

    hero: "/projects/dlf-independent-floors-phase-2-3/hero.jpg",
    heroAlt: "DLF Independent low-rise floors in DLF Garden City, Gurugram",
    gallery: [
      "/projects/dlf-independent-floors-phase-2-3/g1.webp",
      "/projects/dlf-independent-floors-phase-2-3/g2.webp",
      "/projects/dlf-independent-floors-phase-2-3/g3.webp",
    ],
    tags: ["Gurugram", "Low-Rise Floors", "DLF Township", "3 BHK", "4 BHK"],
    seo: {
      title: "DLF Independent Floors Phase 2 & 3 – Low-Rise 3 & 4 BHK | Altina Livings",
      description:
        "Explore DLF Independent Floors (Phase 2 & 3) in DLF Garden City, Gurugram: premium low-rise 3/4 BHK floors offering privacy and township living.",
      canonical: "https://altinalivings.com/projects/dlf-independent-floors-phase-2-3",
    },
    featured: false,
    description:
      "DLF Independent Floors combine independent living with gated security and township planning in New Gurugram.",
  },

  // -----------------------------
  // DLF | Commercial | Gurugram
  // -----------------------------
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
    propertyType: "Commercial",
    price: "Price on Request",

    usp: [
      "Freehold SCO plots on Golf Course Extension Road",
      "Retail, F&B and office-compatible format",
      "Catchment-driven commercial corridor",
    ],
    location_advantage: {
      connectivity: ["Golf Course Extension Road access", "Strong linkages to GCX / SPR residential belts"],
      schools: ["Dense residential catchment in the wider belt supports daily retail (catchment-driven)"],
      healthcare: ["Gurugram healthcare network within broader corridor (verify nearest options)"],
      markets: ["Strong residential catchment along GCX and SPR drives footfall potential (validate assumptions)"],
    },
    highlights: [
      "High-visibility frontage opportunity (plot-wise)",
      "Suitable for retail, F&B, clinics, offices and boutique brands",
      "Terms, norms and plot sizes are inventory dependent",
    ],
    specifications: [
      "SCO plot-based format (plot size and norms dependent)",
      "Parking and high-street positioning (layout dependent)",
    ],

    amenities: ["High Street Retail Environment", "Parking"],
    overview:
      "A freehold SCO opportunity for retail, F&B and office formats in a strong catchment corridor (verify plot-wise norms and terms).",
    inventory_note:
      "Plot sizes, pricing and allotment terms vary. Request the latest inventory sheet and payment schedule.",

    hero: "/projects/dlf-central-67-sco/hero.jpg",
    heroAlt: "DLF Central 67 SCO site on Golf Course Extension Road",
    gallery: [
      "/projects/dlf-central-67-sco/g1.webp",
      "/projects/dlf-central-67-sco/g2.webp",
      "/projects/dlf-central-67-sco/g3.webp",
    ],
    seo: {
      title: "DLF Central 67 – SCO Plots in Sector 67 Gurugram | Altina Livings",
      description:
        "DLF Central 67 offers freehold SCO plots in Sector 67 on Golf Course Extension Road, suitable for retail, F&B and office use in a high-visibility corridor.",
      canonical: "https://altinalivings.com/projects/dlf-central-67-sco-sector-67-gurgaon",
    },
    featured: false,
    description:
      "DLF Central 67 SCO is a freehold commercial opportunity for investors and business owners on Golf Course Extension Road.",
  },

  // -----------------------------
  // SOBHA | Residential | Gurugram / Noida
  // -----------------------------
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
    propertyType: "Residential",

    usp: [
      "Signature SOBHA high-rise on Dwarka Expressway",
      "Low-density luxury positioning with expansive views",
      "SOBHA quality and detailing theme (inventory dependent)",
    ],
    location_advantage: {
      connectivity: ["Dwarka Expressway corridor", "Delhi border / IGI connectivity theme (time varies by traffic)"],
      schools: ["Schools in the wider Dwarka Expressway / Gurugram catchment (shortlist by route)"],
      healthcare: ["Hospitals and clinics across Gurugram–Delhi corridor (verify nearest options)"],
      markets: ["Daily convenience in the wider sector belt (verify micro-catchment)"],
    },
    highlights: [
      "Premium 3 & 4 BHK positioning",
      "Expressway corridor growth theme",
      "High-spec living and curated amenities (tower-wise)",
    ],
    specifications: [
      "High-rise community with SOBHA build detailing (inventory dependent)",
      "Clubhouse and lifestyle amenities (as per tower plan)",
    ],

    amenities: ["Clubhouse", "Swimming Pool", "Gymnasium", "Landscaped Gardens", "Kids’ Play Area"],
    overview:
      "A premium high-rise offering in Sector 106, positioned for buyers looking for SOBHA craftsmanship and Dwarka Expressway connectivity.",
    inventory_note:
      "Sizes and pricing are indicative. Confirm the latest rate card, PLCs and inventory availability.",

    hero: "/projects/sobha-altus/hero.jpg",
    heroAlt: "SOBHA Altus towers on Dwarka Expressway at dusk",
    gallery: [
      "/projects/sobha-altus/g1.webp",
      "/projects/sobha-altus/g2.webp",
      "/projects/sobha-altus/g3.webp",
      "/projects/sobha-altus/g4.webp",
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.5324,77.0463&z=16&output=embed",
      lat: 28.5324,
      lng: 77.0463,
    },
    seo: {
      title: "SOBHA Altus – Luxury 3 & 4 BHK on Dwarka Expressway | Altina Livings",
      description:
        "SOBHA Altus in Sector 106 offers luxury 3 & 4 BHK residences along Dwarka Expressway with premium amenities and signature SOBHA quality.",
      canonical: "https://altinalivings.com/projects/sobha-altus-sector-106-gurgaon",
    },
    featured: true,
    featured_order: 2,
    description:
      "SOBHA Altus is a landmark luxury high-rise development with expansive residences and SOBHA’s meticulous build quality.",
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
    propertyType: "Residential",
    construction_status: "Ongoing",
    configuration: "1, 2, 3 & 4 BHK Residences",
    price: "₹21,500 / sq.ft* (indicative)",

    usp: ["SOBHA presence in Greater Noida belt", "Family-oriented amenity ecosystem", "Multiple configuration range (as indicated)"],
    location_advantage: {
      connectivity: ["Noida–Greater Noida Expressway access theme", "Sector approach and traffic impact travel times"],
      schools: ["Schools in the Greater Noida catchment (shortlist by sector approach)"],
      healthcare: ["Hospitals and clinics in the Noida–Greater Noida corridor (verify nearest options)"],
      markets: ["Daily retail and convenience in the wider expressway belt (verify micro-catchment)"],
    },
    highlights: ["Multiple configuration range (1–4 BHK as indicated)", "Expressway-belt connectivity theme", "Lifestyle amenity focus"],
    specifications: ["Lifestyle clubhouse and community amenities", "Tower specifications vary by phase/inventory"],

    amenities: ["Clubhouse", "Swimming Pool", "Gymnasium", "Jogging Track", "Kids’ Play Area"],
    overview:
      "A residential community positioned for buyers seeking SOBHA build standards in the Noida–Greater Noida belt with a lifestyle amenity focus.",
    inventory_note:
      "Indicative pricing shown. Confirm the latest rate card, size matrix and unit availability.",

    hero: "/projects/sobha-aurum/hero.jpg",
    heroAlt: "SOBHA Aurum residential towers in Greater Noida",
    gallery: ["/projects/sobha-aurum/g1.webp", "/projects/sobha-aurum/g2.webp", "/projects/sobha-aurum/g3.webp"],
    seo: {
      title: "SOBHA Aurum – Luxury Apartments in Sector 36 Greater Noida | Altina Livings",
      description:
        "SOBHA Aurum is an upcoming residential project in Sector 36, Greater Noida offering 1–4 BHK homes with lifestyle amenities (details inventory dependent).",
      canonical: "https://altinalivings.com/projects/sobha-aurum-sector-36-greater-noida",
    },
    featured: true,
    featured_order: 3,
    description:
      "SOBHA Aurum brings SOBHA’s residential positioning to Greater Noida with a planned community and amenity ecosystem.",
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
    propertyType: "Residential",
    configuration: "3 & 4 BHK Eco-luxury Residences",

    usp: ["Eco-luxury theme with green ambience", "Inside Karma Lakelands environment", "Resort-style lifestyle positioning"],
    location_advantage: {
      connectivity: ["NH-48 corridor access theme", "Connectivity depends on approach and traffic"],
      schools: ["Schools in the wider NH-48 / Gurugram catchment (shortlist by commute needs)"],
      healthcare: ["Healthcare options across Gurugram corridor (verify nearest facilities)"],
      markets: ["Daily convenience in the wider corridor; resort ecosystem amenities may apply (verify)"],
    },
    highlights: ["Resort-style living theme", "Low-density / green ambience positioning", "Pre-launch: details may change at official release"],
    specifications: ["Eco-luxury positioning with curated amenities", "Final specifications depend on launch inventory"],

    amenities: ["Clubhouse", "Swimming Pool", "Gym & Fitness", "Jogging & Cycling Tracks", "Kids’ Play Areas"],
    overview:
      "A resort-style, eco-luxury positioning in a green, low-density environment, oriented towards lifestyle buyers and long-horizon owners.",
    inventory_note:
      "Pre-launch details may change. Confirm configuration, sizes, RERA and payment terms at launch.",

    hero: "/projects/sobha-aranya/hero.jpg",
    heroAlt: "SOBHA Aranya eco-luxury homes amidst greens at Karma Lakelands",
    gallery: ["/projects/sobha-aranya/g1.webp", "/projects/sobha-aranya/g2.webp", "/projects/sobha-aranya/g3.webp"],
    seo: {
      title: "SOBHA Aranya – Eco-Luxury Residences at Karma Lakelands | Altina Livings",
      description:
        "SOBHA Aranya is an eco-luxury residential development in the Karma Lakelands environment along NH-48, offering resort-style living (details subject to launch).",
      canonical: "https://altinalivings.com/projects/sobha-aranya-delhi-ncr",
    },
    featured: true,
    featured_order: 5,
    description:
      "SOBHA Aranya combines eco-luxury living, resort ambience and SOBHA craftsmanship at Karma Lakelands (subject to official launch updates).",
  },

  // -----------------------------
  // M3M | Mixed | Noida
  // -----------------------------
  {
    id: "m3m-jacob",
    slug: "m3m-jacob",
    name: "M3M Jacob",
    developer: "M3M",
    brand: "Jacob & Co.",
    rating: 4.7,
    location: "Sector 97, Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    sector: "Sector 97",
    status: "Pre-launch",
    propertyType: "Mixed",
    construction_status: "Planned",
    configuration: "3, 4 & 5 BHK Branded Residences",

    usp: ["Branded residences positioning (Jacob & Co.)", "Ultra-luxury segment targeting HNI/UHNI buyers", "Design-led lifestyle theme (launch dependent)"],
    location_advantage: {
      connectivity: ["Sector 97 belt connectivity (verify micro-location and approach roads)", "Travel time depends on Noida corridors and traffic"],
      schools: ["Schools in the wider Noida catchment (shortlist by preferred access routes)"],
      healthcare: ["Hospitals in Noida–Delhi corridor (verify nearest facilities)"],
      markets: ["Retail and convenience in Noida catchment (verify proximity by micro-location)"],
    },
    highlights: [
      "Pre-launch: details may change at official release",
      "Curated amenities positioning (launch dependent)",
      "Best suited for luxury end-use and collector-style inventory (final offering dependent)",
    ],
    specifications: [
      "Branded clubhouse / lifestyle amenities (final specs to be confirmed)",
      "Inventory specs may vary by tower and unit series",
    ],

    amenities: ["Branded Clubhouse", "Swimming Pool", "Sky Lounges", "Gymnasium", "Spa / Wellness"],
    overview:
      "A branded-residences positioning aimed at the luxury segment. Validate final inventory, brand deliverables and specifications from official releases.",
    inventory_note:
      "Pre-launch inventory and pricing may change. Confirm configuration, sizes and brand deliverables once announced.",

    hero: "/projects/m3m-jacob/hero.jpg",
    heroAlt: "M3M Jacob & Co. branded luxury residence towers in Noida",
    gallery: ["/projects/m3m-jacob/g1.jpg", "/projects/m3m-jacob/g2.jpg", "/projects/m3m-jacob/g3.jpg"],
    map: {
      embed: "https://www.google.com/maps?q=Sector%2097%20Noida&z=15&output=embed",
    },
    seo: {
      title: "M3M Jacob & Co. Residences – Branded Luxury in Noida | Altina Livings",
      description:
        "M3M Jacob & Co. Residences bring a branded luxury positioning to Noida with curated lifestyle amenities (details subject to official launch updates).",
      canonical: "https://altinalivings.com/projects/m3m-jacob",
    },
    featured: true,
    featured_order: 7,
    description:
      "M3M Jacob & Co. Residences are positioned as ultra-luxury branded homes with design-led amenities (subject to official launch updates).",
  },

  // -----------------------------
  // GYGY | Commercial | Noida
  // -----------------------------
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
    propertyType: "Commercial",
    typologies: ["Ground Floor Retail – 102.09 sq.ft onwards", "Office Spaces – 475 sq.ft onwards"],
    sizes: "Retail from 102.09 sq.ft • Offices from 475 sq.ft",
    land_area: "≈ 5 acres (fully paid-up land)",

    usp: ["Fully paid-up 5-acre commercial land", "Limited ground-floor retail inventory", "Select schemes / assured returns are inventory dependent (validate officially)"],
    location_advantage: {
      connectivity: ["Noida Expressway access", "FNG + Yamuna Expressway connectivity theme", "Metro in broader Sector 137/142 belt (verify approach)"],
      schools: ["Residential catchment supports daily retail (catchment-driven; validate assumptions)"],
      healthcare: ["Healthcare options in Noida corridor (verify nearest facilities)"],
      markets: ["30,000+ family catchment theme in nearby sectors (validate from official sources)"],
    },
    highlights: [
      "Retail + office mix for investor and end-user needs",
      "Expressway corridor with established residential catchment",
      "Scheme/assurance terms must be validated from official documents",
    ],
    specifications: [
      "Retail high-street + office tower format (inventory dependent)",
      "Parking and common areas as per final layout",
    ],

    amenities: [
      "Premium Retail High Street",
      "Office Lobby & Business Centre",
      "Food Court & F&B Options",
      "Landscaped Courtyards",
      "Basement Parking",
      "24x7 Security & CCTV",
    ],
    overview:
      "A commercial development on the Noida Expressway corridor featuring retail and office formats. Validate scheme terms from official documents.",
    inventory_note:
      "Pricing and schemes are inventory-based. Request the latest official rate card and scheme sheet before committing.",

    hero: "/projects/gygy-mentis/hero.jpg",
    heroAlt: "GYGY Mentis commercial towers and retail plaza in Sector 140 Noida",
    gallery: [
      "/projects/gygy-mentis/g1.jpg",
      "/projects/gygy-mentis/g2.jpg",
      "/projects/gygy-mentis/g3.jpg",
      "/projects/gygy-mentis/g4.jpg",
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.5115,77.4130&z=16&output=embed",
      lat: 28.5115,
      lng: 77.413,
    },
    seo: {
      title: "GYGY Mentis Sector 140 Noida – Retail & Office Spaces | Altina Livings",
      description:
        "GYGY Mentis in Sector 140 offers ground-floor retail and office spaces on Noida Expressway with strong catchment and connectivity.",
      canonical: "https://altinalivings.com/projects/gygy-mentis-sector-140-noida",
    },
    featured: true,
    featured_order: 6,
    description:
      "GYGY Mentis is a commercial development offering retail shops and office spaces with strong residential and corporate catchment.",
  },

  // -----------------------------
  // Smartworld | Residential | Manesar
  // -----------------------------
  {
    id: "smartworld-gic",
    slug: "smartworld-gic",
    name: "Smartworld GIC (Gurgaon International City)",
    developer: "Smartworld Developers",
    brand: "Smartworld",
    rating: 4.6,
    location: "Sector M9, Manesar, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    sector: "Sector M9",
    micro_market: "Manesar • Gurgaon International City (GIC)",
    propertyType: "Residential",
    rera: "RERA awaited / expected soon",
    status: "Pre-launch / New Launch",
    construction_status: "New Launch (High-rise)",
    possession: "TBD",
    launch: "New Launch",
    price: "2.5 BHK from ₹1.75 Cr* | 3 BHK Price on Request",
    configuration: "2.5 & 3 BHK High-rise Apartments",
    typologies: ["2.5 BHK", "3 BHK"],
    sizes: "2.5 BHK: 1250–1400 sq.ft | 3 BHK: 1850–1900 sq.ft",
    land_area: "150 Acres (Township)",
    floors: "G+25 (Approx.)",

    usp: ["Part of 150-acre township (GIC)", "IMT Manesar proximity theme", "High-rise format with amenities (launch dependent)"],
    location_advantage: {
      connectivity: ["Manesar / NH-8 influence zone (verify approach)", "Industrial + employment catchment access theme"],
      schools: ["Schools in Manesar / New Gurugram catchment (shortlist by commute)"],
      healthcare: ["Healthcare facilities in the wider Manesar–Gurugram corridor (verify nearest options)"],
      markets: ["Daily convenience will depend on township phase and nearby belt (verify current ecosystem)"],
    },
    highlights: [
      "New launch: verify RERA, phase plan and tower details",
      "2.5 and 3 BHK configuration mix",
      "Pricing and possession depend on launch terms",
    ],
    specifications: [
      "High-rise towers (final tower count/specs to be confirmed)",
      "Clubhouse and lifestyle amenities (as per launch communication)",
    ],

    amenities: ["Grand clubhouse", "Sports & wellness zones", "Outdoor recreation areas", "Landscaped greens", "Community spaces"],
    overview:
      "A township-led residential positioning near Manesar, aimed at buyers looking for a new-launch opportunity in an industrial and infrastructure growth belt.",
    payment_plan:
      "Payment plan slabs to be confirmed from official launch note / allotment terms.",
    inventory_note:
      "RERA and final tower details are awaited. Confirm official documentation before booking.",

    hero: "/projects/smartworld-gic/hero.png",
    heroAlt: "Smartworld GIC Manesar – premium high-rise residences in Gurgaon International City",
    gallery: [
      "/projects/smartworld-gic/gallery/01.jpg",
      "/projects/smartworld-gic/gallery/02.jpg",
      "/projects/smartworld-gic/gallery/03.jpg",
      "/projects/smartworld-gic/gallery/04.jpg",
      "/projects/smartworld-gic/gallery/05.jpg",
      "/projects/smartworld-gic/gallery/06.jpg",
    ],
    map: {
      embed: "https://www.google.com/maps?q=Sector%20M9%20Manesar%20Gurugram&z=14&output=embed",
    },
    seo: {
      title: "Smartworld GIC Manesar – New Launch 2.5 & 3 BHK | Altina Livings",
      description:
        "Smartworld GIC (Manesar) is a township-led new launch offering 2.5 & 3 BHK high-rise apartments. Verify RERA, phase plan and launch terms from official documents.",
      canonical: "https://altinalivings.com/projects/smartworld-gic",
    },
    featured: false,
    description:
      "Smartworld GIC is positioned as a township-led new launch near Manesar, aimed at buyers looking for a premium high-rise opportunity.",
  },

  // -----------------------------
  // SOBHA | Residential | GNW
  // -----------------------------
  {
    id: "sobha-sector-1-gnw",
    slug: "sobha-sector-1-greater-noida-west",
    name: "SOBHA Sector 1 – Greater Noida West",
    developer: "SOBHA Ltd.",
    brand: "SOBHA",
    rating: 4.8,
    location: "Sector 1, Greater Noida West",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    sector: "Sector 1",
    micro_market: "Noida Extension / GNW",
    rera: "TBA",
    status: "Pre-launch / New Launch",
    propertyType: "Residential",
    construction_status: "Planned",
    possession: "Approx. 5 years from launch (as per developer)",
    launch: "EOI phase (as per launch communication)",
    price: "2, 3 & 4 BR Premium Apartments starting @ ₹2.25 Cr*",
    configuration: "2, 3 & 4 BR Premium Apartments",
    typologies: [
      "2 BR + 2T – 1,300 sq.ft (approx.)",
      "3 BR + 2T – 1,600 sq.ft (approx.)",
      "3 BR + 3T – 1,850 sq.ft (approx.)",
      "4 BR + 4T – 2,200–2,500 sq.ft (approx.)",
    ],
    sizes: "1,300 – 2,500 sq.ft* (approx.)",
    land_area: "≈ 12 acres",
    towers: 8,
    floors: "G+45",
    total_units: "≈ 1,375 units",

    usp: [
      "Ultra-luxury high-rise community in Sector 1 GNW",
      "4 apartments per floor (limited density positioning)",
      "Large clubhouse and lifestyle amenities plan",
    ],
    location_advantage: {
      connectivity: ["GNW / Noida Extension belt connectivity", "FNG / NH24 / Pari Chowk connectivity theme (verify travel times)"],
      schools: ["Schools in the GNW catchment (shortlist by sector approach)"],
      healthcare: ["Hospitals and clinics in the GNW–Noida corridor (verify nearest options)"],
      markets: ["Daily convenience in the wider GNW belt (verify micro-catchment)"],
    },
    highlights: [
      "EOI / pre-launch: confirm RERA, rate card and PLCs",
      "Large-format development with clubhouse-led amenities",
      "Family-oriented configuration mix (2–4 BR)",
    ],
    specifications: [
      "High-rise plan with limited apartments per floor positioning",
      "Basement parking and amenity clubhouse plan (subject to final documents)",
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
    overview:
      "A premium high-rise launch in GNW positioned for buyers seeking a luxury upgrade and long-horizon holding in a large-format community plan.",
    inventory_note:
      "Pre-launch details may change. Confirm official brochure, RERA and payment plan before issuing EOI.",

    hero: "/projects/sobha-sector-1-gnw/hero.jpg",
    heroAlt: "SOBHA Sector 1 ultra-luxury towers in Greater Noida West",
    gallery: [
      "/projects/sobha-sector-1-gnw/g1.jpg",
      "/projects/sobha-sector-1-gnw/g2.jpg",
      "/projects/sobha-sector-1-gnw/g3.jpg",
      "/projects/sobha-sector-1-gnw/g4.jpg",
    ],
    map: {
      embed: "https://www.google.com/maps?q=28.603,77.420&z=15&output=embed",
      lat: 28.603,
      lng: 77.42,
    },
    seo: {
      title: "SOBHA Sector 1 Greater Noida West – Ultra-Luxury 2, 3 & 4 BR | Altina Livings",
      description:
        "New launch SOBHA Sector 1 Greater Noida West offers ultra-luxury 2, 3 & 4 BR apartments starting @ ₹2.25 Cr* (details subject to official launch documents).",
      canonical: "https://altinalivings.com/projects/sobha-sector-1-greater-noida-west",
    },
    featured: true,
    featured_order: 4,
    description:
      "SOBHA Sector 1 GNW is positioned as an ultra-luxury high-rise community in the Noida Extension belt (subject to official launch updates).",
  },

  // -----------------------------
  // SOBHA | Mixed | Dwarka Expressway
  // -----------------------------
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
    propertyType: "Mixed",
    construction_status: "Planned",
    possession: "To be announced",
    launch: "2025",
    price: "Under ₹2.5 Cr* all-inclusive (select units) with 4+ year easy payment plan",
    configuration: "1 Bed Serviced Residences + Premium Retail",
    typologies: ["1 Bed Serviced Residences", "High-Street Retail & F&B Spaces"],
    sizes: "Serviced Residences: 856 sq.ft* onwards; Retail: 257 sq.ft* onwards",
    land_area: "≈ 2.03 acres (commercial)",
    towers: 1,
    floors: "4 Basements + Ground + 31 Floors",
    total_units: "≈ 251 serviced residence keys + multiple retail units",

    usp: ["Serviced residences + premium retail in one tower", "Investor-friendly sizing theme (inventory dependent)", "Downtown positioning on Dwarka Expressway belt"],
    location_advantage: {
      connectivity: ["Dwarka Expressway corridor", "Delhi / IGI connectivity theme (traffic dependent)"],
      schools: ["Schools in wider Dwarka Expressway catchment (shortlist by route)"],
      healthcare: ["Hospitals and clinics across Gurugram–Delhi corridor (verify nearest options)"],
      markets: ["Retail ecosystem evolves with sector development (verify current status)"],
    },
    highlights: [
      "Mixed: serviced keys + retail (classification intentional)",
      "Investor-led format; verify operator structure if applicable",
      "Payment plan and scheme terms to be confirmed from official sheet",
    ],
    specifications: [
      "Mixed-use program (serviced keys + retail)",
      "Amenities and operator details subject to official release",
    ],

    amenities: [
      "Triple height entrance lobby",
      "Club amenities over two levels",
      "Infinity edge swimming pool",
      "State-of-the-art gymnasium",
      "Business lounge & meeting spaces",
      "EV charging points",
      "100% power backup",
      "24x7 security & surveillance",
    ],
    overview:
      "A mixed-format tower combining serviced residence keys and retail. Use official scheme sheets to validate rental/assurance or operator details.",
    payment_plan:
      "Payment plan to be confirmed from official scheme sheet / allotment terms.",
    inventory_note:
      "Mixed-use inventory: confirm exact unit series, retail sizes, and scheme applicability before committing.",

    hero: "/projects/sobha-strada/hero.jpg",
    heroAlt: "SOBHA STRADA iconic glass façade tower at SOBHA Downtown Gurugram",
    gallery: ["/projects/sobha-strada/g1.jpg", "/projects/sobha-strada/g2.jpg", "/projects/sobha-strada/g3.jpg", "/projects/sobha-strada/g4.jpg"],
    map: {
      embed: "https://www.google.com/maps?q=28.5324,77.0463&z=16&output=embed",
      lat: 28.5324,
      lng: 77.0463,
    },
    seo: {
      title: "SOBHA STRADA – Serviced Residences & Retail at SOBHA Downtown | Altina Livings",
      description:
        "SOBHA STRADA at SOBHA Downtown, Sector 106 Gurugram combines 1-bed serviced residences and premium retail near Dwarka Expressway (details subject to official documents).",
      canonical: "https://altinalivings.com/projects/sobha-strada-sector-106-gurgaon",
    },
    featured: true,
    description:
      "SOBHA STRADA is positioned as a mixed-format opportunity combining serviced residence keys and retail in the Dwarka Expressway belt.",
  },

  // -----------------------------
  // GYGY | Commercial | Noida
  // -----------------------------
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
    propertyType: "Commercial",
    construction_status: "Under Construction",
    configuration: "High-Street Retail, F&B & Entertainment",

    usp: ["Prime high-street concept in premium Sector 50 catchment", "Lifestyle retail + F&B hub positioning", "Catchment-led footfall opportunity (validate assumptions)"],
    location_advantage: {
      connectivity: ["Central Noida access; connectivity depends on approach roads", "Residential density supports daily footfall theme"],
      schools: ["Dense residential catchment creates recurring demand for daily retail (catchment-driven)"],
      healthcare: ["Healthcare options in Central Noida corridor (verify nearest facilities)"],
      markets: ["Sector 50 and adjoining belts provide mature catchment for retail/F&B (validate micro-catchment)"],
    },
    highlights: ["Experience-led retail positioning", "Designed for retail + dining + entertainment mix", "Shop sizing and PLCs vary by inventory"],
    specifications: ["Retail boulevard format with common areas (plan dependent)", "Parking and circulation subject to final layout"],

    amenities: ["High-Street Retail Boulevard", "Restaurants & Outdoor Seating", "Central Plaza / Courtyard", "Elevators & Escalators", "24x7 Security", "Ample Parking"],
    overview:
      "A high-street retail concept positioned for a dense residential catchment. Confirm size matrix and frontage/visibility from the official plan.",
    inventory_note:
      "Shop sizing, PLCs and scheme details vary. Request the latest official rate card and layout.",

    hero: "/projects/gygy-fiveo/hero.jpg",
    heroAlt: "GYGY FIVEO high-street retail and lifestyle hub in Sector 50 Noida",
    gallery: ["/projects/gygy-fiveo/g1.jpg", "/projects/gygy-fiveo/g2.jpg", "/projects/gygy-fiveo/g3.jpg", "/projects/gygy-fiveo/g4.jpg"],
    map: {
      embed: "https://www.google.com/maps?q=28.580,77.365&z=16&output=embed",
      lat: 28.58,
      lng: 77.365,
    },
    seo: {
      title: "GYGY FIVEO Sector 50 Noida – High-Street Retail & Lifestyle | Altina Livings",
      description:
        "GYGY FIVEO in Sector 50, Noida is a high-street commercial hub offering retail and F&B spaces in a dense, upscale catchment.",
      canonical: "https://altinalivings.com/projects/gygy-fiveo-sector-50-noida",
    },
    featured: false,
    description:
      "GYGY FIVEO is a high-street retail and lifestyle destination in Sector 50 Noida catering to an upscale catchment.",
  },
];

export default projects;
