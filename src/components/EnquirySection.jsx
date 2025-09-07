"use client";
import { useMemo } from "react";

export default function EnquirySection({ project }) {
  if (!project) return "";

  const waHref = useMemo(() => {
    if (!project.whatsapp) return "";
    const msg = `Hi, I'm interested in ${project.name}${
      project.location ? " at " + project.location : ""
    }. Please share details.`;
    return `https://wa.me/${project.whatsapp}?text=${encodeURIComponent(msg)}`;
  }, [project]);

  const callHref = project.phone ? `tel:${project.phone}` : "";

  return (
    <section className="rounded-2xl border bg-white shadow-lg ring-1 ring-black/5">
      {/* Top ribbon */}
      <div className="rounded-t-2xl bg-[#0b3556] px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white">
        Booking Open : Limited Time Only
      </div>

      <div className="space-y-4 p-5">
        {/* Title + location */}
        <div>
          <h3 className="text-xl font-semibold">{project.name}</h3>
          {project.location && (
            <p className="mt-1 text-sm text-gray-600">{project.location}</p>
          )}
        </div>

        {/* Stats row (optional) */}
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-3 text-sm">
          {project.units && (
            <>
              <div className="text-gray-500">Available Units</div>
              <div className="text-right font-medium">{project.units}</div>
            </>
          )}
          {project.configuration && (
            <>
              <div className="text-gray-500">Typology</div>
              <div className="text-right font-medium">
                {project.configuration}
              </div>
            </>
          )}
        </div>

        {/* Price */}
        {(project.priceNumeric != null || project.price) && (
          <div className="text-center">
            <div className="text-sm text-gray-600">Starting Price</div>
            <div className="mt-1 text-2xl font-bold">
              {project.price
                ? project.price
                : `₹ ${(Number(project.priceNumeric) / 100).toFixed(1)} Cr`}{" "}
              <span className="text-base font-semibold">Onwards</span>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="grid gap-2">
          {callHref && (
            <a
              href={callHref}
              className="inline-flex items-center justify-center rounded-lg bg-[#0b3556] px-4 py-2 font-semibold text-white hover:opacity-95"
            >
              Call {project.phone}
            </a>
          )}
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              WhatsApp
            </a>
          )}
          {!callHref && !waHref && (
            <span className="rounded-lg border px-4 py-2 text-center text-sm text-gray-600">
              Contact details not available
            </span>
          )}
        </div>

        {/* Trust line */}
        <div className="pt-1 text-center text-[11px] text-gray-500">
          RERA Verified • 100% Transparent Process
        </div>
      </div>
    </section>
  );
}
