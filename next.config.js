/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    GA4_ID: 'G-3Q43P5GKHK',
    FB_PIXEL: '2552081605172608',
    LI_PARTNER: '515682278',
    GADS_ID: 'AW-17510039084',
    GADS_SENDTO: 'AW-17510039084/L-MdCP63l44bEKz8t51B',
    WEB3_KEY: '1e11642f-93bd-49b4-85bc-38d9765cf956'
  }
}

module.exports = nextConfig
