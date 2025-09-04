// src/app/layout.js
import Script from "next/script";
import "../styles/site.css"; // <-- Ensure src/styles/site.css exists

export const metadata = {
  title: "Altina Livings",
  description: "Altina Livings — premium curated living spaces.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Analytics snippet loaded after interactive */}
        <Script src="/assets/js/analytics.js" strategy="afterInteractive" />
        {/* You can add additional meta tags here if needed */}
      </head>
      <body>
        <div className="site-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
