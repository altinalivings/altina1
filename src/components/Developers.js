import Image from "next/image";

const developers = [
  { name: "DLF", logo: "/images/logos/DLF.png" },
  { name: "M3M", logo: "/images/logos/M3M.png" },
  { name: "Sobha", logo: "/images/logos/Sobha.png" },
  { name: "Godrej", logo: "/images/logos/Godrej.png" },
];

export default function Developers() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Developers We Partner With
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {developers.map((dev) => (
            <div key={dev.name} className="flex justify-center">
              <Image
                src={dev.logo}
                alt={`${dev.name} Logo`}
                width={150}
                height={80}
                className="object-contain grayscale hover:grayscale-0 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
