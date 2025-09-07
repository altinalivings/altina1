// src/components/Analytics.jsx
"use client";

import Script from "next/script";

export default function Analytics() {
  const GA4 = process.env.GA4_ID;
  const FB = process.env.FB_PIXEL;
  const LI = process.env.LI_PARTNER;
  const GADS = process.env.GADS_ID;
  const GADS_SENDTO = process.env.GADS_SENDTO;

  return (
    <>
      {/* -------- Google / GA4 + Google Ads -------- */}
      {GA4 && (
        <>
          <Script
            id="gtag-base"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`}
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4}');
              ${GADS ? `gtag('config', '${GADS}');` : ""}
            `}
          </Script>
          {GADS_SENDTO && (
            <Script id="gtag-conversion" strategy="afterInteractive">
              {`
                window.gtag_send_to = '${GADS_SENDTO}';
              `}
            </Script>
          )}
        </>
      )}

      {/* -------- Facebook Pixel -------- */}
      {FB && (
        <>
          <Script id="fbq-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${FB}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/* -------- LinkedIn Insight -------- */}
      {LI && (
        <>
          <Script id="linkedin-insight" strategy="afterInteractive">
            {`
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(${JSON.stringify(Number(LI))});
            `}
          </Script>
          <Script id="linkedin-loader" strategy="afterInteractive">
            {`
              (function(){
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript"; b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);
              })();
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://px.ads.linkedin.com/collect/?pid=${LI}&fmt=gif`}
            />
          </noscript>
        </>
      )}
    </>
  );
}
