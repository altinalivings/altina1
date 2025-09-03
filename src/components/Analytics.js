"use client";

import { Suspense } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

function AnalyticsInner() {
  const params = useSearchParams();

  return (
    <>
      {/* Google Analytics */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-3Q43P5GKHK" />
      <Script id="ga4">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-3Q43P5GKHK');
      `}</Script>

      {/* Facebook Pixel */}
      <Script id="fb-pixel">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '2552081605172608');
        fbq('track', 'PageView');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=2552081605172608&ev=PageView&noscript=1"
        />
      </noscript>
    </>
  );
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsInner />
    </Suspense>
  );
}

// Utility function to track events
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window === "undefined") return;
  const debug = true; // Set to false in production

  if (window.gtag) {
    window.gtag("event", eventName, parameters);
    if (debug && process.env.NODE_ENV !== "production") {
      console.log("GA4 Event:", eventName, parameters);
    }
  }
  if (window.fbq) {
    window.fbq("trackCustom", eventName, parameters);
    if (debug && process.env.NODE_ENV !== "production") {
      console.log("FB Event:", eventName, parameters);
    }
  }
  if (window.lintrk) {
    window.lintrk("track", { conversion_id: 515682278 });
    if (debug && process.env.NODE_ENV !== "production") {
      console.log("LinkedIn Event:", eventName, parameters);
    }
  }
};
