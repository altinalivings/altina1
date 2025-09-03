import Image from "next/image";

export default function Hero({ title, subtitle, image }) {
  // ✅ Fallback image if no image prop is passed
  const fallbackImage =
    "/images/projects-banner.jpg"; // put one branded banner in public/images

  return (
    <div className="relative w-full aspect-[16/6] bg-gray-200">
      <Image
        src={image || fallbackImage}
        alt={title}
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-200 mt-3 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
