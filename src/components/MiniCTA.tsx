// src/components/MiniCTA.tsx
export default function MiniCTA() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="golden-frame glow modal-surface p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold">Book a site visit</h3>
          <p className="text-sm text-neutral-300">Tell us your preferences—we’ll line up the right projects and handle everything end‑to‑end.</p>
        </div>
        <div className="flex gap-3">
          <a href="https://wa.me/919891234195" target="_blank" className="golden-btn px-5 py-2">WhatsApp Us</a>
          <a href="#lead" className="rounded-xl border border-white/15 px-5 py-2 hover:border-white/30 transition">Request Call</a>
        </div>
      </div>
    </section>
  );
}
