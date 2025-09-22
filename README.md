# Altina Livings — Next.js Channel Partner Site

This repo contains a Next.js (App Router) starter for **ALTINA™ Livings**, a premium channel‑partner website for luxury real estate projects in Gurugram and the Delhi NCR region.

## Features

- Dark, luxurious theme with golden accents (Altina palette).
- SEO‑ready: dynamic sitemap, robots, JSON‑LD product schema.
- Analytics & Ads: Google Analytics 4, Meta Pixel, LinkedIn Insight, and Google Ads conversion tracking.
- Lead capture form that enriches submissions with UTM parameters, click IDs (`gclid`, `fbclid`, `msclkid`), GA client ID, referrer, device hints, and first/last touch timestamps.
- Leads are posted to a Google Sheets Apps Script Web App. A sample Apps Script is provided.
- Sample project data with additional fields: `amenities`, `cost`, `area`, `type`, `floorplan`, `brochure`.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and fill in your real values. At minimum set `GS_WEBAPP_URL` to your Apps Script deployment and update the public site URL if hosting on a custom domain.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

5. Customize `/src/data/projects.json` with your own inventory of DLF, M3M, Sobha, and Godrej projects.

## Deployment

Deploy to Vercel, Netlify, or any platform supporting Node.js. Ensure that environment variables from `.env.local` are configured in your hosting environment. The lead capture API will post JSON to your Google Sheets Apps Script; test by submitting a form and verifying a new row appears in the sheet.

## License

This project is provided as a sample and does not include any proprietary branding or logos. Replace the placeholder logo in `/public/logos/altina.svg` with your own artwork.