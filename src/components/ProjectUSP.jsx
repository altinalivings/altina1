"use client";

export default function ProjectUSP({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="rounded-xl bg-[#0b3556] p-4 sm:p-5 text-white">
      <div className="rounded-lg border-2 border-dashed border-white/60 p-4 sm:p-5">
        <ul className="list-disc space-y-1 pl-5 marker:text-white">
          {items.map((t, i) => (
            <li key={i} className="text-sm sm:text-base">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
