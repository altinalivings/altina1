// Server Component (no "use client")
import "@/styles/globals.css";
import "@/styles/fab.css";

import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders";
import AnalyticsClient from "@/components/AnalyticsClient";
import FloatingButtons from "@/components/FloatingButtons";
import '/assets/css/site.css';


// Sitewide SEO
export const metadata = {
  metadataBase: new URL("https://altina.in"),
  title: {
    default: "ALTINA™ Livings",
    template: "%s | ALTINA™ Livings",
  },
  description:
    "Premium channel partner for leading real-estate developers. Curated projects, expert guidance, zero brokerage for buyers.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://altina.in/",
    title: "ALTINA™ Livings",
    description:
      "Premium channel partner for leading real-estate developers. Curated projects, expert guidance, zero brokerage for buyers.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "ALTINA™ Livings" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALTINA™ Livings",
    description:
      "Premium channel partner for leading real-estate developers. Curated projects, expert guidance, zero brokerage for buyers.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Font (Inter) */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* GA4 */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-3Q43P5GKHK" />
        <Script id="ga4">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3Q43P5GKHK', { send_page_view: false });
        `}</Script>

        {/* Facebook Pixel */}
        <Script id="fb-pixel">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');fbq('init','2552081605172608');fbq('track','PageView');
        `}</Script>

        {/* LinkedIn Insight */}
        <Script id="linkedin">{`
          _linkedin_partner_id="515682278";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        `}</Script>
        <Script src="https://snap.licdn.com/li.lms-analytics/insight.min.js" async />

        {/* Google Ads */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17510039084" />
        <Script id="google-ads">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date()); gtag('config','AW-17510039084');
        `}</Script>
      <Script src="/assets/js/analytics.js" strategy="afterInteractive" />
</head>

      <body>
        <ClientProviders>
          <AnalyticsClient />
          <Header />
          {/* universal wrapper keeps content aligned */}
          <main className="wrapper">{children}</main>
          <FloatingButtons />
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
