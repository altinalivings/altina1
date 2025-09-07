"use client";

import { CheckCircle2, MapPin, Phone, MessageCircle } from "lucide-react";

/**
 * Premium project highlight block
 *
 * Props:
 *  - project: {
 *      name, location, priceNumeric, price, possession, status,
 *      reraId, reraSite, typology, units, usp (string[])
 *    }
 *  - banner?: string
 *  - phone?: string       // e.g. "+919876543210"
 *  - whatsapp?: string    // e.g. "919876543210" (numbers only)
 *  - enquireHref?: string // default "#enquire"
 */
export default function ProjectHighlight({
  project = {},
  banner = "BOOKING OPEN · LIMITED TIME ONLY",
  phone = "",
  whatsapp = "",
  enquireHref = "#enquire",
}) {
  const {
    name,
    location,
    priceNumeric,
    price,
    possession,
    status,
    reraId,
    typology,
    units,
    usp = [],
  } = project;

  // Format ₹ x.x Cr from priceNumeric (in lakhs)
  const priceCr =
    typeof priceNumeric === "number" && !Number.isNaN(priceNumeric)
      ? (Number(priceNumeric) / 100).toFixed(1)
      : null;

  const displayPrice = priceCr ? `₹ ${priceCr} Cr* Onwards` : price || "";

  // helpers
  const telHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined;
  const waHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D+/g, "")}?text=Hi%20Altina%2C%20I%27m%20interested%20in%20${encodeURIComponent(
        name || "this project"
      )}`
    : undefined;

  return (
    <section className="altina-container -mt-10">
      <div className="rounded-2xl border bg-white p-0 shadow-sm ring-1 ring-black/5 overflow-hidden">
        {/* Banner */}
       <div className="bg-gradient-to-r from-amber-500/95 via-amber-400/95 to-teal-600/95 px-4 py-2 text-center text-[11px] font-semibold tracking-wider text-white ring-1 ring-white/10">
          {banner}
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-5">
          {/* Left: Title + stats */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>

            {location && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-700">
                <MapPin size={16} className="text-teal-700" />
                {location}
              </p>
            )}

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {units && (
                <div className="rounded-lg border bg-gray-50 px-3 py-2 text-sm">
                  <div className="text-gray-500">Available Units</div>
                  <div className="font-semibold text-gray-900">{units}</div>
                </div>
              )}
              {typology && (
                <div className="rounded-lg border bg-gray-50 px-3 py-2 text-sm">
                  <div className="text-gray-500">Typology</div>
                  <div className="font-semibold text-gray-900">{typology}</div>
                </div>
              )}
              {status && (
                <div className="rounded-lg border bg-gray-50 px-3 py-2 text-sm">
                  <div className="text-gray-500">Status</div>
                  <div className="font-semibold text-gray-900">{status}</div>
                </div>
              )}
              {(possession || reraId) && (
                <div className="rounded-lg border bg-gray-50 px-3 py-2 text-sm">
                  <div className="text-gray-500">Details</div>
                  <div className="font-semibold text-gray-900">
                    {possession ? `Possession ${possession}` : ""}
                    {possession && reraId ? " • " : ""}
                    {reraId ? `RERA ${reraId}` : ""}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Middle: USPs */}
          {usp?.length > 0 && (
            <div className="md:col-span-2">
              <div className="rounded-xl bg-gradient-to-br from-teal-800 to-teal-700 p-4 text-white ring-1 ring-teal-600/40">
                <p className="text-sm font-semibold tracking-wide">
                  Highlights
                </p>
                <ul className="mt-2 space-y-1.5">
                  {usp.slice(0, 8).map((u) => (
                    <li key={u} className="flex items-start gap-2 text-[13px] leading-5">
                      <CheckCircle2 size={16} className="mt-0.5 flex-none text-amber-300" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Right: Price + CTAs */}
          <div className="md:col-span-1">
            {displayPrice && (
              <div className="rounded-xl border bg-gray-50 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Starting Price
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {displayPrice}
                </p>
              </div>
            )}

            <div className="mt-3 grid gap-2">
              <a
                href={enquireHref}
                className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600"
              >
                Enquire Now
              </a>

              {telHref && (
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-black"
                >
                  <Phone size={16} /> Call
                </a>
              )}

              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-teal-800"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
