/*
 * HeroImage component
 *
 * A premium full-bleed hero section that uses a high-resolution background
 * image, a dark gradient overlay, and a subtle gold glow to create
 * depth. It places your headline, subtitle and call-to-action in the
 * bottom-left, similar to luxury real estate websites. You can supply
 * custom props for the eyebrow label, title, subtitle and CTA. The
 * image prop should be a URL or path to a large image (WebP or JPEG).
 */
import Image from 'next/image'
import Link from 'next/link'
import Grain from '@/components/Grain'

export default function HeroImage({
  image,
  eyebrow = 'Curated Luxury',
  title,
  subtitle,
  ctaLabel = 'Explore the Collection',
  ctaHref = '/projects',
}: {
  image: string
  eyebrow?: string
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
}) {
  return (
    <section className="relative overflow-hidden">
      {/* Image wrapper */}
      <div className="relative h-[72vh] min-h-[520px]">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 md:scale-100"
        />
        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/60" />
        {/* Soft gold glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 80% at 15% 10%, rgba(201,162,39,.20) 0%, transparent 60%)',
          }}
        />
        {/* Film grain overlay */}
        <Grain />
        {/* Content container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 h-full flex items-end pb-10">
          <div className="max-w-3xl">
            <div className="h-caps text-sm text-white/80">{eyebrow}</div>
            <h1 className="h-serif text-4xl md:text-6xl font-semibold leading-tight mt-2">
              <span className="gold-sheen">{title}</span>
            </h1>
            {subtitle && (
              <p className="text-base md:text-lg text-white/85 mt-4 max-w-2xl">{subtitle}</p>
            )}
            <div className="mt-6">
              <Link href={ctaHref} className="btn btn-gold">
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}