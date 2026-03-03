// src/app/locations/page.tsx
// ──────────────────────────────────────────────────────────────
//  ALL data derived from projects.ts via unified.ts
//  Each location section shows its actual project cards inline.
//  Clicking a project card goes to /projects/[id] (not a blank page).
// ──────────────────────────────────────────────────────────────
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import PageHero from "@/components/PageHero";
import FloatingCTAs from "@/components/FloatingCTAs";
import { getLocationData, getSiteStats } from "@/data/unified";

export const metadata: Metadata = {
  title: "Properties by Location in Delhi NCR | Gurgaon, Noida, Delhi | ALTINA™",
  description:
    "Explore luxury properties across Delhi NCR's prime locations. Golf Course Road, Dwarka Expressway, Noida Expressway, South Delhi. Expert advisory for 30+ micro-markets. Best deals from top developers.",
  keywords: [
    "properties by location Delhi NCR",
    "real estate Gurgaon locations",
    "Noida property locations",
    "Golf Course Road properties",
    "Dwarka Expressway projects",
    "luxury apartments by location",
  ],
  alternates: {
    canonical: "https://www.altinalivings.com/locations",
  },
  openGraph: {
    title: "Properties by Location in Delhi NCR | ALTINA™ Livings",
    description:
      "Find luxury properties in Delhi NCR's best locations. Expert guidance for 30+ micro-markets.",
    url: "https://www.altinalivings.com/locations",
    images: ["/og-locations.jpg"],
  },
};

export default function LocationsPage() {
  const regions = getLocationData();
  const stats = getSiteStats();
  const totalLocations = regions.reduce((s, r) => s + r.locations.length, 0);

  return (
    <main>
      <PageHero
        title="Explore Properties by Location"
        subtitle="Find your dream home across Delhi NCR's prime micro-markets"
        image="/hero/locations.jpg"
        height="h-[50vh]"
        titleAs="h2"
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Introduction */}
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-altina-ivory mb-6">
            Luxury Properties Across Delhi NCR
          </h1>
          <p className="text-lg text-altina-ivory/80 max-w-4xl leading-relaxed mb-6">
            ALTINA™ Livings brings you curated luxury properties across Delhi
            NCR's most sought-after locations. From established micro-markets
            like Golf Course Road to emerging growth corridors like Dwarka
            Expressway, we help you find the perfect home.
          </p>
          <div className="flex flex-wrap gap-6 text-altina-ivory/70">
            <div className="flex items-center gap-2">
              <span className="text-2xl text-altina-gold">📍</span>
              <span>
                <strong className="text-altina-gold">{totalLocations}+</strong>{" "}
                Prime Locations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-altina-gold">🏘️</span>
              <span>
                <strong className="text-altina-gold">{stats.totalProjects}+</strong>{" "}
                Active Projects
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-altina-gold">🏗️</span>
              <span>
                <strong className="text-altina-gold">{stats.totalDevelopers}+</strong>{" "}
                Top Developers
              </span>
            </div>
          </div>
        </section>

        {/* ═══ Locations by Region — each with inline project cards ═══ */}
        {regions.map((region) => (
          <section key={region.region} className="mb-20" id={region.slug}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold gold-text mb-3 border-b border-altina-gold/30 pb-4">
                {region.region}
                <span className="text-base font-normal text-altina-ivory/50 ml-3">
                  {region.projectCount} projects
                </span>
              </h2>
              <p className="text-altina-ivory/70">{region.description}</p>
            </div>

            {region.locations.map((loc) => (
              <div key={loc.slug} className="mb-12">
                {/* Location header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-altina-ivory">
                    {loc.name}
                    {loc.priceFrom && (
                      <span className="text-sm font-normal text-altina-gold ml-3">
                        from {loc.priceFrom}
                      </span>
                    )}
                  </h3>
                  <span className="text-sm text-altina-ivory/50">
                    {loc.projectCount}{" "}
                    {loc.projectCount === 1 ? "project" : "projects"}
                  </span>
                </div>

                {/* Developer tags */}
                {loc.developers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {loc.developers.map((dev) => (
                      <span
                        key={dev}
                        className="text-xs px-2 py-1 rounded bg-altina-gold/10 text-altina-gold border border-altina-gold/30"
                      >
                        {dev}
                      </span>
                    ))}
                  </div>
                )}

                {/* ✅ Actual project cards — link to /projects/[id] */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {loc.projects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className="group overflow-hidden rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(191,149,63,0.15)] bg-[#0E0E10]"
                    >
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden">
                        {p.hero ? (
                          <Image
                            src={p.hero}
                            alt={`${p.name} – ${p.location || p.city || ""}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-altina-gold/20 to-black/40 flex items-center justify-center">
                            <span className="text-altina-gold/40 text-sm">No Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {p.developer && (
                          <div className="absolute top-3 left-3 rounded-full bg-black/60 border border-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm text-white">
                            {p.developer}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h4 className="font-semibold text-white group-hover:text-altina-gold transition-colors">
                          {p.name}
                        </h4>
                        {p.location && (
                          <p className="text-sm text-neutral-400 mt-1 line-clamp-1">
                            {p.location}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          {p.price ? (
                            <span className="text-sm font-semibold text-altina-gold">
                              {p.price}
                            </span>
                          ) : (
                            <span className="text-xs text-altina-gold/50">
                              Price on Request
                            </span>
                          )}
                          <span className="text-xs text-altina-gold/70 group-hover:text-altina-gold transition-colors flex items-center gap-1">
                            View Details
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}

        {/* Why Choose ALTINA */}
        <section className="golden-frame glow p-8 mb-16">
          <h2 className="text-3xl font-bold text-altina-ivory mb-6 text-center">
            Why Choose ALTINA™ for Location-Based Search?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold gold-text mb-2">Local Expertise</h3>
              <p className="text-altina-ivory/80">
                Deep knowledge of every micro-market, price trends, and upcoming infrastructure
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-semibold gold-text mb-2">Curated Selection</h3>
              <p className="text-altina-ivory/80">
                Only verified, RERA-approved projects from reputed developers
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl font-semibold gold-text mb-2">Best Prices</h3>
              <p className="text-altina-ivory/80">
                Exclusive inventory access and special pricing through developer partnerships
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="golden-frame glow p-8 text-center">
          <h2 className="text-3xl font-bold text-altina-ivory mb-4">
            Can't Find Your Preferred Location?
          </h2>
          <p className="text-altina-ivory/80 mb-6 max-w-2xl mx-auto">
            Contact our property advisors for personalized recommendations across Delhi NCR.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/919891234195"
              className="px-8 py-3 bg-gold-grad text-[#0D0D0D] font-semibold rounded-lg hover:opacity-90 transition"
            >
              WhatsApp Expert
            </a>
            <a
              href="tel:+919891234195"
              className="px-8 py-3 border-2 border-altina-gold text-altina-gold font-semibold rounded-lg hover:bg-altina-gold/10 transition"
            >
              Call +91 98912 34195
            </a>
          </div>
        </section>
      </div>

      {/* Schema */}
      <Script
        id="locations-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.altinalivings.com" },
              { "@type": "ListItem", position: 2, name: "Locations", item: "https://www.altinalivings.com/locations" },
            ],
          }),
        }}
      />

      <Script
        id="locations-collection"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Properties by Location in Delhi NCR",
            description: "Browse luxury properties across Delhi NCR's prime locations",
            url: "https://www.altinalivings.com/locations",
            numberOfItems: totalLocations,
          }),
        }}
      />

      <FloatingCTAs projectId={null} projectName={null} />
    </main>
  );
}
