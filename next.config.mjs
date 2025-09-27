// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
    ],
  },

  async redirects() {
    return [
      // DLF Independent Floors (Phase 2 & 3)
      {
        source: '/go/dlf-floors-wa',
        destination:
          'https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%27m%20interested%20in%20DLF%20Independent%20Floors%20%28Phase%202%20%26%203%29.%20Please%20share%20price%20list%20%26%20brochure.',
        permanent: false,
      },

      // DLF One Midtown
      {
        source: '/go/dlf-midtown-wa',
        destination:
          'https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%27m%20interested%20in%20DLF%20One%20Midtown.%20Please%20share%20price%20list%20%26%20brochure.',
        permanent: false,
      },

      // DLF SCO (Sector 67), Gurugram
      {
        source: '/go/dlf-sco-wa',
        destination:
          'https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%27m%20interested%20in%20DLF%20SCO%20%28Sector%2067%29%2C%20Gurugram.%20Please%20share%20price%20list%20%26%20brochure.',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
