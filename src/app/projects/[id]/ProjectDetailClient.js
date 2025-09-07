"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Amenities from "@/components/Amenities";
import SiteVisitPopup from "@/components/SiteVisitPopup";
import { submitLead } from "@/lib/submitLead";

/* ================= HERO (premium ribbon + wash) ================= */
function Hero({ project }) {
  const title = project?.title || project?.name || "";
  const bannerText =
    project?.badgeText || project?.banner || "BOOKING OPEN · LIMITED TIME ONLY";
  const usp =
    Array.isArray(project?.usp) && project.usp.length
      ? project.usp
      : ["Low-density masterplan", "Expansive greens", "Premium clubhouse"];

  const [i, setI] = useState(0);
  useEffect(() => {
    if (!usp.length) return;
    const t = setInterval(() => setI((n) => (n + 1) % usp.length), 3000);
    return () => clearInterval(t);
  }, [usp.length]);

  return (
    <section className="relative h-[380px] md:h-[500px]">
      <Image src={project.image} alt={title} fill priority className="object-cover" />

      {/* Vignette + gold→blue wash */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(1200px 600px at 30% 70%, rgba(0,0,0,.28) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(90deg, var(--brand-gold,#c5a250) 0%, rgba(245,186,77,.65) 40%, rgba(12,74,110,.85) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Ribbon */}
      <div className="absolute left-1/2 top-8 z-[3] -translate-x-1/2">
        <div className="relative overflow-hidden rounded-full px-8 py-2 text-[15px] font-bold tracking-wide text-white shadow-xl ring-1 ring-white/20">
          <span className="relative z-[2]">{bannerText}</span>
          <span className="pointer-events-none absolute inset-0 z-[1] animate-[shine_1.75s_linear_infinite]" />
        </div>
      </div>

      {/* Title + location */}
      <div className="altina-container relative z-[3] flex h-full items-end pb-24 md:pb-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semi-bold leading-tight text-white sm:text-5xl">
            {title}
          </h1>
          {project.location && (
            <p className="mt-1.5 text-white/90">{project.location}</p>
          )}
        </div>
      </div>
	  
      {/* USPs dock (rotate; reveal on hover) */}
      {usp.length > 0 && (
        <div className="absolute inset-x-0 bottom-5 z-[4]">
          <div className="altina-container">
            <div
              className="group relative overflow-hidden rounded-4xl border p-4 backdrop-blur-md md:p-3"
              style={{
                background: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,255,255,0.45)",
                boxShadow: "0 10px 30px rgba(0,0,0,.18)",
              }}
            >
              <div
                className="rounded-xl border-2 border-dashed p-3 text-white md:p-4"
                style={{ borderColor: "rgba(255,255,255,0.5)" }}
              >
                <div className="flex items-center justify-center text-[13px] transition-opacity duration-200 group-hover:opacity-0 md:text-[22px]">
                  <span
                    key={i}
                    className="animate-[fadeSlide_3s_ease-in-out_forwards] whitespace-nowrap"
                  >
                    {usp[i]}
                  </span>
                </div>

                <div className="pointer-events-none absolute inset-0 z-[5] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 rounded-2xl bg-black/20 backdrop-blur-sm" />
                  <ul className="absolute inset-0 m-0 flex list-disc flex-wrap items-center justify-center gap-x-8 gap-y-2 p-4 text-[13px] md:text-[14px]">
                    {usp.map((u, idx) => (
                      <li key={idx} className="text-white/95 marker:text-white/60">
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* scoped keyframes */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-120%);
            background: linear-gradient(
              110deg,
              transparent 0%,
              rgba(255, 255, 255, 0.55) 50%,
              transparent 100%
            );
          }
          100% {
            transform: translateX(120%);
            background: linear-gradient(
              110deg,
              transparent 0%,
              rgba(255, 255, 255, 0.55) 50%,
              transparent 100%
            );
          }
        }
        @keyframes fadeSlide {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          15% {
            opacity: 1;
            transform: translateY(0);
          }
          85% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-6px);
          }
        }
      `}</style>
    </section>
  );
}

/* ================= FLOATING RIGHT-CENTER CTA PANEL (glass, embossed) ================= */
function FloatingCTA({ project, onVisit }) {
  return (
    // Hidden on small screens; visible from md+
    <div
      className="hidden md:block fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40"
      aria-label="Quick actions"
    >
      <div
        className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 px-3 py-4 flex flex-col gap-3
                   shadow-[inset_1px_1px_3px_rgba(255,255,255,0.4),inset_-1px_-1px_3px_rgba(0,0,0,0.25),0_4px_20px_rgba(0,0,0,0.3)]"
      >
        {/* Organize a Visit (Teal) */}
        <button
          onClick={onVisit}
          className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow
                     bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
          aria-haspopup="dialog"
        >
          Organize a Visit
        </button>

        {/* Call to Discuss (Gold) */}
        {project?.phone ? (
          <a
            href={`tel:${project.phone}`}
            className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow
                       bg-[var(--brand-gold,#c5a250)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-300 text-center"
          >
            Call to Discuss
          </a>
        ) : (
          <div className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-400 bg-gray-100 text-center">
            Call to Discuss
          </div>
        )}

        {/* Chat on WhatsApp (Green) */}
        {project?.whatsapp ? (
          <a
            href={`https://wa.me/${project.whatsapp}`}
            target="_blank"
            className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow
                       bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 text-center"
          >
            Chat on WhatsApp
          </a>
        ) : (
          <div className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-400 bg-gray-100 text-center">
            Chat on WhatsApp
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function ProjectDetailClient({ project }) {
  const title = project?.title || project?.name || "";
  const priceCr =
    project?.priceNumeric != null
      ? (Number(project.priceNumeric) / 100).toFixed(1)
      : null;

  // Site Visit popup
  const [visitOpen, setVisitOpen] = useState(false);

  // Lightbox
  const gallery = Array.isArray(project?.gallery) ? project.gallery : [];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  useEffect(() => {
    if (!lightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [lightboxOpen]);

  // Enquiry form
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await submitLead({ ...form, project: title, need: "general_enquiry" });
      if (res?.status === "success" || res?.ok || res?.body?.ok) {
        setUnlocked(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // Floorplans
  const floorplans = Array.isArray(project?.floorplans) ? project.floorplans : [];
  const mainPlan = floorplans[0];

  return (
    <div className="relative">
      {/* HERO */}
      <Hero project={project} />

      {/* BODY */}
      <div className="altina-container grid gap-10 py-10 md:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-10 md:col-span-2">
          {/* Snapshot */}
          <Block title="Project Snapshot">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat item="Typology" value={project.typology || "—"} />
              <Stat item="RERA" value={project.reraId || "—"} />
              <Stat item="Location" value={project.location?.split(",")[0] || "—"} />
              <Stat
                item="Starting Price"
                value={
                  priceCr ? (
                    <>
                      ₹ {priceCr} Cr <span className="text-xs opacity-70">Onwards</span>
                    </>
                  ) : (
                    project.price || "Price on request"
                  )
                }
              />
            </div>
          </Block>

          {/* Overview */}
          {project.description && (
            <Block title="Overview">
              <p className="leading-relaxed text-gray-700">{project.description}</p>
            </Block>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <Block title="Gallery">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    className="group relative overflow-hidden rounded-xl"
                    onClick={() => {
                      setLightboxIndex(i);
                      setLightboxOpen(true);
                    }}
                  >
                    <Image
                      src={src}
                      alt={`${title} image ${i + 1}`}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </Block>
          )}

          {/* Lightbox (covers everything including floating CTA) */}
          {lightboxOpen && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
              onClick={() => setLightboxOpen(false)}
            >
              <button
                className="absolute right-4 top-4 rounded-md bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(false);
                }}
                aria-label="Close"
              >
                Close ✕
              </button>
              {gallery.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((n) => (n - 1 + gallery.length) % gallery.length);
                    }}
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((n) => (n + 1) % gallery.length);
                    }}
                    aria-label="Next"
                  >
                    ›
                  </button>
                </>
              )}
              <div className="relative aspect-[16/10] w-full max-w-5xl">
                <Image
                  src={gallery[lightboxIndex]}
                  alt={`${title} large image`}
                  fill
                  className="rounded-xl object-contain"
                />
              </div>
            </div>
          )}

          {/* Amenities */}
          {Array.isArray(project.amenities) && project.amenities.length > 0 && (
            <Block title="Amenities">
              <Amenities items={project.amenities} />
            </Block>
          )}

          {/* Floorplans */}
          {floorplans.length > 0 && (
            <Block title="Floor Plans">
              <div className="space-y-4">
                {mainPlan?.image ? (
                  !unlocked ? (
                    <div className="relative">
                      <Image
                        src={mainPlan.image}
                        alt={mainPlan.name || "Floor Plan"}
                        width={1200}
                        height={700}
                        className="rounded-xl opacity-30"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-teal-700"
                          onClick={() => setVisitOpen(true)}
                        >
                          Unlock via Site Visit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={mainPlan.image}
                      alt={mainPlan.name || "Floor Plan"}
                      width={1200}
                      height={700}
                      className="rounded-xl"
                    />
                  )
                ) : null}
              </div>
            </Block>
          )}

          {/* Brochure */}
          {project.brochure && (
            <Block title="Brochure">
              {!unlocked ? (
                <div className="rounded-xl border bg-gray-50 p-6 text-center">
                  <p className="mb-4 text-gray-700">
                    Please book a site visit or submit an enquiry to download the brochure.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <button
                      className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-teal-700"
                      onClick={() => setVisitOpen(true)}
                    >
                      Organize a Visit
                    </button>
                    <button className="btn-outline" onClick={() => setUnlocked(true)}>
                      I’ve submitted an enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <a href={project.brochure} target="_blank" className="btn-gold inline-block">
                  Download Brochure
                </a>
              )}
            </Block>
          )}
        </div>

        {/* RIGHT: embossed glass enquiry card */}
        <aside className="h-max bg-gray-200 md:sticky md:top-24 z-[10]">
          <div
            className="relative rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 p-6
                       shadow-[inset_1px_1px_3px_rgba(255,255,255,0.5),inset_-1px_-1px_3px_rgba(0,0,0,0.25),0_6px_30px_rgba(0,0,0,0.35)]"
          >
            <h3 className="text-xl font-semibold text-black/90">Enquire about {title}</h3>
            <p className="mt-1 text-sm text-black/80">
              RERA Verified • 100% Transparent Process
            </p>

            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                className="input bg-white/20 backdrop-blur-sm border border-Gold/30 text-black/90 placeholder:text-gray-400"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="input bg-white/20 backdrop-blur-sm border border-Gold/30 text-black/90 placeholder:text-gray-400"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="input bg-white/20 backdrop-blur-sm border border-Gold/30 text-black/90 placeholder:text-gray-400"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <textarea
                placeholder="Your Message"
                rows={3}
                className="input bg-white/20 backdrop-blur-sm border border-Gold/30 text-black/90 placeholder:text-gray-400"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button type="submit" className="btn-gold w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </button>
              <p className="mt-2 text-center text-xs text-gray-900">
                By submitting, you agree to our Privacy Policy.
              </p>
            </form>
          </div>
        </aside>
      </div>

      {/* FLOATING RIGHT-CENTER CTA (md+ only) */}
      <FloatingCTA project={project} onVisit={() => setVisitOpen(true)} />

      {/* POPUP */}
      <SiteVisitPopup
        open={visitOpen}
        onClose={() => setVisitOpen(false)}
        projectName={title}
        onBooked={() => {
          setUnlocked(true);
        }}
      />
    </div>
  );
}

/* ===== Helpers ===== */
function Block({ title, children }) {
  return (
    <section className="rounded-2xl border bg-gray-100  p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
      <div className="section-cap mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Stat({ item, value }) {
  return (
    <div className="rounded-lg border bg-white/20 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{item}</div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}
