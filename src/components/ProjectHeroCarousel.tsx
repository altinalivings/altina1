/*
 * ProjectHeroCarousel component
 *
 * Provides a hero section for individual project pages using the
 * Carousel.  Accepts multiple images and overlays the project
 * title and subtitle.  This mirrors the PageHero styling but
 * enables sliding between multiple hero shots.  The overlay uses
 * a dark gradient to improve contrast for the text.
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

interface Props {
  images: string[]
  title: string
  subtitle?: string
}

export default function ProjectHeroCarousel({ images, title, subtitle }: Props) {
  if (!images || images.length === 0) return null
  return (
    <Carousel
      slides={images.map((src) => ({ src }))}
      aspect="h-[48vh] min-h-[360px]"
      autoPlayMs={5200}
      overlay={
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
          {/* Slight dark layer to soften edges */}
          <div className="absolute inset-0 bg-black/10" />
        </>
      }
      content={() => (
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="mx-auto max-w-7xl px-4">
            <h1 className="h-serif text-3xl md:text-5xl font-semibold drop-shadow">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-muted md:text-lg drop-shadow-lg">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
    />
  )
}