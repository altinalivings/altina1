/*
 * Carousel component
 *
 * A lightweight, accessible slider for images and content.  Supports auto‑play,
 * arrows, dots and swipe gestures out of the box.  It accepts an array of
 * slides where each slide defines an image source and optional properties.  A
 * render function can be passed via the `content` prop to customise the
 * overlay content per slide.  This component uses client‑only hooks, so
 * remember to import it lazily when used in server components.
 */

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

export type CarouselSlide = {
  /** Image source URL.  Use local paths for guaranteed rendering. */
  src: string
  /** Alt text for the image */
  alt?: string
  /** Optional content fields can be defined by consumers */
  [key: string]: any
}

export interface CarouselProps {
  /** Array of slide objects.  At least one slide is required. */
  slides: CarouselSlide[]
  /** CSS classes controlling the height/aspect ratio of the track */
  aspect?: string
  /** Milliseconds between auto‑advances.  Set to 0 to disable auto‑play. */
  autoPlayMs?: number
  /** Show circular navigation dots */
  showDots?: boolean
  /** Show previous/next arrow buttons */
  showArrows?: boolean
  /** Optional overlay node rendered above each slide (e.g., gradients) */
  overlay?: React.ReactNode
  /** Custom renderer for slide content.  Receives slide data and index. */
  content?: (slide: CarouselSlide, index: number) => React.ReactNode
}

export default function Carousel({
  slides,
  aspect = 'h-[72vh] min-h-[520px]',
  autoPlayMs = 5000,
  showDots = true,
  showArrows = true,
  overlay,
  content,
}: CarouselProps) {
  const [index, setIndex] = useState(0)
  const length = slides.length
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const allowAuto = autoPlayMs > 0 && length > 1

  // Normalise index to stay within [0, length)
  const goto = (n: number) => setIndex(((n % length) + length) % length)
  const next = () => goto(index + 1)
  const prev = () => goto(index - 1)

  // Set up auto‑play with cleanup
  useEffect(() => {
    if (!allowAuto) return
    timer.current && clearInterval(timer.current)
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % length)
    }, autoPlayMs)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [allowAuto, autoPlayMs, length])

  // Pause auto‑play on hover/focus
  const pause = () => {
    if (timer.current) clearInterval(timer.current)
  }
  const resume = () => {
    if (allowAuto) timer.current = setInterval(() => setIndex((i) => (i + 1) % length), autoPlayMs)
  }

  // Touch swipe handling
  const touchStart = useRef<{ x: number; t: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const x = e.touches[0].clientX
    touchStart.current = { x, t: Date.now() }
    pause()
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current
    if (!start) return resume()
    const dx = e.changedTouches[0].clientX - start.x
    const dt = Date.now() - start.t
    // Quick horizontal swipes move the carousel
    if (Math.abs(dx) > 40 && dt < 600) {
      if (dx < 0) next()
      else prev()
    }
    resume()
  }

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  // Compute track translation
  const translate = useMemo(() => `translateX(-${index * 100}%)`, [index])

  return (
    <div className="relative overflow-hidden select-none" onMouseEnter={pause} onMouseLeave={resume}>
      <div
        className={`relative flex transition-transform duration-500 ease-out ${aspect}`}
        style={{ transform: translate, width: `${length * 100}%` }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="relative shrink-0 w-full">
            <Image
              src={slide.src}
              alt={slide.alt ?? ''}
              fill
              sizes="100vw"
              className="object-cover"
              priority={idx === 0}
            />
            {overlay}
            {content ? content(slide, idx) : null}
          </div>
        ))}
      </div>
      {showArrows && length > 1 && (
        <>
          <button type=\"button\"
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 text-white w-9 h-9 md:w-10 md:h-10 grid place-items-center"
          >
            ‹
          </button>
          <button type=\"button\"
            aria-label="Next slide"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 text-white w-9 h-9 md:w-10 md:h-10 grid place-items-center"
          >
            ›
          </button>
        </>
      )}
      {showDots && length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, d) => (
            <button type=\"button\"
              key={d}
              onClick={() => goto(d)}
              aria-label={`Go to slide ${d + 1}`}
              className={`h-2.5 w-2.5 rounded-full border border-white/60 ${index === d ? 'bg-white' : 'bg-white/20'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}