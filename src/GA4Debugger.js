// components/GA4Debugger.js
'use client'

import { useState, useEffect } from 'react'
import { trackEvent } from './AnalyticsClient'

const GA4Debugger = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState({
    gtag: typeof window !== 'undefined' && typeof window.gtag === 'function',
    dataLayer: typeof window !== 'undefined' && Array.isArray(window.dataLayer)
  })

  useEffect(() => {
    // Listen for GA4 events
    if (typeof window !== 'undefined') {
      const originalGtag = window.gtag
      
      if (typeof originalGtag === 'function') {
        window.gtag = function() {
          // Capture the event for debugging
          if (arguments[0] === 'event') {
            setEvents(prev => [...prev, {
              name: arguments[1],
              params: arguments[2],
              timestamp: new Date().toLocaleTimeString()
            }])
          }
          
          // Call original gtag function
          return originalGtag.apply(this, arguments)
        }
      }
      
      // Check status periodically
      const interval = setInterval(() => {
        setStatus({
          gtag: typeof window.gtag === 'function',
          dataLayer: Array.isArray(window.dataLayer)
        })
      }, 2000)
      
      return () => clearInterval(interval)
    }
  }, [])

  const testEvent = () => {
    trackEvent('debug_test', {
      category: 'debug',
      label: 'Test event from debugger',
      value: 1
    })
  }

  const clearEvents = () => {
    setEvents([])
  }

  if (typeof window === 'undefined') return null

  return (
    <>
      {/* Debugger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-gold-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        {isOpen ? '✕' : 'GA4'}
      </button>

      {/* Debugger Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 max-h-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200">
          <div className="bg-gold-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-bold">GA4 Debugger</h3>
            <div className="flex space-x-2">
              <button 
                onClick={clearEvents}
                className="text-white hover:text-gray-200 text-sm"
                title="Clear events"
              >
                🗑️
              </button>
              <button 
                onClick={testEvent}
                className="text-white hover:text-gray-200 text-sm"
                title="Test event"
              >
                🔍
              </button>
            </div>
          </div>
          
          <div className="p-3 bg-gray-100">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className={`text-sm p-2 rounded text-center ${
                status.gtag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                gtag: {status.gtag ? '✅' : '❌'}
              </div>
              <div className={`text-sm p-2 rounded text-center ${
                status.dataLayer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                dataLayer: {status.dataLayer ? '✅' : '❌'}
              </div>
            </div>
          </div>
          
          <div className="p-3 overflow-y-auto max-h-48">
            <h4 className="font-medium text-sm mb-2">Event Log:</h4>
            {events.length === 0 ? (
              <p className="text-gray-500 text-sm">No events recorded yet</p>
            ) : (
              <div className="space-y-2">
                {events.slice().reverse().map((event, index) => (
                  <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                    <div className="flex justify-between">
                      <span className="font-medium">{event.name}</span>
                      <span className="text-gray-500">{event.timestamp}</span>
                    </div>
                    {event.params && (
                      <div className="mt-1 text-gray-600 truncate">
                        {JSON.stringify(event.params)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default GA4Debugger
