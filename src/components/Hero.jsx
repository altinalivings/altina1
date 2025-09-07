"use client";
import HeroEnquiryCard from "@/components/HeroEnquiryCard";

export default function Hero() {
  return (
    <section className="relative mt-[70px] md:mt-[76px]">
      <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <img
          src="/images/hero/hero1.jpg" /* replace with your premium image */
          alt="Luxury homes by Altina"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
          {/* Left copy */}
          <div className="w-full md:w-1/2 text-white">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <span>📍</span><span>You are here</span>
            </div>
            <h1 className="h2 mt-2">Let’s Find Your Property</h1>
            <p className="mt-3 text-sm md:text-base text-gray-200 max-w-xl">
              Curated projects from DLF, Sobha, M3M & Godrej. Early access, transparent pricing,
              and end-to-end advisory for NCR.
            </p>
          </div>

          {/* Right overlay transparent enquiry card */}
          <div className="hidden md:flex w-1/2 justify-end">
            <HeroEnquiryCard />
          </div>
        </div>
      </div>
    </section>
  );
}
