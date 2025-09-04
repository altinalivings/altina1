import './globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientRoot from '@/components/ClientRoot';

export const metadata = {
  title: 'Altina Livings',
  description: 'Luxury real-estate advisories and projects.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* GA4 */}
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA4_ID}`} />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.GA4_ID}', { send_page_view: false });
        `}</Script>

        {/* Facebook Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${process.env.FB_PIXEL}');
          fbq('track', 'PageView');
        `}</Script>

        {/* LinkedIn Insight */}
        <Script id="linkedin" strategy="afterInteractive">{`
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push("${process.env.LI_PARTNER}");
        `}</Script>
        <Script src="https://snap.licdn.com/li.lms-analytics/insight.min.js" async strategy="afterInteractive" />

        {/* Google Ads */}
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GADS_ID}`} />
        <Script id="google-ads" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.GADS_ID}');
        `}</Script>
      </head>
      <body>
        <ClientRoot>
          <Header />
          <main>{children}</main>
          <Footer />
        </ClientRoot>
      </body>
    </html>
  );
}
