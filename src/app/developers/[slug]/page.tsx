"use client";

import devs from "@/data/developers.json";
import allProjects from "@/data/projects.json";
import Link from "next/link";
import { useMemo, useState } from "react";
import FloatingCTAs from "@/components/FloatingCTAs";

type KV = [string, string];

type Dev = {
  slug: string;
  name: string;
  hero?: string;
  logo?: string;
  tagline?: string;
  about?: string;
  stats?: KV[];
  usps?: string[];
  awards?: string[];
  timeline?: KV[];
  offices?: KV[];
  map?: { embed?: string; title?: string };
  pressLogos?: string[];
  video?: { provider?: "youtube" | "loom" | "vimeo"; id?: string; url?: string };
  gallery?: string[];
  projects?: string[];
};

const FALLBACK = "/placeholder/2200x1200.jpg";

function SmartHero({
  slug,
  src,
  alt,
}: {
  slug: string;
  src?: string;
  alt: string;
}) {
  const candidates = useMemo(() => {
    const out: string[] = [];
    if (src) {
      out.push(src);
      if (src.startsWith("/")) out.push(src.slice(1));
    }
    const base = `/developers/${slug}/hero`;
    [".jpg", ".jpeg", ".png", ".webp"].forEach((ext) => {
      out.push(`${base}${ext}`);
      out.push(`${base}${ext}`.slice(1));
    });
    return out.length ? out : [FALLBACK];
  }, [slug, src]);

  const [idx, setIdx] = useState(0);
  const curr = candidates[Math.min(idx, candidates.length - 1)];

  return (
    <img
      src={curr}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => {
        const next = idx + 1;
        if (next < candidates.length) {
          console.warn("[Dev Hero] 404:", curr, "→", candidates[next]);
          setIdx(next);
        } else if (curr !== FALLBACK) {
          setIdx(candidates.length - 1);
        }
      }}
    />
  );
}

export default function DeveloperDetailPage({ params }: { params: { slug: string } }) {
  const d = (devs as Dev[]).find((x) => x.slug === params.slug);

  if (!d) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Developer not found</h1>
        <p className="mt-2 text-neutral-400">Please check the URL and try again.</p>
      </main>
    );
  }

  const projects = (allProjects as any[]).filter((p) => d.projects?.includes(p.id));

  return (
    <>
      {/* HERO */}
      <section className="relative h-[44vh] min-h-[360px] overflow-hidden">
        <SmartHero slug={d.slug} src={d.hero} alt={d.name} />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-10">
          <div className="golden-frame modal-surface rounded-2xl p-5 flex items-center gap-3">
            {d.logo && (
              <img src={d.logo} alt={`${d.name} logo`} className="h-8 w-auto object-contain" />
            )}
            <div>
              <h1 className="text-3xl font-semibold">{d.name}</h1>
              {d.tagline && <p className="mt-1 text-neutral-300">{d.tagline}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {d.about && (
          <Section title={`About ${d.name}`}>
            <p className="text-neutral-300 leading-relaxed">{d.about}</p>
          </Section>
        )}

        {d.usps?.length ? (
          <Section title="Why Choose This Developer">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {d.usps.map((u) => (
                <li key={u} className="rounded-xl border border-white/10 p-3">
                  <div className="text-neutral-200">{u}</div>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {d.stats?.length ? (
          <Section title="Key Facts">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {d.stats.map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/10 p-3">
                  <div className="text-sm text-neutral-400">{k}</div>
                  <div className="text-lg">{v}</div>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {projects.length ? (
          <Section title={`Projects by ${d.name}`}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 hover:border-amber-400/40 transition"
                >
                  <div className="relative h-48">
                    <img
                      src={p.hero || "/placeholder/1200x800.jpg"}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className="font-medium">{p.name}</div>
                    {p.location && <div className="text-sm text-neutral-400">{p.location}</div>}
                    {p.price && <div className="mt-1 text-sm text-neutral-300">{p.price}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        ) : null}
      </main>

      {/* Only one CTA stack now */}
      <FloatingCTAs projectId={`developer-${d.slug}`} projectName={d.name} />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="modal-surface golden-frame p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="golden-divider my-3" />
      {children}
    </section>
  );
}