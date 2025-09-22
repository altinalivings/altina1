/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        altina: {
          // Primary palette inspired by the poster: deep ink and blue‑black surfaces
          ink: '#0B0B0C',
          blueblack: '#0D0F18',
          // Metallic accents
          silver: '#C0C0C0',
          gold: '#C9A227',
          goldDeep: '#9C7C1F',
          // Neutral for body copy
          ivory: '#F7F7F5',
          muted: '#8D8E92',
        /*
         * Emerald accents
         *
         * To honour the user's request for a "lucky" emerald hue, we introduce a
         * complementary green palette. Emerald (#50c878) carries connotations
         * of renewal, prosperity and luxury【79689729971108†L129-L155】.  We've
         * created three shades to support gradients and variation: a light
         * counterpart, the base emerald, and a deeper shade.  These can be
         * referenced via `text-altina-emerald`, `bg-altina-emeraldDeep`, etc.
         */
        emeraldLight: '#79CEA3',
        emerald: '#50C878',
        emeraldDeep: '#3A9B5C',
        },
      },
      boxShadow: {
        altina: '0 12px 40px rgba(0,0,0,.45)',
        soft: '0 2px 12px rgba(0,0,0,.25)',
      },
      backgroundImage: {
        // Gold gradient for buttons and highlights
        'gold-grad': 'linear-gradient(135deg, #D9B64C 0%, #C9A227 45%, #9C7C1F 100%)',
        // Dark radial used in hero section
        'hero-dark': 'radial-gradient(120% 120% at 0% 0%, #12131D 0%, #0B0B0C 65%)',
        /*
         * Emerald gradient for optional accents
         * Fades from a soft, light green into the rich emerald base and down to a
         * deeper shade. Use this for button backgrounds or decorative stripes.
         */
        'emerald-grad': 'linear-gradient(135deg, #79CEA3 0%, #50C878 45%, #3A9B5C 100%)',
      },
      letterSpacing: {
        widecaps: '.18em',
      },
    },
  },
  plugins: [],
}

module.exports = config