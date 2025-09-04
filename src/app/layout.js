// src/app/layout.js
import "../app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders";
import AnalyticsClient from "@/components/AnalyticsClient";

export const metadata = {
  title: "Altina Livings",
  description: "Real estate projects and services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <AnalyticsClient />
          <Header />
          <main>{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
