// src/app/layout.js
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Altina Realty",
  description: "Premium real estate projects in Gurugram – DLF, Godrej, Sobha, M3M.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="page-bg antialiased text-gray-900">
        <Header />

        <main className="min-h-screen">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
