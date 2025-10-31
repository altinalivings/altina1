/*
 * CTASection component
 *
 * This call-to-action strip encourages visitors to get in touch. It is placed
 * near the bottom of the home page and uses the signature Altina gold gradient
 * with contrasting text. The button scrolls to the lead form anchored with
 * id="lead". Adjust the copy to suit your preferred tone.
 */
export default function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-[var(--g-gold)] text-[var(--cta-contrast)] px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-semibold">Ready to start?</h3>
          <p className="opacity-90">Speak to our advisors and discover your dream home.</p>
        </div>
        <a href="#lead" className="btn btn-emerald">Enquire Now</a>
      </div>
    </section>
  )
}