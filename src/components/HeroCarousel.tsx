/*
 * HeroCarousel component
 *
 * This component wraps the generic Carousel to provide a hero section
 * specifically tailored for the home page.  It accepts an array of
 * slides, each containing an image and optional text/links.  The
 * component overlays dark gradients and a subtle gold glow to ensure
 * readability over varied imagery and includes the film grain texture
 * via the existing Grain component.  Text is aligned to the left and
 * anchored near the bottom to mirror the single‑image hero.
 */

/*
 * Mark this component as client-only.  Since we pass a function via the
 * `content` prop to the Carousel, Next.js requires that this component be
 * rendered on the client.  Without this directive, the function would be
 * defined in a server component and passed down, which is disallowed.
 */

'use client'

import Carousel from '@/components/Carousel'
import Grain from '@/components/Grain'
import Link from 'next/link'

interface HeroSlide {
  src: string
  eyebrow?: string
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  return (
    <Carousel
      slides={slides}
      aspect="h-[72vh] min-h-[520px]"
      autoPlayMs={5500}
      overlay={
        <>
          {/* Dark gradient to improve contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/60" />
          {/* Subtle gold glow to echo the Altina palette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(60% 80% at 15% 10%, rgba(201,162,39,.18) 0%, transparent 60%)',
            }}
          />
          {/* Film grain overlay */}
          <Grain />
        </>
      }
      content={(slide) => (
        <div className="relative z-10 mx-auto max-w-7xl px-4 h-full flex items-end pb-10">
          <div className="max-w-3xl">
            {slide.eyebrow && <div className="h-caps text-sm text-white/80">{slide.eyebrow}</div>}
            <h1 className="h-serif text-4xl md:text-6xl font-semibold leading-tight mt-2">
              <span className="gold-sheen">{slide.title}</span>
            </h1>
            {slide.subtitle && (
              <p className="text-base md:text-lg text-white/85 mt-4 max-w-2xl">{slide.subtitle}</p>
            )}
            {slide.ctaHref && slide.ctaLabel && (
              <div className="mt-6">
                <Link href={slide.ctaHref} className="btn btn-gold">
                  {slide.ctaLabel}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    />
  )
}
