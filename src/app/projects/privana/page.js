// app/projects/privana/page.js
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Bed, Bath, Square, Heart, Share2, Phone, MessageCircle, Download } from 'lucide-react'
import { trackEvent } from '@/components/AnalyticsClient'

export default function PrivanaPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [activeImage, setActiveImage] = useState(0)
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)

  useEffect(() => {
    // Track page view
    trackEvent('view_project', {
      project_id: 'privana',
      project_name: 'Privana by DLF',
      page_title: document.title,
      page_location: window.location.href
    })
  }, [])

  const handleEnquiryClick = () => {
    trackEvent('click_enquire_now', {
      project_id: 'privana',
      project_name: 'Privana by DLF'
    })
    setShowEnquiryForm(true)
  }

  const handleBrochureDownload = () => {
    trackEvent('download_brochure', {
      project_id: 'privana',
      project_name: 'Privana by DLF'
    })
    // Simulate download
    alert('Brochure download started!')
  }

  const handleShareClick = () => {
    trackEvent('share_project', {
      project_id: 'privana',
      project_name: 'Privana by DLF',
      platform: 'general'
    })
    
    if (navigator.share) {
      navigator.share({
        title: 'Privana by DLF - Premium Apartments',
        text: 'Check out Privana by DLF - premium luxury apartments with world-class amenities.',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const images = [
    '/projects/privana/1.jpg',
    '/projects/privana/2.jpg',
    '/projects/privana/3.jpg',
    '/projects/privana/4.jpg',
    '/projects/privana/5.jpg',
  ]

  const amenities = [
    { icon: '🏊', name: 'Swimming Pool' },
    { icon: '🏋️', name: 'Fitness Center' },
    { icon: '🌳', name: 'Landscaped Gardens' },
    { icon: '🚗', name: 'Parking' },
    { icon: '🎾', name: 'Tennis Court' },
    { icon: '👶', name: 'Children\'s Play Area' },
    { icon: '🔒', name: '24/7 Security' },
    { icon: '🏢', name: 'Clubhouse' },
  ]

  const specifications = {
    'Unit Types': ['3 BHK', '4 BHK', '5 BHK'],
    'Area Range': ['1800 sq.ft.', '2400 sq.ft.', '3200 sq.ft.'],
    'Status': 'Under Construction',
    'Possession': 'Dec 2025',
    'Total Towers': 5,
    'Total Floors': 18,
    'Total Units': 225
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <Link href="/projects" className="flex items-center text-gray-700 hover:text-gold-600">
          <ArrowLeft size={20} className="mr-2" />
          Back to Projects
        </Link>
        <div className="flex items-center space-x-4">
          <button onClick={handleShareClick} className="p-2 text-gray-600 hover:text-gold-600">
            <Share2 size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gold-600">
            <Heart size={20} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-96 w-full">
        <Image
          src={images[activeImage]}
          alt="Privana by DLF"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">Privana by DLF</h1>
          <div className="flex items-center">
            <MapPin size={18} className="mr-2" />
            <span>Sector 63, Gurugram</span>
          </div>
        </div>
        <div className="absolute bottom-6 right-6 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`w-3 h-3 rounded-full ${activeImage === index ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Facts Bar */}
      <div className="bg-gold-600 text-white py-4 px-6">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">₹4.2 Cr*</div>
            <div className="text-sm">Starting Price</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">3-5 BHK</div>
            <div className="text-sm">Unit Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">1800-3200</div>
            <div className="text-sm">Sq. Ft.</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">Dec 2025</div>
            <div className="text-sm">Possession</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {['overview', 'amenities', 'specifications', 'floor-plans', 'location'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 font-medium text-sm border-b-2 ${
                      activeTab === tab
                        ? 'border-gold-600 text-gold-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Overview</h2>
                <p className="text-gray-600 mb-6">
                  Privana by DLF offers luxurious apartments designed for modern living. With spacious layouts, 
                  premium finishes, and world-class amenities, Privana represents the pinnacle of luxury living 
                  in Gurugram. The project is strategically located with excellent connectivity to business hubs, 
                  educational institutions, and entertainment centers.
                </p>
                <p className="text-gray-600">
                  Each residence is crafted with attention to detail, featuring large windows for natural light, 
                  high-quality flooring, modern kitchen fixtures, and elegant bathroom fittings. The project 
                  emphasizes green living with ample open spaces, landscaped gardens, and eco-friendly features.
                </p>
              </div>
            )}

            {activeTab === 'amenities' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl mb-2">{amenity.icon}</div>
                      <div className="text-gray-700 font-medium">{amenity.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="mb-4 last:mb-0">
                      <h3 className="font-semibold text-gray-800 mb-2">{key}</h3>
                      <p className="text-gray-600">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'floor-plans' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Floor Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['3 BHK', '4 BHK', '5 BHK'].map((type) => (
                    <div key={type} className="border rounded-lg p-4 text-center">
                      <div className="bg-gray-200 h-48 mb-4 flex items-center justify-center">
                        <span className="text-gray-500">Floor Plan Image</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{type}</h3>
                      <p className="text-gray-600">1800-3200 sq. ft.</p>
                      <button className="mt-3 text-gold-600 hover:text-gold-700 text-sm font-medium">
                        Download PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
                <div className="bg-gray-200 h-64 mb-6 flex items-center justify-center">
                  <span className="text-gray-500">Map View</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Connectivity</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 10 mins from NH-8</li>
                      <li>• 15 mins from Delhi Border</li>
                      <li>• 20 mins from IGI Airport</li>
                      <li>• 5 mins from Metro Station</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Key Landmarks</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Cyber Hub: 8 mins</li>
                      <li>• Medanta Hospital: 10 mins</li>
                      <li>• DT Mall: 5 mins</li>
                      <li>• International School: 3 mins</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg sticky top-6">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Enquire About Privana</h3>
                <p className="text-gray-600 mb-6">
                  Get exclusive offers, price details, and a free site visit by our relationship manager.
                </p>

                <button
                  onClick={handleEnquiryClick}
                  className="w-full bg-gold-600 text-white py-3 rounded-lg font-semibold hover:bg-gold-700 mb-4"
                >
                  Enquire Now
                </button>

                <div className="flex space-x-3 mb-6">
                  <a
                    href="tel:+919891234195"
                    onClick={() => trackEvent('click_phone', { project_id: 'privana' })}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium text-center hover:bg-gray-200"
                  >
                    <Phone size={18} className="inline mr-2" />
                    Call
                  </a>
                  <a
                    href="https://wa.me/919891234195"
                    onClick={() => trackEvent('click_whatsapp', { project_id: 'privana' })}
                    className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg font-medium text-center hover:bg-green-200"
                  >
                    <MessageCircle size={18} className="inline mr-2" />
                    WhatsApp
                  </a>
                </div>

                <button
                  onClick={handleBrochureDownload}
                  className="w-full border border-gold-600 text-gold-600 py-2 rounded-lg font-medium hover:bg-gold-50 mb-6"
                >
                  <Download size={18} className="inline mr-2" />
                  Download Brochure
                </button>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">DLF Advantages</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ India's Largest Real Estate Developer</li>
                    <li>✓ 70+ Years of Experience</li>
                    <li>✓ Timely Possession</li>
                    <li>✓ Premium Quality Construction</li>
                    <li>✓ Best-in-Class Amenities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Enquire About Privana</h3>
            <form>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="Any specific requirements?"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEnquiryForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    trackEvent('submit_enquiry_form', { project_id: 'privana' })
                    setShowEnquiryForm(false)
                  }}
                  className="flex-1 bg-gold-600 text-white py-2 rounded-md font-medium hover:bg-gold-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
