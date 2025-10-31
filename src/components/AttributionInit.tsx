'use client'
import { useEffect } from 'react'
import { initAttributionOnce } from '@/lib/attribution'

export default function AttributionInit() {
  useEffect(() => {
    initAttributionOnce()
  }, [])
  return null
}