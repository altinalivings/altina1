import "./globals.css";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageViewTracker from "../components/PageViewTracker"; // 🔹 SPA tracking

export const metadata = {
  title: "Altina Livings",
  description: "Explore premium real estate projects with Altina Livings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* GA4 */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-3Q43P5GKHK" />
        <Script id="ga4">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3Q43P5GKHK', { send_page_view: false }); // we’ll handle manually
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

        {/* LinkedIn Insight */}
        <Script id="linkedin">{`
          _linkedin_partner_id = "515682278";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        `}</Script>
        <Script src="https://snap.licdn.com/li.lms-analytics/insight.min.js" async></Script>

        {/* Google Ads */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17510039084"></Script>
        <Script id="google-ads">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17510039084');
        `}</Script>
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <PageViewTracker /> {/* 🔹 listens for route changes */}
      </body>
    </html>
  );
}
