/*
 * AboutSection component
 *
 * This section provides a brief overview of the business. It is inspired by
 * minimalist real estate landing pages and highlights Altina™ Livings’ core
 * values and services. The section uses the existing altina palette and
 * card-like styling to ensure consistency with the rest of the site. Feel free
 * to tailor the copy to reflect your own brand story or mission statement.
 */
export default function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
        <h2 className="text-2xl font-semibold">About Us</h2>
        <p className="mt-3 text-white/80">
          ALTINA™ Livings is a luxury real estate channel partner based in Gurugram. We
          specialise in bringing curated launches from premier developers like DLF,
          M3M, Sobha and Godrej to discerning buyers across Delhi NCR. Our mission is
          to match you with the perfect home while providing honest advice and
          white‑glove service at every step.
        </p>
        <ul className="mt-4 space-y-2 text-white/80 list-disc list-inside">
          <li>Curated projects &ndash; we handpick only the most compelling launches.</li>
          <li>Personalised guidance &ndash; our advisors listen first and recommend what fits.</li>
          <li>Priority access &ndash; early previews, site visits and allocation windows.</li>
        </ul>
      </div>
    </section>
  )
}
