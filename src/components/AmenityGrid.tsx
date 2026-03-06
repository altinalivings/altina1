"use client";
import { useState } from "react";

type Amenity = { name: string; icon?: string };

function AmenityIcon({ name, keyName }: { name: string; keyName?: string }) {
  const [src, setSrc] = useState<string | null>(keyName ? `/icons/${keyName}.svg` : null);
  if (!keyName) return <span className="text-xl">•</span>;

  return (
    <img
      src={src ?? `/icons/${keyName}.png`}
      alt={name}
      width={28}
      height={28}
      className="w-7 h-7 object-contain"
      decoding="async"
      loading="lazy"
      onError={() => {
        if (src && src.endsWith(".svg")) setSrc(`/icons/${keyName}.png`);
        else setSrc(null);
      }}
    />
  );
}

export default function AmenityGrid({ items }: { items: Amenity[] }) {
  if (!items?.length) return null;
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((a) => (
        <div key={a.name} className="flex items-center gap-3 rounded-xl border border-white/10 p-3">
          <AmenityIcon name={a.name} keyName={a.icon} />
          <span>{a.name}</span>
        </div>
      ))}
    </div>
  );
}
