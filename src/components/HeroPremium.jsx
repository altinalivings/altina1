"use client";
import { useEffect, useRef } from "react";

export default function Hero({ onOpenVault }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.playsInline = true;

    try {
      v.playbackRate = 0.6; // slow motion
    } catch {}

    v.play().catch(() => {});
  }, []);

  return (
    <section className="relative mt-0">
      <div className="relative h-[78vh] min-h-[300] w-full overflow-hidden">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/hero.jpg"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(1.18) contrast(1.06) saturate(1.08)" }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.15),_rgba(0,0,0,0.45))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.42))]" />
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(135deg, rgba(197,162,80,0.16), rgba(224,192,112,0.06))",
          }}
        />

        {/* Content */}
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="w-full text-center">
            <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] tracking-widest text-white ring-1 ring-white/30">
              CHANNEL PARTNER • DLF • M3M • SOBHA • GODREJ
            </p>
            <h1 className="mx-auto max-w-3xl font-serif text-5xl font-semibold leading-tight text-white sm:text-6xl">
              Altina Livings
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/90">
              Your premium channel partner for DLF, M3M, Sobha & Godrej
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a
                href="#projects"
                className="rounded-xl bg-white/90 px-5 py-2 text-sm font-medium text-gray-900 shadow hover:bg-white"
              >
                Explore projects
              </a>
              <a href="#enquire" className="btn-gold text-sm">
                Get bespoke options
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
