// src/data/projects.ts
// Projects configuration for Altina Livings

export type PropertyType = "Residential" | "Commercial" | "Mixed";

export type LocationAdvantage = {
  connectivity?: string[];
  schools?: string[];
  healthcare?: string[];
  markets?: string[];
};

export type FAQItem = { q: string; a: string };

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

  // ✅ Page sections (as per standard)
  usp?: string[];
  highlights?: string[];
  specifications?: string[];
  amenities?: string[];

  // Location advantage (bucketed)
  location_advantage?: LocationAdvantage;

  // FAQs (new + backward compatible)
  faqs?: FAQItem[];
  faq?: FAQItem[];

  // Optional blocks
  overview?: string;
  payment_plan?: string;
  inventory_note?: string;

  // Media
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
    sizes: "≈ 1,732 – 3,000 sq.ft.",
    land_area: "≈ 5.12 acres",
    towers: 4,
    floors: "G+39 (approx.)",
    total_units: "914 apartments",

    // ✅ As per page structure
    usp: [
      "Central Delhi–adjacent address on Shivaji Marg",
      "Gated high-rise living with clubhouse amenities",
      "Green belt surroundings and planned community ecosystem",
    ],
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
    location_advantage: {
      connectivity: [
        "Strong West–Central Delhi road connectivity via Shivaji Marg",
        "Metro in the broader Moti Nagar / Kirti Nagar belt (verify approach and exit)",
      ],
      schools: ["Schools available in West Delhi catchment (shortlist by commute route)"],
      healthcare: ["Hospitals and clinics across West/Central Delhi corridor (verify nearest options)"],
      markets: ["Daily convenience and retail in the wider Moti Nagar / Kirti Nagar belt"],
    },

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
    video_url: "https://www.youtube.com/watch?v=t2UzbAW6-D8",
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

  // -----------------------------
  // DLF | Residential | Gurugram (Independent Floors)
  // -----------------------------
  {
    id: "dlf-independent-floors-phase-2-3",
    slug: "dlf-independent-floors-phase-2-3",
    name: "DLF Independent Floors (Phase 2 & 3)",
    developer: "DLF",
    brand: "DLF",
    rating: 4.6,
    location: "DLF Gardencity Enclave, Sector 93, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    sector: "Sector 93",
    micro_market: "New Gurugram (Dwarka Expressway / NH-48 influence)",
    rera: "RC/REP/HARERA/GGM/657/389/2023/01",
    status: "Under Construction",
    construction_status: "Ongoing",
    propertyType: "Residential",
    price: "Price on Request",
    configuration: "3 & 4 BHK Low-rise Independent Floors",
    typologies: ["3 BHK + Store", "4 BHK + Store + Utility"],
    floors: "Stilt + 4 (typical independent floors)",

    usp: [
      "Low-rise floors with fewer neighbours and higher privacy",
      "Gated township-style ecosystem within DLF Gardencity Enclave",
      "Independent-floor lifestyle with organized maintenance",
    ],
    highlights: [
      "Independent-floor living in a planned sector belt",
      "Better privacy vs typical high-rise group housing",
      "Inventory varies by phase and pocket—unit-wise shortlisting recommended",
    ],
    specifications: [
      "Low-rise floor layouts (phase and inventory dependent)",
      "Gated pockets with internal greens",
      "Unit-wise inclusions vary—verify official specification sheet",
    ],
    location_advantage: {
      connectivity: [
        "Sector 93 connectivity to key Gurugram corridors (route-dependent)",
        "Verify primary access roads and commute routes by exact pocket",
      ],
      schools: ["Schools in the wider New Gurugram catchment (shortlist by commute route)"],
      healthcare: ["Healthcare options across Gurugram catchment (verify nearest facilities)"],
      markets: ["Daily convenience in the sector belt (verify micro-catchment)"],
    },

    amenities: ["Gated Pocket", "Community Greens"],
    overview:
      "DLF Independent Floors (Phase 2 & 3) are positioned for buyers who prefer low-density living with township planning and gated security.",
    inventory_note:
      "Availability varies by phase and pocket. Share configuration, budget range and pocket preference for the live inventory list.",

    hero: "/projects/dlf-independent-floors-phase-2-3/hero.jpg",
    heroAlt: "DLF independent floors in DLF Gardencity Enclave, Gurugram",
    gallery: [
      "/projects/dlf-independent-floors-phase-2-3/g1.webp",
      "/projects/dlf-independent-floors-phase-2-3/g2.webp",
      "/projects/dlf-independent-floors-phase-2-3/g3.webp",
    ],
    tags: ["Gurugram", "Low-Rise Floors", "DLF", "Sector 93"],
    seo: {
      title: "DLF Independent Floors Phase 2 & 3 – Low-Rise 3 & 4 BHK | Altina Livings",
      description:
        "Explore DLF Independent Floors (Phase 2 & 3) in DLF Gardencity Enclave, Sector 93: premium low-rise 3/4 BHK floors offering privacy and township living.",
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

    // NOTE: RERA and plot matrix varies by phase/inventory — confirm from official DLF / HARERA documents
    rera: "GGM-768-500-2023-112 (verify from HARERA)",

    usp: [
      "SCO plots on Golf Course Extension Road corridor",
      "Retail, F&B and office-compatible format",
      "Catchment-driven commercial micro-market",
    ],
    highlights: [
      "High-visibility frontage opportunity (plot-wise)",
      "Suitable for retail, F&B, clinics, offices and boutique brands",
      "Plot sizes, norms and payment schedule are inventory dependent",
    ],
    specifications: [
      "SCO plot-based format (plot size and norms dependent)",
      "Parking and high-street positioning (layout dependent)",
    ],
    location_advantage: {
      connectivity: ["Golf Course Extension Road access", "Linkages to GCX / SPR residential belts"],
      schools: ["Dense residential catchment supports daily retail (catchment-driven)"],
      healthcare: ["Healthcare network in the wider corridor (verify nearest options)"],
      markets: ["Strong surrounding catchment drives footfall potential (validate assumptions)"],
    },

    amenities: ["High Street Format", "Parking (as per layout)"],
    overview:
      "A SCO opportunity for retail, F&B and office formats in a strong catchment corridor. Confirm plot-wise norms, RERA and terms from official documents.",
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
        "DLF Central 67 offers SCO plots in Sector 67 on Golf Course Extension Road, suitable for retail, F&B and office use in a high-visibility corridor (verify RERA/inventory).",
      canonical: "https://altinalivings.com/projects/dlf-central-67-sco-sector-67-gurgaon",
    },
    featured: false,
    description:
      "DLF Central 67 SCO is a commercial opportunity for investors and business owners on Golf Course Extension Road.",
  },

  // -----------------------------
  // SOBHA | Residential | Gurugram
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
    rera: "RC/REP/HARERA/GGM/828/560/2024/55",
    price: "₹6.5 Cr onwards (indicative)",
    configuration: "Luxury 4 & 5 BHK + Studio Apartments",
    typologies: ["Studio", "4 BHK", "5 BHK"],
    sizes: "2,870 – 3,853 sq.ft.",
    land_area: "5.51 acres",
    total_units: "293 residences",
    propertyType: "Residential",

    usp: [
      "SOBHA premium high-rise on Dwarka Expressway",
      "Large-format apartments with expansive layouts",
      "SOBHA build quality and detailing theme",
    ],
    highlights: [
      "Luxury 4 & 5 BHK configuration mix + studios",
      "Dwarka Expressway connectivity theme (Delhi/IGI routes)",
      "Amenity-led lifestyle positioning",
    ],
    specifications: [
      "Large-format residences with premium layout planning",
      "Clubhouse and curated amenities (as per official plan)",
      "Unit-wise inclusions vary—verify official specification sheet",
    ],
    location_advantage: {
      connectivity: [
        "Dwarka Expressway corridor access",
        "Delhi border / IGI connectivity theme (traffic dependent)",
      ],
      schools: ["Schools in wider sector belt (shortlist by route)"],
      healthcare: ["Hospitals and clinics across Gurugram–Delhi corridor (verify nearest options)"],
      markets: ["Daily convenience in the wider sector belt (verify micro-catchment)"],
    },

    amenities: ["Clubhouse", "Swimming Pool", "Gymnasium", "Landscaped Gardens", "Kids’ Play Area"],
    overview:
      "SOBHA Altus is a premium high-rise offering in Sector 106, positioned for buyers seeking large-format apartments with Dwarka Expressway connectivity.",
    inventory_note:
      "Confirm the latest rate card, PLCs and inventory availability before finalizing.",

    hero: "/projects/sobha-altus/hero.jpg",
    heroAlt: "SOBHA Altus towers on Dwarka Expressway",
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
      title: "SOBHA Altus – Luxury 4 & 5 BHK on Dwarka Expressway | Altina Livings",
      description:
        "SOBHA Altus in Sector 106 offers luxury 4 & 5 BHK residences (plus studios) on Dwarka Expressway with premium amenities and signature SOBHA quality.",
      canonical: "https://altinalivings.com/projects/sobha-altus-sector-106-gurgaon",
    },
    featured: true,
    featured_order: 2,
    description:
      "SOBHA Altus is a luxury high-rise development in Sector 106 with large-format residences and SOBHA’s build quality.",
  },

  // -----------------------------
  // SOBHA | Residential | Greater Noida
  // -----------------------------
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
    price: "₹21,500 / sq.ft (indicative)",
    // NOTE: confirm final UP-RERA details from official portal / developer release
    rera: "UPRERAPRJ361748/06/2025 (verify)",

    usp: [
      "SOBHA presence in Greater Noida belt",
      "Family-oriented amenity ecosystem",
      "Multiple configuration range (inventory dependent)",
    ],
    highlights: [
      "Multiple configuration range (1–4 BHK as indicated)",
      "Expressway-belt connectivity theme",
      "Lifestyle amenity focus",
    ],
    specifications: [
      "Lifestyle clubhouse and community amenities",
      "Tower specifications vary by phase/inventory",
    ],
    location_advantage: {
      connectivity: ["Noida–Greater Noida Expressway access theme", "Sector approach impacts travel time"],
      schools: ["Schools in the Greater Noida catchment (shortlist by sector approach)"],
      healthcare: ["Hospitals and clinics in the Noida–Greater Noida corridor (verify nearest options)"],
      markets: ["Daily retail and convenience in the wider expressway belt (verify micro-catchment)"],
    },

    amenities: ["Clubhouse", "Swimming Pool", "Gymnasium", "Jogging Track", "Kids’ Play Area"],
    overview:
      "A residential community positioned for buyers seeking SOBHA build standards in the Noida–Greater Noida belt with a lifestyle amenity focus.",
    inventory_note:
      "Indicative pricing shown. Confirm the latest rate card, size matrix and unit availability.",

    hero: "/projects/sobha-aurum/hero.jpg",
    heroAlt: "SOBHA Aurum residential towers in Greater Noida",
    gallery: [
      "/projects/sobha-aurum/g1.webp",
      "/projects/sobha-aurum/g2.webp",
      "/projects/sobha-aurum/g3.webp",
    ],
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

  // -----------------------------
  // SOBHA | Residential | Gurugram (Resort / Eco-luxury)
  // -----------------------------
  {
    id: "sobha-aranya",
    slug: "sobha-aranya-delhi-ncr",
    name: "SOBHA Aranya",
    developer: "SOBHA Ltd.",
    brand: "SOBHA",
    rating: 4.8,
    location: "Karma Lakelands, NH-48 belt, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    micro_market: "NH-48 Eco Corridor",
    status: "New Launch / Under Construction",
    construction_status: "Ongoing",
    propertyType: "Residential",
    configuration: "3 & 4 BHK Eco-luxury Residences",
    // NOTE: confirm detailed matrix from official brochure / HARERA
    rera: "GGM/808/540/2024/35",
    land_area: "≈ 31 acres (public listings)",
    towers: 7,
    total_units: "≈ 1200 residences (public listings)",

    usp: ["Eco-luxury theme with green ambience", "Inside Karma Lakelands environment", "Resort-style lifestyle positioning"],
    highlights: ["Resort-style living theme", "Low-density / green ambience positioning", "Details may vary by tower/inventory"],
    specifications: ["Eco-luxury positioning with curated amenities", "Final specifications depend on inventory and tower series"],
    location_advantage: {
      connectivity: ["NH-48 corridor access theme", "Connectivity depends on approach and traffic"],
      schools: ["Schools in the wider NH-48 / Gurugram catchment (shortlist by commute needs)"],
      healthcare: ["Healthcare options across Gurugram corridor (verify nearest facilities)"],
      markets: ["Daily convenience in the wider corridor (verify nearest hubs)"],
    },

    amenities: ["Clubhouse", "Swimming Pool", "Gym & Fitness", "Jogging & Cycling Tracks", "Kids’ Play Areas"],
    overview:
      "A resort-style, eco-luxury positioning in a green, low-density environment, oriented towards lifestyle buyers and long-horizon owners.",
    inventory_note:
      "Confirm configuration, sizes, tower matrix and payment terms from the official brochure and HARERA listing.",

    hero: "/projects/sobha-aranya/hero.jpg",
    heroAlt: "SOBHA Aranya eco-luxury homes amidst greens at Karma Lakelands",
    gallery: [
      "/projects/sobha-aranya/g1.webp",
      "/projects/sobha-aranya/g2.webp",
      "/projects/sobha-aranya/g3.webp",
    ],
    seo: {
      title: "SOBHA Aranya – Eco-Luxury Residences at Karma Lakelands | Altina Livings",
      description:
        "SOBHA Aranya is an eco-luxury residential development in the Karma Lakelands environment along NH-48, offering resort-style living (verify inventory and RERA details).",
      canonical: "https://altinalivings.com/projects/sobha-aranya-delhi-ncr",
    },
    featured: true,
    featured_order: 5,
    description:
      "SOBHA Aranya combines eco-luxury living, resort ambience and SOBHA craftsmanship at Karma Lakelands.",
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
    rera: "UPRERAPRJ931027/02/2025 (verify)",

    usp: [
      "Branded residences positioning (Jacob & Co.)",
      "Ultra-luxury segment targeting HNI/UHNI buyers",
      "Design-led lifestyle theme (launch dependent)",
    ],
    highlights: [
      "Pre-launch: details may change at official release",
      "Curated amenities positioning (launch dependent)",
      "Best suited for luxury end-use and collector-style inventory (final offering dependent)",
    ],
    specifications: [
      "Branded clubhouse / lifestyle amenities (final specs to be confirmed)",
      "Inventory specs may vary by tower and unit series",
    ],
    location_advantage: {
      connectivity: ["Sector 97 belt connectivity (verify micro-location and approach roads)", "Travel time depends on Noida corridors and traffic"],
      schools: ["Schools in the wider Noida catchment (shortlist by preferred routes)"],
      healthcare: ["Hospitals in Noida–Delhi corridor (verify nearest facilities)"],
      markets: ["Retail and convenience in Noida catchment (verify proximity by micro-location)"],
    },

    amenities: ["Branded Clubhouse", "Swimming Pool", "Sky Lounges", "Gymnasium", "Spa / Wellness"],
    overview:
      "A branded-residences positioning aimed at the luxury segment. Validate final inventory, brand deliverables and specifications from official releases.",
    inventory_note:
      "Pre-launch inventory and pricing may change. Confirm configuration, sizes and brand deliverables once announced.",

    hero: "/projects/m3m-jacob/hero.jpg",
    heroAlt: "M3M Jacob & Co. branded luxury residence towers in Noida",
    gallery: [
      "/projects/m3m-jacob/g1.jpg",
      "/projects/m3m-jacob/g2.jpg",
      "/projects/m3m-jacob/g3.jpg",
    ],
    map: { embed: "https://www.google.com/maps?q=Sector%2097%20Noida&z=15&output=embed" },
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

    usp: [
      "Fully paid-up 5-acre commercial land",
      "Limited ground-floor retail inventory",
      "Select schemes/assured returns are inventory dependent (validate officially)",
    ],
    highlights: [
      "Retail + office mix for investor and end-user needs",
      "Expressway corridor with established residential catchment",
      "Scheme/assurance terms must be validated from official documents",
    ],
    specifications: [
      "Retail high-street + office tower format (inventory dependent)",
      "Parking and common areas as per final layout",
    ],
    location_advantage: {
      connectivity: [
        "Noida Expressway access",
        "FNG + Yamuna Expressway connectivity theme",
        "Metro in broader Sector 137/142 belt (verify approach)",
      ],
      schools: ["Residential catchment supports daily retail (catchment-driven; validate assumptions)"],
      healthcare: ["Healthcare options in Noida corridor (verify nearest facilities)"],
      markets: ["High residential catchment in nearby sectors (validate from official sources)"],
    },

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
    map: { embed: "https://www.google.com/maps?q=28.5115,77.4130&z=16&output=embed", lat: 28.5115, lng: 77.413 },
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
    land_area: "≈ 150 acres (township)",
    floors: "G+25 (approx.)",

    usp: ["Part of large township (GIC)", "IMT Manesar proximity theme", "High-rise format with amenities (launch dependent)"],
    highlights: ["New launch: verify RERA, phase plan and tower details", "2.5 and 3 BHK configuration mix", "Pricing and possession depend on launch terms"],
    specifications: ["High-rise towers (final tower count/specs to be confirmed)", "Clubhouse and lifestyle amenities (as per launch communication)"],
    location_advantage: {
      connectivity: ["Manesar / NH-8 influence zone (verify approach)", "Industrial + employment catchment access theme"],
      schools: ["Schools in Manesar / New Gurugram catchment (shortlist by commute)"],
      healthcare: ["Healthcare facilities in the wider Manesar–Gurugram corridor (verify nearest options)"],
      markets: ["Daily convenience depends on township phase and nearby belt (verify current ecosystem)"],
    },

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
    map: { embed: "https://www.google.com/maps?q=Sector%20M9%20Manesar%20Gurugram&z=14&output=embed" },
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
    possession: "Approx. 5 years from launch (as per developer communication)",
    launch: "EOI phase",
    price: "2, 3 & 4 BR Premium Apartments starting @ ₹2.25 Cr*",
    configuration: "2, 3 & 4 BR Premium Apartments",
    typologies: [
      "2 BR + 2T – 1,300 sq.ft (approx.)",
      "3 BR + 2T – 1,600 sq.ft (approx.)",
      "3 BR + 3T – 1,850 sq.ft (approx.)",
      "4 BR + 4T – 2,200–2,500 sq.ft (approx.)",
    ],
    sizes: "1,300 – 2,500 sq.ft (approx.)",
    land_area: "≈ 12 acres (as per launch communication)",
    towers: 8,
    floors: "G+45 (approx.)",
    total_units: "≈ 1,375 units",

    usp: [
      "Ultra-luxury high-rise community in Sector 1 GNW",
      "4 apartments per floor (limited density positioning)",
      "Large clubhouse and lifestyle amenities plan",
    ],
    highlights: [
      "EOI / pre-launch: confirm RERA, rate card and PLCs",
      "Large-format development with clubhouse-led amenities",
      "Family-oriented configuration mix (2–4 BR)",
    ],
    specifications: [
      "High-rise plan with limited apartments per floor positioning",
      "Basement parking and clubhouse plan (subject to final documents)",
    ],
    location_advantage: {
      connectivity: ["GNW / Noida Extension belt connectivity", "FNG / NH24 / Pari Chowk connectivity theme (verify travel times)"],
      schools: ["Schools in the GNW catchment (shortlist by sector approach)"],
      healthcare: ["Hospitals and clinics in the GNW–Noida corridor (verify nearest options)"],
      markets: ["Daily convenience in the wider GNW belt (verify micro-catchment)"],
    },

    amenities: [
      "Clubhouse",
      "Swimming Pool",
      "Gymnasium",
      "Indoor Games",
      "Multi-purpose Hall",
      "Landscaped Gardens",
      "Jogging / Walking Track",
      "Kids’ Play Area",
      "Basement Parking (multi-level)",
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
    map: { embed: "https://www.google.com/maps?q=28.603,77.420&z=15&output=embed", lat: 28.603, lng: 77.42 },
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
    typologies: ["Serviced Residences (1 Bed)", "High-Street Retail & F&B Spaces"],
    sizes: "Serviced Residences: 856 sq.ft* onwards; Retail: 257 sq.ft* onwards",
    land_area: "≈ 2.03 acres (commercial)",
    towers: 1,
    floors: "4 Basements + Ground + 31 Floors",
    total_units: "≈ 251 serviced residence keys + multiple retail units",

    usp: [
      "Serviced residences + premium retail in one tower",
      "Investor-friendly sizing theme (inventory dependent)",
      "Downtown positioning on Dwarka Expressway belt",
    ],
    highlights: [
      "Mixed: serviced keys + retail (classification intentional)",
      "Investor-led format; verify operator structure if applicable",
      "Payment plan and scheme terms to be confirmed from official sheet",
    ],
    specifications: [
      "Mixed-use program (serviced keys + retail)",
      "Amenities and operator details subject to official release",
    ],
    location_advantage: {
      connectivity: ["Dwarka Expressway corridor", "Delhi / IGI connectivity theme (traffic dependent)"],
      schools: ["Schools in wider Dwarka Expressway catchment (shortlist by route)"],
      healthcare: ["Hospitals and clinics across Gurugram–Delhi corridor (verify nearest options)"],
      markets: ["Retail ecosystem evolves with sector development (verify current status)"],
    },

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
    gallery: [
      "/projects/sobha-strada/g1.jpg",
      "/projects/sobha-strada/g2.jpg",
      "/projects/sobha-strada/g3.jpg",
      "/projects/sobha-strada/g4.jpg",
    ],
    map: { embed: "https://www.google.com/maps?q=28.5324,77.0463&z=16&output=embed", lat: 28.5324, lng: 77.0463 },
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
    // NOTE: add UP-RERA registration when you have the official certificate handy
    rera: "TBA",

    usp: [
      "Prime high-street concept in premium Sector 50 catchment",
      "Lifestyle retail + F&B hub positioning",
      "Catchment-led footfall opportunity (validate assumptions)",
    ],
    highlights: [
      "Experience-led retail positioning",
      "Designed for retail + dining + entertainment mix",
      "Shop sizing and PLCs vary by inventory",
    ],
    specifications: [
      "Retail boulevard format with common areas (plan dependent)",
      "Parking and circulation subject to final layout",
    ],
    location_advantage: {
      connectivity: ["Central Noida access; connectivity depends on approach roads", "Residential density supports daily footfall theme"],
      schools: ["Dense residential catchment creates recurring demand for daily retail (catchment-driven)"],
      healthcare: ["Healthcare options in Central Noida corridor (verify nearest facilities)"],
      markets: ["Sector 50 and adjoining belts provide mature catchment for retail/F&B (validate micro-catchment)"],
    },

    amenities: [
      "High-Street Retail Boulevard",
      "Restaurants & Outdoor Seating",
      "Central Plaza / Courtyard",
      "Elevators & Escalators",
      "24x7 Security",
      "Ample Parking",
    ],
    overview:
      "A high-street retail concept positioned for a dense residential catchment. Confirm size matrix and frontage/visibility from the official plan.",
    inventory_note:
      "Shop sizing, PLCs and scheme details vary. Request the latest official rate card and layout.",

    hero: "/projects/gygy-fiveo/hero.jpg",
    heroAlt: "GYGY FIVEO high-street retail and lifestyle hub in Sector 50 Noida",
    gallery: [
      "/projects/gygy-fiveo/g1.jpg",
      "/projects/gygy-fiveo/g2.jpg",
      "/projects/gygy-fiveo/g3.jpg",
      "/projects/gygy-fiveo/g4.jpg",
    ],
    map: { embed: "https://www.google.com/maps?q=28.580,77.365&z=16&output=embed", lat: 28.58, lng: 77.365 },
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
  
    // -----------------------------
  // EMAAR | Residential | Gurugram
  // -----------------------------
  {
    id: "emaar-serenity-hills",
    slug: "emaar-serenity-hills-sector-86-gurugram",
    name: "Emaar Serenity Hills",
    developer: "Emaar India Limited", // :contentReference[oaicite:0]{index=0}
    brand: "Emaar",
    rating: 4.7,
    location: "Sector 86, Gurugram (frontage on 75m road)",
    city: "Gurugram",
    state: "Haryana",
    sector: "Sector 86",
    micro_market: "New Gurugram (NH-48 / Dwarka Expressway influence)",
    rera:
      "RC/REP/HARERA/GGM/993/725/2025/96 (16.10.2025) • RC/REP/HARERA/GGM/994/726/2025/97 (16.10.2025)", // :contentReference[oaicite:1]{index=1}
    status: "New Launch / Under Construction",
    construction_status: "Ongoing",
    launch: "2025 (registered phases)",
    price: "Price on Request",
    propertyType: "Residential",
    configuration: "3 & 4 BHK Luxury Apartments",
    typologies: ["3 BHK (2T)", "3 BHK (3T + Utility)", "4 BHK (4T + PDR + Utility)"], // :contentReference[oaicite:2]{index=2}
    sizes:
      "Carpet: 947–1,571 sq.ft | Balcony: 235–427 sq.ft (indicative, current launch)", // :contentReference[oaicite:3]{index=3}
    land_area: "25.90 acres (overall)", // :contentReference[oaicite:4]{index=4}
    towers: 13, // :contentReference[oaicite:5]{index=5}
    floors: "G+32 to G+39 (current launch, tower-wise)", // :contentReference[oaicite:6]{index=6}
    total_units: "997 units (current launch)", // :contentReference[oaicite:7]{index=7}

    usp: [
      "8 acres of central greens + 20+ acres landscaped open space",
      "~1 lakh sq.ft amenities with ~75,000 sq.ft clubhouse (built-up area, includes future development amenities)",
      "IGBC Platinum pre-certified development",
      "45+ fast EV charging stations (surface)",
      "No EWS in the project (as per sales deck)",
    ], // :contentReference[oaicite:8]{index=8}

    highlights: [
      "Direct frontage on 75m road; links to NH-48 and Dwarka Expressway",
      "Current launch site area ~15.217 acres with 7 towers and 997 units",
      "4-to-a-core cluster; 3 passenger + 1 service lift per tower (current launch)",
    ], // :contentReference[oaicite:9]{index=9} :contentReference[oaicite:10]{index=10}

    specifications: [
      "Floor-to-floor height: 3.15m (current launch)",
      "Modular kitchen with chimney + hob; branded CP fittings (snapshot)",
      "VRF with high-wall units in bedrooms, living & dining (as per brochure)",
      "Digital lock on main entry door (as per brochure)",
    ], // :contentReference[oaicite:11]{index=11} :contentReference[oaicite:12]{index=12} :contentReference[oaicite:13]{index=13}

    location_advantage: {
      connectivity: [
        "Sector 86 with direct frontage on 75m road; seamless links to NH-48 and Dwarka Expressway",
        "Indicative distances (sales deck): IGI Airport ~35 km; Gurugram Railway ~15 km; HUDA City Centre Metro ~20 km; Cyber City ~22 km",
      ],
    }, // :contentReference[oaicite:14]{index=14} :contentReference[oaicite:15]{index=15}

    amenities: [
      // Club + lifestyle (includes future development amenities as per deck)
      "Clubhouse / Banquet",
      "Multicuisine Restaurant",
      "Café / Bar Lounge",
      "Gymnasium",
      "Aerobics / Yoga / Zumba Studio",
      "Juice Bar",
      "Spa / Sauna / Steam",
      "Salon",
      "Guest Rooms",
      "Kids’ Creche / Day Care",
      "Library / Quiet Zone",
      "Meeting / Conference Rooms",
      "Coworking / Work Pods",
      "Squash / Badminton / Table Tennis",
      "Tennis / Pickle Ball",
      "Swimming Pool",
      "Jogging / Cycling Track",
      // Outdoor greens / promenade (from masterplan list)
      "Central Greens & Waterfront Promenade",
      "Party Lawn / Event Lawn",
      "Pet Park",
    ], // :contentReference[oaicite:16]{index=16}

    overview:
      "Emaar Serenity Hills in Sector 86 is positioned as a nature-forward, amenity-rich high-rise community with large central greens, a resort-style clubhouse ecosystem and strong corridor connectivity.",
    inventory_note:
      "Phased offering: only the registered phases are currently offered for sale. Inventory, PLCs and inclusions vary by tower/floor—share budget + preferred typology to get the live rate card and availability.", // :contentReference[oaicite:17]{index=17}

    hero: "/projects/emaar-serenity-hills/hero.jpg",
    heroAlt: "Emaar Serenity Hills luxury residences in Sector 86 Gurugram with central greens",
    gallery: [
      "/projects/emaar-serenity-hills/g1.webp",
      "/projects/emaar-serenity-hills/g2.webp",
      "/projects/emaar-serenity-hills/g3.webp",
      "/projects/emaar-serenity-hills/g4.webp",
    ],
    map: { embed: "https://www.google.com/maps?q=Emaar%20Serenity%20Hills%20Sector%2086%20Gurugram&z=15&output=embed" },

    seo: {
      title: "Emaar Serenity Hills, Sector 86 Gurugram – 3 & 4 BHK Luxury Apartments | Altina Livings",
      description:
        "Explore Emaar Serenity Hills in Sector 86 Gurugram: 3 & 4 BHK luxury apartments with 8 acres central greens, ~1 lakh sq.ft amenities and strong NH-48/Dwarka Expressway connectivity (verify inventory phase-wise).",
      canonical: "https://altinalivings.com/projects/emaar-serenity-hills-sector-86-gurugram",
    },
    featured: true,
    featured_order: 8,
    description:
      "Emaar Serenity Hills is a premium high-rise community in Sector 86 featuring large central greens, a clubhouse-led lifestyle ecosystem and strong corridor connectivity.",
  },

  // -----------------------------
  // SIGNATURE GLOBAL | Mixed (90% Resi, 10% Comm) | Gurugram (Dwarka Expressway)
  // -----------------------------
  {
    id: "signatureglobal-sarvam",
    slug: "signatureglobal-sarvam-dxp-estate-sector-37d-gurugram",
    name: "Signatureglobal Sarvam at DXP Estate",
    developer: "Signatureglobal Homes Limited", // :contentReference[oaicite:18]{index=18}
    brand: "Signature Global",
    rating: 4.6,
    location: "DXP Estate, Sector 37D, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    sector: "Sector 37D",
    micro_market: "Dwarka Expressway",
    rera: "RC/REP/HARERA/GGM/1008/740/2025/111 (07.11.2025)", // :contentReference[oaicite:19]{index=19}
    status: "New Launch",
    construction_status: "Planned / Under Construction",
    propertyType: "Mixed", // 90% Residential + 10% Commercial :contentReference[oaicite:20]{index=20}
    land_area: "13.5656 acres (Mixed Land Use Colony)", // :contentReference[oaicite:21]{index=21}
    configuration: "3 & 4 BHK Residences + Commercial (within mixed land-use township)",
    typologies: [
      "4 BHK + 4T + Utility",
      "3 BHK + 3T + Utility (Type 1)",
      "3 BHK + 3T + Utility (Type 2)",
      "3 BHK + 3T",
      "3 BHK + 2T (Type 1)",
      "3 BHK + 2T (Type 2)",
    ], // :contentReference[oaicite:22]{index=22}
    price: "Price on Request",
    sizes: "Size matrix on request (typology-wise, inventory dependent)",

    usp: [
      "Mixed land-use under TOD policy: 90% residential + 10% commercial",
      "Club + landscaped outdoor program with multiple theme zones",
      "Dwarka Expressway micro-market positioning (DXP Estate, Sector 37D)",
    ], // :contentReference[oaicite:23]{index=23} :contentReference[oaicite:24]{index=24}

    highlights: [
      "Project registered with Haryana RERA: RC/REP/HARERA/GGM/1008/740/2025/111",
      "Site plan includes club, water features, event lawn, forest/yoga zones and multi-sport courts",
      "Multiple 3 BHK and 4 BHK layouts listed in the brochure (type-wise)",
    ], // :contentReference[oaicite:25]{index=25} :contentReference[oaicite:26]{index=26} :contentReference[oaicite:27]{index=27}

    amenities: [
      "Clubhouse",
      "Amphitheater",
      "Kids’ Theme Park",
      "Miyawaki Forest",
      "Yoga Area",
      "Event Lawn",
      "Reflexology Park",
      "Lap Pool",
      "Kids’ Pool",
      "Leisure Pool",
      "Jacuzzi",
      "Jogging Trail",
      "Zen Garden",
      "Sculpture Garden",
      "BBQ Garden",
      "Pet Garden",
      "Multi-purpose Court",
      "Half Basketball Court",
      "Pickle Ball Court",
      "Paddle Court",
      "Fitness Area",
      "Croquet Court",
      "Bowling Alley Lawn (as per legend)",
    ], // :contentReference[oaicite:28]{index=28}

    overview:
      "Signatureglobal Sarvam at DXP Estate is positioned as a mixed land-use community on Dwarka Expressway with an amenity-rich club and landscaped outdoor zones, paired with a limited commercial component.",
    inventory_note:
      "Configuration, sizes, PLCs and scheme details are inventory-based. Share budget + preferred 3/4 BHK type to get the current availability and rate card.",

    hero: "/projects/signatureglobal-sarvam/hero.jpg",
    heroAlt: "Signatureglobal Sarvam at DXP Estate, Sector 37D Gurugram on Dwarka Expressway",
    gallery: [
      "/projects/signatureglobal-sarvam/g1.jpg",
      "/projects/signatureglobal-sarvam/g2.jpg",
      "/projects/signatureglobal-sarvam/g3.jpg",
      "/projects/signatureglobal-sarvam/g4.jpg",
    ],
    map: { embed: "https://www.google.com/maps?q=DXP%20Estate%20Sector%2037D%20Gurugram&z=15&output=embed" },

    seo: {
      title: "Signatureglobal Sarvam at DXP Estate, Sector 37D – 3 & 4 BHK + Mixed-Use | Altina Livings",
      description:
        "Signatureglobal Sarvam at DXP Estate (Sector 37D) is a mixed land-use project (90% residential + 10% commercial) on Dwarka Expressway with club + landscaped amenity zones (verify inventory and RERA details).",
      canonical: "https://altinalivings.com/projects/signatureglobal-sarvam-dxp-estate-sector-37d-gurugram",
    },
    featured: true,
    featured_order: 9,
    description:
      "Signatureglobal Sarvam at DXP Estate is a Dwarka Expressway mixed-use opportunity featuring 3/4 BHK residences, clubhouse lifestyle and an integrated commercial component.",
  },

];

export default projects;
