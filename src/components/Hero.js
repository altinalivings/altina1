export default function Hero() {
  return (
    <section
      className="relative h-[500px] flex items-center justify-center text-center text-white"
      style={{ backgroundImage: "url('/hero.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="bg-black/50 absolute inset-0" />
      <div className="relative z-10 max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Dream Home with ALTINA™
        </h1>
        <p className="text-lg mb-6">
          Premium projects, expert advice, and zero brokerage for buyers.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="#request-callback" className="btn-gold px-6 py-3 rounded-lg">Request Call Back</a>
          <a href="/projects" className="bg-white text-black px-6 py-3 rounded-lg">Explore Projects</a>
        </div>
      </div>
    </section>
  );
}
