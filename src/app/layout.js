// src/app/layout.js
import Script from "next/script";
import "../styles/site.css";
import Header from "../components/Header";

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
        {/* Load analytics after interactive */}
        <Script src="/assets/js/analytics.js" strategy="afterInteractive" />

        {/* JSON-LD: inject as string to avoid JSX parsing errors */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body>
        {/* Global header included site-wide */}
        <Header />
        <div className="site-wrapper">{children}</div>
      </body>
    </html>
  );
}
