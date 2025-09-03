// components/AnalyticsDebug.js
'use client'

import { useState } from 'react'
import { trackEvent } from './Analytics'

export default function AnalyticsDebug() {
  const [isVisible, setIsVisible] = useState(false)
  
  const testEvents = [
    { name: 'test_event', params: { test_param: 'test_value' } },
    { name: 'page_view', params: { page_title: 'Test Page' } },
    { name: 'contact_click', params: { source: 'test' } }
  ]

  if (typeof window === 'undefined') return null

  return (
    <>
      {/* Debug toggle button */}
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-20 left-6 bg-blue-500 text-white p-2 rounded-full z-50"
        style={{ width: '40px', height: '40px' }}
      >
        🔍
      </button>

      {/* Debug panel */}
      {isVisible && (
        <div className="fixed bottom-24 left-6 bg-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
          <h3 className="font-bold mb-2">Analytics Debug</h3>
          <div className="mb-2">
            <div>GA4: {window.gtag ? '✅ Loaded' : '❌ Not loaded'}</div>
            <div>FBQ: {window.fbq ? '✅ Loaded' : '❌ Not loaded'}</div>
          </div>
          
          <div className="space-y-2">
            {testEvents.map((event, index) => (
              <button
                key={index}
                onClick={() => trackEvent(event.name, event.params)}
                className="block w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Test: {event.name}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => {
              console.log('Window dataLayer:', window.dataLayer)
              console.log('Window gtag:', window.gtag)
              console.log('Window fbq:', window.fbq)
            }}
            className="mt-2 block w-full p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            Log Analytics Info
          </button>
        </div>
      )}
    </>
  )
}
