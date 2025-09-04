'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Home, User, Building2, FileText, Briefcase, Phone } from 'lucide-react'
import { trackEvent } from '@/components/AnalyticsClient'

const PHONE = "9891234195";
const EMAIL = "info@altinalivings.com";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const marqueeText =
    '🏆 Premium Channel Partner for DLF | Shobha | M3M | Godrej | Exclusive Projects | Luxury Apartments | Commercial Spaces | Villas | Ready to Move | Under Construction | New Launch 🏆'

  const menuItems = [
    { name: 'Home', href: '/', icon: <Home size={16} /> },
    { name: 'About', href: '/about', icon: <User size={16} /> },
    { name: 'Projects', href: '/projects', icon: <Building2 size={16} /> },
    { name: 'Services', href: '/services', icon: <FileText size={16} /> },
    { name: 'Blogs', href: '/blog', icon: <FileText size={16} /> },
    { name: 'Career', href: '/career', icon: <Briefcase size={16} /> },
    { name: 'Contact', href: '/contact', icon: <Phone size={16} /> }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMenuClick = (itemName) => {
    trackEvent('menu_click', { menu_item: itemName })
    setIsMenuOpen(false)
  }

  const handlePhoneClick = () => {
    trackEvent('phone_click', { call_source: 'header' })
  }

  const handleEmailClick = () => {
    trackEvent('email_click', { email_source: 'header' })
  }

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', { message_source: 'floating_button' })
  }

  return (
    <>
      {/* Fixed Top Marquee Bar */}
      <div className="fixed top-0 w-full bg-gold-600 text-white py-2 z-50 overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div className="animate-infinite-scroll flex">
            {[...Array((4)] || []).map((_, i) => (
              <span
                key={i}
                className="mx-4 flex items-center text-sm md:text-base"
              >
                {marqueeText}
              </span>
            ))}
          </div>
          <div className="animate-infinite-scroll flex" aria-hidden="true">
            {[...Array((4)] || []).map((_, i) => (
              <span
                key={i}
                className="mx-4 flex items-center text-sm md:text-base"
              >
                {marqueeText}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Info - Top right */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 hidden md:flex items-center gap-4 text-sm bg-gold-700 px-3 py-1 rounded-lg">
          <a
            href={`tel:+91${PHONE}`}
            onClick={handlePhoneClick}
            className="hover:underline flex items-center gap-1 transition-colors hover:text-gold-200"
          >
            <span>📞</span>+91 {PHONE}
          </a>
          <span className="text-gold-300">|</span>
          <a
            href={`mailto:${EMAIL}`}
            onClick={handleEmailClick}
            className="hover:underline flex items-center gap-1 transition-colors hover:text-gold-200"
          >
            <span>✉️</span>{EMAIL}
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`fixed top-10 w-full z-50 bg-white shadow-lg transition-all duration-300 ${
          isScrolled ? 'shadow-xl' : 'shadow-lg'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <a href="/" className="flex items-center group">
              <img
                src="/images/logo.png"
                alt="ALTINA™ Livings Logo"
                className="h-12 w-auto mr-3"
              />
              <span className="text-xl font-bold text-gray-800 group-hover:text-gold-600 transition-colors">
                ALTINA™ Livings
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {(menuItems || []).map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => handleMenuClick(item.name)}
                  className="flex items-center gap-1 transition-all duration-300 hover:text-gold-500 text-gray-700 group/nav-item"
                >
                  <span className="group-hover/nav-item:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </a>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-4">
              <a
                href={`tel:+91${PHONE}`}
                onClick={handlePhoneClick}
                className="text-gold-600 hover:text-gold-700"
              >
                <Phone size={20} />
              </a>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isMenuOpen ? (
                  <X size={24} className="text-gray-800" />
                ) : (
                  <Menu size={24} className="text-gray-800" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 bg-white border-t">
              <div className="flex flex-col space-y-2">
                {(menuItems || []).map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => handleMenuClick(item.name)}
                    className="text-gray-700 py-3 px-4 hover:bg-gold-50 hover:text-gold-600 rounded-lg flex items-center gap-3 transition-colors"
                  >
                    <span className="text-gold-500">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </a>
                ))}

                {/* Mobile Contact */}
                <div className="border-t pt-4 mt-2">
                  <a
                    href={`tel:+91${PHONE}`}
                    onClick={handlePhoneClick}
                    className="flex items-center gap-3 py-2 px-4 text-gray-700 hover:bg-gold-50 hover:text-gold-600 rounded-lg transition-colors"
                  >
                    <Phone size={18} className="text-gold-500" />
                    <span>+91 {PHONE}</span>
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    onClick={handleEmailClick}
                    className="flex items-center gap-3 py-2 px-4 text-gray-700 hover:bg-gold-50 hover:text-gold-600 rounded-lg transition-colors"
                  >
                    <span className="text-gold-500">✉️</span>
                    <span>{EMAIL}</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Floating WhatsApp CTA */}
      <a
        href={`https://wa.me/91${PHONE}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl z-50 hover:bg-green-600 transition-colors animate-bounce group/whatsapp"
        aria-label="Contact us on WhatsApp"
      >
        <span className="text-lg group-hover/whatsapp:scale-110 transition-transform">💬</span>
      </a>

      {/* Infinite Scroll CSS */}
      <style jsx>{`
        @keyframes infinite-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  )
}
