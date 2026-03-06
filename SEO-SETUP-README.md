# Altina SEO – Step 1 (Technical Setup)

You already have `next-seo` and `next-sitemap` in package.json. This pack includes:
- `next-seo.config.ts`
- `next-sitemap.config.js`
- `public/robots.txt`
- `src/lib/seo.ts` (helper to generate JSON-LD for a project)

## 1) Wire up next-seo in layout
In `src/app/layout.tsx` (or wherever your RootLayout is), add:

```tsx
import { DefaultSeo } from "next-seo";
import SEO from "../../next-seo.config";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DefaultSeo {...SEO} />
        {children}
      </body>
    </html>
  );
}
```

## 2) Add postbuild script for sitemap
In your `package.json`, add:
```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```
Then run:
```bash
npm run build
# this generates /public/sitemap.xml automatically
```

## 3) Per-project SEO (App Router)
In `src/app/projects/[id]/page.tsx`, add `generateMetadata` and JSON-LD:

```tsx
import projects from "@/data/projects.json";
import { Metadata } from "next";
import Script from "next/script";
import { projectJsonLd } from "@/src/lib/seo";

function getProject(slugOrId: string) {
  const list = projects as any[];
  return list.find(p => p.slug === slugOrId || p.id === slugOrId);
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = getProject(params.id);
  const title = p?.seo?.title || p?.name || "Project";
  const description = p?.seo?.description || p?.about || undefined;
  const canonical = p?.seo?.canonical || `https://www.altinalivings.com/projects/${p?.slug || p?.id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: p?.hero ? [{ url: p.hero, width: 1200, height: 630, alt: p?.name }] : undefined,
      siteName: "ALTINA™ Livings",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: p?.hero ? [p.hero] : undefined,
    },
  };
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const p = getProject(params.id);
  if (!p) return <div className="p-6">Project not found.</div>;

  return (
    <>
      {/* your existing detail UI here */}
      <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(projectJsonLd(p))}
      </Script>
    </>
  );
}
```

## 4) Verify
- Visit `/sitemap.xml` after build
- Test a project page in Google Rich Results Test (for JSON-LD)
- Check page source for `<title>`, `<meta name="description">`, OpenGraph and Twitter tags.
