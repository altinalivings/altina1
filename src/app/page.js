import Hero from "@/components/Hero";

export const metadata = {
  title: "Premium Real Estate Channel Partner",
  description:
    "Discover curated projects from leading developers. Get expert guidance and exclusive benefits with ALTINA™ Livings.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Section 1: Featured Projects */}
      <section className="section">
        <h2 className="h2">Featured Projects</h2>
        <p className="muted">Handpicked developments with strong ROI, location advantages, and top amenities.</p>
        {/* Replace placeholder with your ProjectCards grid */}
        <div className="cards-grid">
          <div className="card">Project A</div>
          <div className="card">Project B</div>
          <div className="card">Project C</div>
        </div>
      </section>

      {/* Section 2: Why ALTINA */}
      <section className="section">
        <h2 className="h2">Why ALTINA™ Livings</h2>
        <ul className="bullets">
          <li>Zero brokerage for buyers</li>
          <li>Trusted partner network with leading developers</li>
          <li>End-to-end assistance: site visits, loans, documentation</li>
        </ul>
      </section>

      {/* Section 3: Get Assisted */}
      <section className="section">
        <h2 className="h2">Get Assisted</h2>
        <p className="muted">Speak to our advisors for recommendations tailored to your goals.</p>
        <a href="#request-callback" className="btn btn-primary">Request a Callback</a>
      </section>
    </>
  );
}
