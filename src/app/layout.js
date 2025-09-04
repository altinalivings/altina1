// Server Component (no "use client")
import FloatingButtons from "@/components/FloatingButtons";

import "@/styles/fab.css";
import "../styles/globals.css";

import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ClientProviders from "../components/ClientProviders";
import AnalyticsClient from "../components/AnalyticsClient";

export const metadata = {
  title: "ALTINA™ Livings",
  description: "Premium channel partner for leading real-estate developers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* GA4 */}
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-3Q43P5GKHK" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3Q43P5GKHK', { send_page_view: false });
        `}</Script>

        {/* Facebook Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">{`
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

        {/* LinkedIn Insight */}
        <Script id="linkedin" strategy="afterInteractive">{`
          _linkedin_partner_id = "515682278";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        `}</Script>
        <Script strategy="afterInteractive" src="https://snap.licdn.com/li.lms-analytics/insight.min.js" />

        {/* Google Ads */}
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=AW-17510039084"></Script>
        <Script id="google-ads" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17510039084');
        `}</Script>
      </head>

      <body>
        <ClientProviders>
          {/* Ensures GA CID is captured once GA is ready */}
          <AnalyticsClient />
          <Header />
          <main>{children}</main>
          <FloatingButtons />
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
