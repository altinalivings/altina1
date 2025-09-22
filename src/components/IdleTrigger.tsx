'use client'
import { useEffect } from 'react'
export default function IdleTrigger() {
  useEffect(() => {
    if (sessionStorage.getItem('enquiryShown') === '1') return
    const t = setTimeout(() => {
      sessionStorage.setItem('enquiryShown', '1')
      window.dispatchEvent(new Event('open-enquiry'))
    }, 10000)
    return () => clearTimeout(t)
  }, [])
  return null
}
