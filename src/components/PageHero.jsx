"use client";
import Image from "next/image";

export default function PageHero({ title, subtitle, image }) {
  return (
    <section className="relative">
      {/* gradient top bar (fixed) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-500 to-teal-600 opacity-90" />

      <div className="relative h-[42vh] w-full overflow-hidden rounded-b-2xl sm:h-[56vh]">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white sm:left-10 sm:right-10">
          <h1 className="text-2xl font-bold sm:text-4xl">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm opacity-90 sm:text-base">{subtitle}</p>
          )}
        </div>
      </div>
    </section>
  );
}
