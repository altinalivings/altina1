import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({ p }: { p: any }) {
  // Try multiple sources, fall back to placeholder
  const src =
    p.image ||
    p.hero ||
    `/projects/${p.id}/hero.jpg` ||
    "/placeholder/1200x800.jpg";

  return (
    <Link
      href={`/projects/${p.id}`}
      className="group block card-gold overflow-hidden hover:shadow-altina transition-shadow"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={src}
          alt={p.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {/* light sweep on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(85deg, transparent 40%, rgba(255,255,255,.08) 50%, transparent 60%)",
          }}
        />
      </div>
      <div className="p-4">
        <div className="h-serif text-lg font-semibold">{p.name}</div>
        <div className="text-white/70 text-base">
          {p.developer} • {p.location}
        </div>
        {p.price && <div className="mt-1 gold-sheen">From {p.price}</div>}
      </div>
    </Link>
  );
}
