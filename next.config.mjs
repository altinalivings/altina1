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

  // ✅ 301 redirects to eliminate old URL 404s in Google Search Console
  async redirects() {
    return [
      // --- Old static .html pages -> clean routes ---
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/projects.html", destination: "/projects", permanent: true },
      { source: "/insights.html", destination: "/insights", permanent: true },
      { source: "/careers.html", destination: "/careers", permanent: true },
      { source: "/thank-you.html", destination: "/thank-you", permanent: true },

      // --- Old subfolder deployment (seen in your GSC list) ---
      // Example: /altinalivings1/projects/xyz.html -> /projects/xyz
      { source: "/altinalivings1/:path*", destination: "/:path*", permanent: true },

      // --- Project .html -> project clean slug ---
      // Example: /projects/crc-the-flagship.html -> /projects/crc-the-flagship
      { source: "/projects/:slug(.+)\\.html", destination: "/projects/:slug", permanent: true },

      // --- Optional: remove trailing /index.html anywhere ---
      { source: "/:path*/index.html", destination: "/:path*", permanent: true },

      // --- WordPress-ish feeds (if they appear) -> homepage or insights ---
      // If you have an insights/blog page, you can send /feed/ there.
      { source: "/feed/", destination: "/", permanent: true },
      { source: "/comments/feed/", destination: "/", permanent: true },

      // --- macOS zip artifact path (seen in your list) ---
      { source: "/__MACOSX/:path*", destination: "/", permanent: true },
	    // projects .html -> clean slug
    { source: "/projects/:slug(.+)\\.html", destination: "/projects/:slug", permanent: true },

    // ✅ projects .htm -> clean slug
    { source: "/projects/:slug(.+)\\.htm", destination: "/projects/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
