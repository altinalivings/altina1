// src/app/page.js
import PropertyForm from "../components/PropertyForm";

export default function Page() {
  return (
    <main>
      <section style={{ padding: 24 }}>
        <h1 style={{ marginBottom: 12 }}>Welcome to Altina Livings</h1>
        <p style={{ marginBottom: 18 }}>
          Luxury living, reimagined — enquire for premium spaces and bespoke services.
        </p>
        <PropertyForm />
      </section>
    </main>
  );
}
