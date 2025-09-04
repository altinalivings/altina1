export default function Hero() {
  return (
    <section className="relative h-[58vh] min-h-[420px] w-full">
      <img
        src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop"
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative container mx-auto h-full px-4 flex items-center">
        <div className="text-white">
          <h1 className="text-4xl md:text-6xl font-bold">Altina Livings</h1>
          <p className="mt-3 text-lg max-w-2xl">
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
