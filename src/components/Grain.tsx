/*
 * Grain overlay component
 *
 * This component adds a subtle film grain overlay on top of any section. It
 * uses an inline SVG with fractal noise and a soft-light blend. The opacity
 * can be adjusted via inline styles when used. The overlay is pointer-events
 * none so it won’t interfere with interactions.
 */

/*
 * Mark this file as a client component.  The Grain overlay is used inside
 * client components such as HeroCarousel and ProjectHeroCarousel.  Next.js
 * does not allow importing server components into client components, so
 * adding the `use client` directive ensures this component runs on the
 * client and can be safely imported into other client components.
 */

"use client"

export default function Grain({ opacity = 0.07 }: { opacity?: number }) {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='72' height='72' filter='url(#n)' opacity='0.45'/></svg>`
  )
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-soft-light"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml;utf8,${svg}")`,
      }}
    />
  )
}