/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
    ],
  },

  experimental: {
    optimizePackageImports: ["swiper", "lucide-react"],
  },

    async redirects() {
    return [
      // ===== Legacy static .html -> clean routes =====
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/projects.html", destination: "/projects", permanent: true },
      { source: "/insights.html", destination: "/insights", permanent: true },
      { source: "/careers.html", destination: "/careers", permanent: true },
      { source: "/thank-you.html", destination: "/thank-you", permanent: true },

      // Gallery legacy
      { source: "/gallery.html", destination: "/gallery", permanent: true },
      { source: "/gallery.htm", destination: "/gallery", permanent: true },

      // ===== Old subfolder deployment =====
      { source: "/altinalivings1/:path*", destination: "/:path*", permanent: true },

      // ===== Project legacy .html/.htm -> clean slug =====
      { source: "/projects/:slug(.+)\\.html", destination: "/projects/:slug", permanent: true },
      { source: "/projects/:slug(.+)\\.htm", destination: "/projects/:slug", permanent: true },

      // ===== WP-ish feeds (if discovered) =====
      { source: "/feed/", destination: "/", permanent: true },
      { source: "/comments/feed/", destination: "/", permanent: true },

      // ===== macOS zip junk =====
      { source: "/__MACOSX/:path*", destination: "/", permanent: true },
    ];
  },

export default nextConfig;
