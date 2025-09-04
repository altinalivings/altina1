// src/app/page.js
import projects from "../data/projects.json";
import PropertyCard from "../components/PropertyCard";

<section id="featured" style={{ marginTop: 12 }}>
  <h2>Featured for you</h2>
  <p style={{ color: "#9aa4b2" }}>A snapshot of selected premium properties</p>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
      gap: 16,
      marginTop: 16,
    }}
  >
    {projects
      .filter((p) => p.featured)
      .slice(0, 3)
      .map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
  </div>
  <div style={{ marginTop: 16 }}>
    <a className="cta-secondary" href="/listings">
      See all listings
    </a>
  </div>
</section>
