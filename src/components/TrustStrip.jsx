"use client";
import Image from "next/image";

export default function TrustStrip() {
  const logos = [
    { src: "/images/logos/DLF.png", alt: "DLF" },
    { src: "/images/logos/M3M.png", alt: "M3M" },
    { src: "/images/logos/Sobha.png", alt: "Sobha" },
    { src: "/images/logos/Godrej.png", alt: "Godrej" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
      {logos.map((l) => (
        <div key={l.alt} className="flex items-center justify-center opacity-80">
          <Image src={l.src} alt={`${l.alt} logo`} width={140} height={60} />
        </div>
      ))}
    </div>
  );
}
