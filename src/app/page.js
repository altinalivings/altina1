import projects from "../data/projects.json";
import PropertyList from "../components/PropertyList";
import Link from "next/link";
import Testimonials from "../components/Testimonials";
import PropertyForm from "../components/PropertyForm";


export default function Page() {
  return (
    <main>
      {/* Hero */}
      <section className="hero" style={{ marginBottom: 24 }}>
        <div className="hero-content">
          <h1 style={{ fontSize: 40 }}>Find premium homes with Altina Livings</h1>
          <p style={{ color: "#9aa4b2" }}>
            Channel partner services and curated listings — we negotiate the best deals for buyers.
          </p>
          <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
            <Link href="/listings" className="btn">View Listings</Link>
            <a className="cta-secondary" href="#enquire">Request a Call</a>
          </div>
        </div>
        <div className="hero-visual">
          <img
            className="lazy"
            data-src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            alt="Luxury living"
            width="420"
            height="300"
          />
        </div>
      </section>

      {/* Featured */}
      <section id="featured" style={{ marginTop: 12 }}>
        <h2>Featured for you</h2>
        <p style={{ color: "#9aa4b2" }}>A snapshot of selected premium properties</p>
        <PropertyList projects={projects.filter((p) => p.featured).slice(0, 3)} />
        <div style={{ marginTop: 16 }}>
          <a className="cta-secondary" href="/listings">See all listings</a>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" style={{ marginTop: 28 }}>
        <h2>Enquire about a property</h2>
        <PropertyForm />
      </section>

      {/* Testimonials */}
      <Testimonials />
    </main>
  );
}
