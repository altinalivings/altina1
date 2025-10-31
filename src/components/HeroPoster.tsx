/*
 * HeroPoster component
 *
 * This hero section mirrors the style of the provided poster. It features a
 * script font headline, uppercase location, and bold property show title with
 * gold gradient text. A radial dark background and subtle golden overlay
 * recreate the feel of the poster while remaining responsive and accessible.
 */
import Link from 'next/link'
import Grain from '@/components/Grain'

export default function HeroPoster() {
  return (
    <section className="relative overflow-hidden">
      {/* Dark radial background */}
      <div className="absolute inset-0 bg-hero-dark" />
      {/* Soft golden glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(70% 90% at 8% 10%, rgba(201,162,39,.18) 0%, transparent 60%)',
        }}
      />
      {/* Film grain overlay for premium texture */}
      <Grain />
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
        {/* Script headline */}
        <div className="h-script text-4xl md:text-6xl leading-none">Save the Date</div>
        {/* Location in uppercase */}
        <h1 className="h-caps text-base md:text-lg mt-2 opacity-90">Moradabad</h1>

        <div className="mt-10">
        {/* Uppercase developer label */}
          <div className="h-caps text-base opacity-80">DLF</div>
          {/* Property show title with gold gradient */}
          <h2 className="h-caps text-3xl md:text-5xl mt-2">
            <span className="gold-text">Property Show</span>
          </h2>
          <p className="mt-6 text-base text-muted max-w-xl">
            Coming soon to your city. Curated inventory, priority allotments, and guided walkthroughs.
          </p>
          {/* Date pill */}
          <div className="mt-6 gold-pill shadow-altina">
            14<sup>th</sup> Sept 2025
          </div>

          <div className="mt-10 flex gap-3">
            <a href="#lead" className="btn btn-gold">Request a Callback</a>
            <Link href="/projects" className="btn border border-white/20 hover:border-white/50">
              Explore Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
