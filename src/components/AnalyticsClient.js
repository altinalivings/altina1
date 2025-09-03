// components/AnalyticsClient.js
'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const GA4_ID = "G-3Q43P5GKHK";
const DEBUG = true; // Set to false in production

// Debug logging function
const logDebug = (message, data = null) => {
  if (DEBUG) {
    if (process.env.NODE_ENV !== "production") console.log(`[GA4 Debug] ${message}`, data || '');
  }
};

export default function AnalyticsClient() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    logDebug('AnalyticsClient component mounted');
    
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Override gtag function to capture all events for debugging
    if (typeof window.gtag === 'undefined') {
      window.gtag = function() {
        logDebug('GA Event triggered', arguments);
        window.dataLayer.push(arguments);
      };
      
      // Set initial config
      window.gtag('js', new Date());
      window.gtag('config', GA4_ID, {
        debug_mode: DEBUG,
        page_location: window.location.href,
        page_title: document.title
      });
      
      logDebug('GA4 initialized with ID:', GA4_ID);
      setIsLoaded(true);
    } else {
      logDebug('gtag already exists, reusing');
      setIsLoaded(true);
    }

    // Track initial pageview
    logDebug('Tracking initial pageview');
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });

  }, []);

  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        onLoad={() => {
          logDebug('GTAG script loaded successfully');
        }}
        onError={() => {
          console.error('[GA4 Error] Failed to load GTAG script');
        }}
      />
    </>
  );
}

// Utility function to track events
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window === 'undefined') return;
  
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, {
        ...parameters,
        debug_mode: DEBUG
      });
      logDebug(`Event "${eventName}" sent`, parameters);
    } catch (e) {
      console.error(`[GA4 Error] Failed to send event "${eventName}":`, e);
    }
  } else {
    console.warn(`[GA4 Warning] gtag not available for event "${eventName}"`);
  }
};
