export default function Hero() {
  return (
    <section className="relative h-[78vh] min-h-[520px] w-full">
      <img
        src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop"
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      <div className="relative container mx-auto h-full px-4 flex items-center">
        <div className="text-white drop-shadow">
          <h1 className="text-5xl md:text-7xl font-bold">Altina Livings</h1>
          <p className="mt-3 text-lg md:text-xl max-w-2xl">
            Your premium channel partner for DLF, M3M, Sobha & Godrej
          </p>
          <a href="/contact" className="inline-flex mt-6 px-5 py-3 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-dark)]">
            Request Callback
          </a>
        </div>
      </div>
    </section>
  );
}
