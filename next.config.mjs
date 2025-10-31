/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' }
    ]
  },
  experimental: {
    optimizePackageImports: ['swiper', 'lucide-react']
  }
};

export default nextConfig;
