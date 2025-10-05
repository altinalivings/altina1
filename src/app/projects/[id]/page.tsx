'use client';

import Image from 'next/image';
import Script from 'next/script';
import projects from '@/data/projects.json';

type FAQ = { q: string; a: string };
type Video = { title: string; url: string };

type Project = {
  id: string;
  slug: string;
  name: string;
  developer?: string;
  brand?: string;
  rating?: number;
  location?: string;
  city?: string;
  state?: string;
  sector?: string;
  micro_market?: string;
  rera?: string;
  status?: string;
  construction_status?: string;
  possession?: string;
  launch?: string;
  price?: string;
  configuration?: string;
  typologies?: string[];
  sizes?: string;
  land_area?: string;
  towers?: number;
  floors?: string;
  total_units?: string;
  bank_approvals?: string[];
  usp?: string[];
  highlights?: string[];
  amenities?: string[];
  specs?: Record<string, string>;
  about?: string;
  aboutDeveloper?: string;
  brochure?: string;
  hero?: string;
  gallery?: string[];
  videoGallery?: Video[];
  virtualTourUrl?: string;
  map?: { embed?: string; lat?: number; lng?: number };
  nearby?: {
    schools?: string[];
    hospitals?: string[];
    malls?: string[];
    connectivity?: { label: string; time: string }[];
  };
  legal?: { disclaimer?: string };
  faqs?: FAQ[];
  seo?: { title?: string; description?: string; canonical?: string };
  featured?: boolean;
  featured_order?: number;
};

function ytToEmbed(url: string) {
  try {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('watch?v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const list = projects as Project[];
  const p =
    list.find((x) => x.id === params.id) ||
    list.find((x) => x.slug === params.id);

  if (!p) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <p className="opacity-70 mt-2">We couldn’t find this listing.</p>
      </div>
    );
  }

  const faqJsonLd =
    p.faqs && p.faqs.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: p.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        }
      : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* JSON-LD for FAQ */}
      {faqJsonLd ? (
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      {/* HERO / OVERVIEW */}
      <section className="grid gap-6 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{p.name}</h1>
          {p.developer && (
            <p className="mt-1 text-neutral-400">by {p.developer}</p>
          )}
          {p.location && (
            <p className="mt-2 text-neutral-300">{p.location}</p>
          )}
          {p.about && (
            <p className="mt-4 text-neutral-300 leading-relaxed">{p.about}</p>
          )}

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-3">
            {p.brochure && (
              <a
                href={p.brochure}
                className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95"
                onClick={(e) => {
                  try {
                    window.dispatchEvent(
                      new CustomEvent('lead:open', {
                        detail: {
                          mode: 'brochure',
                          projectId: p.id,
                          projectName: p.name,
                        },
                      })
                    );
                  } catch {}
                }}
              >
                Download Brochure
              </a>
            )}
            <button
              className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95"
              onClick={() => {
                try {
                  window.dispatchEvent(
                    new CustomEvent('lead:open', {
                      detail: {
                        mode: 'enquire',
                        projectId: p.id,
                        projectName: p.name,
                      },
                    })
                  );
                } catch {}
              }}
            >
              Request Call
            </button>
          </div>

          {/* Key info line */}
          <div className="mt-4 text-sm text-neutral-300 space-y-1">
            {p.price && <div><span className="text-neutral-400">Price:</span> {p.price}</div>}
            {p.possession && <div><span className="text-neutral-400">Possession:</span> {p.possession}</div>}
            {p.configuration && <div><span className="text-neutral-400">Configuration:</span> {p.configuration}</div>}
            {p.rera && <div><span className="text-neutral-400">RERA:</span> {p.rera}</div>}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0B0B0C]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.hero || '/placeholder.jpg'}
            alt={`${p.name} hero`}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* HIGHLIGHTS */}
      {p.highlights && p.highlights.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
          <ul className="grid md:grid-cols-2 gap-3 text-neutral-300">
            {p.highlights.map((h, i) => (
              <li key={i} className="border border-white/10 rounded-xl p-4 bg-[#0B0B0C]">
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* AMENITIES */}
      {p.amenities && p.amenities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {p.amenities.map((a, i) => (
              <div key={i} className="border border-white/10 rounded-xl p-3 bg-[#0B0B0C] text-neutral-300">
                {a}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {p.gallery && p.gallery.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {p.gallery.map((g, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g} alt={`${p.name} gallery ${i + 1}`} className="w-full h-56 object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LOCATION MAP */}
      {p.map?.embed && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Location</h2>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0B0B0C]">
            <iframe
              src={p.map.embed}
              title={`${p.name} location map`}
              className="w-full h-[360px]"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* VIRTUAL TOUR / VIDEO GALLERY */}
      {(p.videoGallery && p.videoGallery.length > 0) || p.virtualTourUrl ? (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Virtual Tour</h2>
          <div className="grid gap-6">
            {p.virtualTourUrl && (
              <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0B0B0C] aspect-video">
                <iframe
                  src={ytToEmbed(p.virtualTourUrl)}
                  title={`${p.name} virtual tour`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            {p.videoGallery?.map((v, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-[#0B0B0C] aspect-video">
                <iframe
                  src={ytToEmbed(v.url)}
                  title={v.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* FAQ — appears AFTER Virtual Tour and BEFORE About Developer */}
      {p.faqs && p.faqs.length > 0 && (
        <section className="mt-12 border-t border-white/10 pt-10">
          <h2 className="text-2xl font-semibold mb-6 text-[#C5A657]">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {p.faqs.map((f, idx) => (
              <details key={idx} className="group border border-white/10 rounded-xl p-5 bg-[#0B0B0C]">
                <summary className="cursor-pointer list-none flex justify-between items-center">
                  <span className="text-lg font-medium text-white">{f.q}</span>
                  <span className="ml-4 transition-transform group-open:rotate-180 text-white">▼</span>
                </summary>
                <div className="mt-3 text-neutral-400">{f.a}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT DEVELOPER */}
      {p.aboutDeveloper && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">About the Developer</h2>
          <p className="text-neutral-300 leading-relaxed">{p.aboutDeveloper}</p>
        </section>
      )}

      {/* LEGAL DISCLAIMER */}
      {p.legal?.disclaimer && (
        <section className="mt-12 text-xs text-neutral-400 border-t border-white/10 pt-6">
          {p.legal.disclaimer}
        </section>
      )}
    </div>
  );
}
