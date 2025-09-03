// components/Analytics.js
'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'

const GA4_ID = "G-3Q43P5GKHK";
const FB_PIXEL = "2552081605172608";
const LI_PARTNER = "515682278";
const GADS_ID = "AW-17510039084";
const GADS_SENDTO = "AW-17510039084/L-MdCP63l44bEKz8t51B";

// Debug mode - set to false in production
const DEBUG = true;

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (DEBUG) {
      console.log('Analytics component mounted');
    }
    
    // Initialize Facebook Pixel
    if (typeof window !== 'undefined') {
      // Facebook Pixel
      window.fbq = window.fbq || function() {
        if (DEBUG) console.log('FB Pixel event:', arguments);
        (window.fbq.q = window.fbq.q || []).push(arguments);
      };
      
      try {
        window.fbq('init', FB_PIXEL);
        window.fbq('track', 'PageView');
        if (DEBUG) console.log('FB Pixel initialized');
      } catch (e) {
        if (DEBUG) console.error('FB Pixel error:', e);
      }
      
      // LinkedIn Insight Tag
      try {
        window._linkedin_partner_id = LI_PARTNER;
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
        if (DEBUG) console.log('LinkedIn Insight initialized');
      } catch (e) {
        if (DEBUG) console.error('LinkedIn Insight error:', e);
      }
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (pathname && typeof window !== 'undefined' && window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      window.gtag('config', GA4_ID, {
        page_path: url,
        debug_mode: DEBUG
      });
      
      if (DEBUG) console.log('GA Pageview tracked:', url);
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        onLoad={() => {
          if (DEBUG) console.log('GTAG script loaded');
        }}
        onError={() => {
          if (DEBUG) console.error('GTAG script failed to load');
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Configure GA4
            gtag('config', '${GA4_ID}', {
              page_location: window.location.href,
              debug_mode: ${DEBUG}
            });
            
            // Configure Google Ads
            gtag('config', '${GADS_ID}');
            
            console.log('Google Analytics initialized with ID: ${GA4_ID}');
          `,
        }}
      />
      
      {/* Facebook Pixel */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          `,
        }}
      />
      
      {/* LinkedIn Insight Tag */}
      <Script
        id="linkedin-insight"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `,
        }}
      />
      
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}

// Utility function to track events
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window === 'undefined') return;
  
  const debug = true; // Set to false in production
  
  if (debug) {
    console.log('Tracking event:', eventName, parameters);
  }
  
  // Google Analytics
  if (window.gtag) {
    try {
      window.gtag('event', eventName, parameters);
      if (debug) console.log('GA Event sent:', eventName);
    } catch (e) {
      if (debug) console.error('GA Event error:', e);
    }
  } else {
    if (debug) console.warn('GTAG not available for event:', eventName);
  }
  
  // Facebook Pixel - map generic events to FB standard events
  if (window.fbq) {
    try {
      const fbEventMap = {
        'contact_click': 'Contact',
        'phone_click': 'Contact',
        'form_submit': 'Lead',
        'conversion': 'Purchase',
        'page_view': 'PageView'
      };
      
      const fbEvent = fbEventMap[eventName] || eventName;
      window.fbq('track', fbEvent, parameters);
      if (debug) console.log('FB Event sent:', fbEvent);
    } catch (e) {
      if (debug) console.error('FB Event error:', e);
    }
  }
  
  // Google Ads Conversion Tracking
  if (eventName === 'conversion' && window.gtag) {
    try {
      window.gtag('event', 'conversion', {
        'send_to': '${GADS_SENDTO}',
        ...parameters
      });
      if (debug) console.log('Google Ads conversion sent');
    } catch (e) {
      if (debug) console.error('Google Ads conversion error:', e);
    }
  }
};
