/*
 * Simple theme preview page
 *
 * This page demonstrates the Altina dark theme with gold and emerald
 * accents.  It contains a heading, a description, a subtle silver
 * divider, two call‑to‑action buttons (gold for premium actions and
 * emerald for performance/lead gen), and a sample card.  The page
 * illustrates the contrast guidelines: gold is used only for
 * highlights, while body text remains ivory/white for readability.
 */

import Link from 'next/link'

export default function SimplePage() {
  return (
    <div className="altina-container py-20">
      {/* Heading with gold accent */}
      <h1 className="h-serif text-5xl font-semibold mb-4">
        Live in <span className="gold-sheen">Luxury</span>
      </h1>
      {/* Description using ivory text for legibility */}
      <p className="max-w-2xl text-base md:text-lg text-muted mb-6">
        Discover curated residences across Delhi NCR. Our focus is on
        matching you with the perfect home, from spacious apartments to
        exclusive villas. Schedule a visit or enquire today—our advisors
        are here to guide you every step of the way.
      </p>
      {/* Silver divider */}
      <hr className="border-t border-[#C0C0C0]/20 my-8" />
      {/* Call-to-action buttons */}
      <div className="flex flex-wrap gap-4 mb-12">
        <Link href="#" className="btn btn-gold text-sm md:text-base">
          Book a Visit
        </Link>
        <Link href="#" className="btn btn-emerald text-sm md:text-base">
          Enquire Now
        </Link>
      </div>
      {/* Sample card to demonstrate hover micro-motion and shadow */}
      <div className="max-w-md">
        <div className="card overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="p-6">
            <h2 className="h-serif text-2xl font-semibold mb-2">SkyOne by AlphaCorp</h2>
            <p className="text-muted mb-4">
              A green oasis in the heart of Gurugram, offering large 3 BHK
              apartments with lush terraces and modern amenities.
            </p>
            <Link href="#" className="btn btn-gold text-sm">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}