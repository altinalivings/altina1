"use client";

import { useEffect, useRef } from "react";

export default function HeroBokeh() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    let raf, w, h;
    let dots = [];

    const resize = () => {
      w = c.width = c.offsetWidth * devicePixelRatio;
      h = c.height = c.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    const rand = (a, b) => a + Math.random() * (b - a);

    const init = () => {
      dots = Array.from({ length: 28 }).map(() => ({
        x: rand(0, c.offsetWidth),
        y: rand(0, c.offsetHeight),
        r: rand(30, 90),
        vx: rand(-0.2, 0.2),
        vy: rand(-0.15, 0.15),
        a: rand(0.06, 0.14),
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -d.r) d.x = c.offsetWidth + d.r;
        if (d.x > c.offsetWidth + d.r) d.x = -d.r;
        if (d.y < -d.r) d.y = c.offsetHeight + d.r;
        if (d.y > c.offsetHeight + d.r) d.y = -d.r;

        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
        grad.addColorStop(0, "rgba(197,162,80,0.22)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(step);
    };

    const onResize = () => { resize(); init(); };
    onResize();
    step();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[82vh] min-h-[560px] w-full">
        <img
          src="/images/hero-fallback.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25),rgba(0,0,0,0.6))]" />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-6">
        <div className="w-full text-center">
          <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] tracking-widest text-white ring-1 ring-white/30">
            CHANNEL PARTNER • DLF • M3M • SOBHA • GODREJ
          </p>
          <h1 className="mx-auto max-w-3xl font-serif text-5xl font-extrabold leading-tight text-white sm:text-6xl">
            Altina Livings
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            Premium homes & investment-grade assets in NCR
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a href="#projects" className="rounded-xl bg-white/90 px-5 py-2 text-sm font-medium text-gray-900 shadow hover:bg-white">
              Explore projects
            </a>
            <a href="#enquire" className="btn-gold text-sm">Get bespoke options</a>
          </div>
        </div>
      </div>
    </section>
  );
}
