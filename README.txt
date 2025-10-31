ALTINA™ SEO PACK — Drop-in Files & Safe Patches

Files included:
1) vercel.json
   - Adds HSTS & security headers; caches Next static assets & images.

2) next.config.mjs
   - Enables AVIF/WebP image formats; whitelists remote hosts; optimizes package imports.

3) src/components/RelatedProjects.tsx
   - Simple 'More like this' component to improve internal linking from project pages.

4) patches/projects.seo.json
   - SAFE PATCH: Only updates SEO-critical fields (slug/description/seo) for 3 projects:
     - dlf-one-midtown
     - dlf-independent-floors-phase-2-3
     - dlf-sco-67
   - Merge these into your existing src/data/projects.json matching by 'id'.

5) src/data/posts.json
   - Enhanced posts with per-post SEO blocks, lastmod, internal links.

Suggested code changes (not included as files):
- Make /projects static with ISR:
    // src/app/projects/page.tsx
    export const revalidate = 3600; // remove dynamic = "force-dynamic"

- Ensure each project page uses seo.title/seo.description/seo.canonical as fallbacks for metadata.

Deploy steps:
1) Copy vercel.json and next.config.mjs to repo root.
2) Copy src/components/RelatedProjects.tsx to your components folder.
3) Merge patches/projects.seo.json into src/data/projects.json (match by id).
4) Replace src/data/posts.json with the one here (or merge content).
5) Deploy; then submit /sitemap.xml in Google Search Console.

— Made for Altina™ Livings
