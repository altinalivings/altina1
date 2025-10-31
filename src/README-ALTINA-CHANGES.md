# ALTINA - CTA / Footer / Analytics Normalization

## What changed
- Ensured **only one** Floating CTA stack per page (Project + Developer).
- `ProjectDetailClient` is **headless** (no UI) and not auto-mounted on pages.
- Kept global **StickyCTABar** for mobile (in layout), while right-rail CTAs hide on mobile.
- Normalized **SiteFooter** look and subscribe handler.
- Centralized analytics (GA4 / GAds / FB Pixel / LinkedIn) in `components/Analytics.tsx` and loaded once in `layout.tsx`.

## Where to put images
- Developer hero: `public/developers/{slug}/hero.jpg`
- Developer gallery: `public/developers/{slug}/gallery/*.jpg`
- Project hero: `public/projects/{id}/hero.jpg`
- Project gallery: `public/projects/{id}/gallery/*.jpg`
- Icons: `public/icons/*.png` (`phone.png`, `download.png`, `home.png`, and socials)

## Env (example)
NEXT_PUBLIC_SITE_URL=https://www.altinalivings.com
NEXT_PUBLIC_GA_ID=G-3Q43P5GKHK
NEXT_PUBLIC_FB_PIXEL=2552081605172608
NEXT_PUBLIC_LI_PARTNER=515682278
NEXT_PUBLIC_GADS_ID=AW-17510039084
NEXT_PUBLIC_GADS_SEND_TO=AW-17510039084/L-MdCP63l44bEKz8t51B
