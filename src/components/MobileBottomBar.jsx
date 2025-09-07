"use client";

export default function MobileBottomBar({ project }) {
  if (!project) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 block sm:hidden">
      <div className="flex gap-2 rounded-t-xl bg-white/95 p-3 shadow-[0_-6px_20px_rgba(0,0,0,.15)] ring-1 ring-black/5 backdrop-blur">
        {project.brochure && (
          <a
            href={project.brochure}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium"
          >
            Brochure
          </a>
        )}
        <a
          href={`https://wa.me/${project.whatsapp || ""}?text=${encodeURIComponent(
            `Hi, I'm interested in ${project.name}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg bg-black px-3 py-2 text-center text-sm font-semibold text-white"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
