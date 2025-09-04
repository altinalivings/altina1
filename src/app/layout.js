// src/app/layout.js
import Script from "next/script";
import "../styles/site.css";

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Altina Livings",
  "url": "https://example.com",
  "logo": "https://example.com/assets/img/logo.png",
  "telephone": "",
  "areaServed": "India"
};

export const metadata = {
  title: "Altina Livings",
  description: "Altina Livings — premium curated living spaces."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Analytics script (loads after interactive) */}
        <Script src="/assets/js/analytics.js" strategy="afterInteractive" />

        {/* JSON-LD for SEO: render as a string via dangerouslySetInnerHTML */}
        <script
          type="application/ld+json"
          // React requires the JSON as a string; use JSON.stringify to avoid syntax errors
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />

        {/* Additional head tags can go here */}
      </head>
      <body>
        <div className="site-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
