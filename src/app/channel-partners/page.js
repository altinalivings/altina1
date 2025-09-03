// app/channel-partners/page.js
'use client'

import Head from 'next/head'
import Image from 'next/image'
import { Award, Shield, CheckCircle, Star, Building2 } from 'lucide-react'
import { trackEvent } from '@/components/Analytics'

const PHONE = "9891234195";

export default function ChannelPartners() {
  const partners = [
    {
      id: 'dlf',
      name: 'DLF',
      logo: '/builders/dlf.png',
      description: 'India\'s largest real estate developer with iconic projects.',
      projects: 12,
      since: 2008,
      specialties: ['Luxury Apartments', 'Commercial Spaces', 'High-End Retail']
    },
    // Add other partners
  ]

  return (
    <>
      <Head>
        <title>Channel Partners | Altina Livings</title>
        <meta name="description" content="We are authorized channel partners for DLF, Shobha, M3M, Godrej Properties." />
      </Head>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Authorized Channel Partners</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            As premium channel partners for India's leading developers
          </p>
        </div>
      </section>

      {/* Partners content here - similar to previous example */}
    </>
  )
}
