import projects from "../../data/projects.json";
import PropertyList from "../../components/PropertyList";

export default function ListingsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Featured Properties</h1>
      <p style={{ color: "#9aa4b2" }}>
        Hand-picked premium listings. Work with us as a channel partner to get exclusive deals.
      </p>

      <PropertyList projects={projects} />
    </main>
  );
}
