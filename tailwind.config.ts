import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        altina: {
          gold: '#C9A227',
          goldSoft: '#E9D9A5',
          blue: '#0D1B52',
          ivory: '#F7F7F5',
          charcoal: '#0C0C0D',
          ink: '#1A1A1A',
          silver: '#C0C0C0',
          muted: '#8D8E92',
          cta: '#C9A227',
          ctaAlt: '#2E8B57',
          focus: '#6EA8FF',
        },
      },
      boxShadow: {
        altina: '0 10px 30px rgba(0,0,0,.45)',
        soft: '0 2px 12px rgba(0,0,0,.25)',
      },
      borderRadius: {
        xl2: '1rem',
      },
      backgroundImage: {
        'altina-gold': 'linear-gradient(135deg, #D9B64C 0%, #C9A227 45%, #9C7C1F 100%)',
        'altina-blue': 'radial-gradient(100% 100% at 0% 0%, #0D1B52 0%, #0A133B 100%)',
      },
    },
  },
  plugins: [],
}

export default config