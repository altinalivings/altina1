/*
 * Reveal component
 *
 * Wraps children in a div that fades and translates upward as it
 * enters the viewport. It uses a simple Intersection Observer to add
 * a `reveal-visible` class when the element becomes visible. A CSS
 * custom property is used to control the delay before the transition
 * begins. This implementation avoids external dependencies like
 * framer‑motion, making it lightweight and compatible with the
 * environment where only React is installed.
 */
'use client'
import { useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

export default function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    // Set the custom property for transition delay based on the prop
    element.style.setProperty('--reveal-delay', `${delay}s`)
    // Intersection Observer callback: add class when element enters viewport
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add('reveal-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      }
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [delay])

  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  )
}
