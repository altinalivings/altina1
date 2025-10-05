
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import projects from "@/data/projects.json";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Project = typeof projects[number];

function getProjectByParam(param: string): Project | undefined {
  const hit = projects.find(p => p.id === param || p.slug === param);
  return hit;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = getProjectByParam(params.id);
  if (!p) return { title: "Project not found" };

  const title = p.seo?.title ?? `${p.name} | ${p.configuration}`;
  const description = p.seo?.description ?? `${p.name} by ${p.brand || p.developer} in ${p.micro_market || p.location || p.city}.`;
  const canonical = p.seo?.canonical ?? `https://www.altinalivings.com/projects/${p.slug || p.id}`;

  const ogImg = p.hero || "/og-default.jpg";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "ALTINA™ Livings",
      title,
      description,
      images: [{ url: ogImg, width: 1200, height: 630, alt: p.heroAlt || p.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImg],
    },
  };
}

function JsonLd({ p }: { p: Project }) {
  const canonical = p.seo?.canonical ?? `https://www.altinalivings.com/projects/${p.slug || p.id}`;
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.name} – ${p.configuration || "Residences"}`,
    brand: { "@type": "Brand", "name": p.brand || p.developer || "DLF" },
    category: "RealEstate",
    description: p.about || `${p.name} in ${p.location || p.micro_market || p.city}.`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (p.price || "").replace(/[^0-9]/g, "") || undefined,
      availability: "https://schema.org/InStock",
      url: canonical
    }
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (p.faq || []).map((qa: any) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: { "@type": "Answer", text: qa.a }
    }))
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Projects", item: "https://www.altinalivings.com/projects" },
      { "@type": "ListItem", position: 2, name: p.name, item: canonical }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }} />
      {Array.isArray(p.faq) && p.faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const p = getProjectByParam(params.id);
  if (!p) return notFound();

  const other = projects.filter(x => x.id !== p.id).slice(0, 2);
  const gallery = Array.isArray(p.gallery) ? p.gallery : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="opacity-70">Loading…</div>}>
        <JsonLd p={p as any} />
      </Suspense>

      <header className="mb-6">
        <h1 className="text-2xl md:text-4xl font-semibold">{p.name}</h1>
        <p className="text-sm md:text-base opacity-80">
          {p.configuration} • {p.micro_market || p.location || p.city} {p.rera ? `• RERA: ${p.rera}` : ""}
        </p>
      </header>

      {/* Hero */}
      {p.hero && (
        <div className="mb-6 relative w-full aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-white/10">
          <Image
            src={p.hero}
            alt={p.heroAlt || `${p.name} hero image`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
      )}

      {/* Key info */}
      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="opacity-90">{p.about}</p>
          <ul className="list-disc pl-5 opacity-90">
            {p.price && <li><strong>Price:</strong> {p.price}</li>}
            {p.status && <li><strong>Status:</strong> {p.status}</li>}
            {p.possession && <li><strong>Possession:</strong> {p.possession}</li>}
            {p.towers && <li><strong>Towers:</strong> {p.towers}</li>}
            {p.floors && <li><strong>Floors:</strong> {p.floors}</li>}
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            {p.brochure && <a href={p.brochure} target="_blank" rel="noopener" className="px-4 py-2 rounded-lg bg-[#C9A23F] text-black font-medium" data-evt="brochure_download">Download Brochure</a>}
            <a href="#lead" className="px-4 py-2 rounded-lg border border-white/20" data-evt="book_site_visit">Book Site Visit</a>
            <a href={`https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%27m%20interested%20in%20${encodeURIComponent(p.name)}`} target="_blank" rel="noopener" className="px-4 py-2 rounded-lg border border-[#25D366] text-[#25D366]" data-evt="whatsapp_click">WhatsApp</a>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Highlights</h2>
          <ul className="list-disc pl-5 opacity-90">
            {(p.highlights || p.usp || []).slice(0, 6).map((h: any, i: number) => <li key={i}>{h}</li>)}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
  <section className="mb-10">

          <h2 className="text-xl font-semibold mb-3">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((src: string, i: number) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg ring-1 ring-white/10">
                <Image
                  src={src}
                  alt={p.galleryAlt?.[i] || `${p.name} image ${i+1}`}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, 400px"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Internal links */}
      {other.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Explore more projects</h2>
          <div className="flex flex-wrap gap-3">
            {other.map((o) => (
              <Link key={o.id} href={`/projects/${o.slug || o.id}`} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5">
                {o.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lead section anchor (for CTA scroll) */}
      <div id="lead" className="pt-8"></div>

      {/* Lightweight analytics event binding */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function(){
            function on(evt, sel, fn){
              document.addEventListener(evt, function(e){
                var el = e.target.closest(sel);
                if(el) fn(e, el);
              });
            }
            function fire(name, params){
              try{ window.gtag && window.gtag('event', name, params||{}); }catch(e){}
              try{ window.fbq && window.fbq('trackCustom', name, params||{}); }catch(e){}
              try{ window.lintrk && window.lintrk('track', { conversion_id: name }); }catch(e){}
            }
            on('click','[data-evt="brochure_download"]', function(){ fire('brochure_download', {project:'${p?.name || ""}'}); });
            on('click','[data-evt="book_site_visit"]', function(){ fire('generate_lead', {project:'${p?.name || ""}', source:'book_site_visit'}); });
            on('click','[data-evt="whatsapp_click"]', function(){ fire('whatsapp_click', {project:'${p?.name || ""}'}); });
          })();
        `
      }} />
    </div>
  );
}
