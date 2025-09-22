/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      /*
       * Allow unsplash's random image service.  Using source.unsplash.com
       * enables us to fetch location and offering photos on the fly via
       * simple query parameters (e.g. /400x300/?delhi,city).  Without
       * specifying this host, Next.js would block these remote images.
       */
      { protocol: 'https', hostname: 'source.unsplash.com' },
    ],
  },
}

export default nextConfig