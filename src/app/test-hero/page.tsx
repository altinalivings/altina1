// /src/app/test-hero/page.tsx
import PageHero from "@/components/PageHero";

export default function TestHeroPage() {
  return (
    <main>
      <PageHero
        title="DLF One Midtown"
        subtitle="Moti Nagar, New Delhi"
        projectId="dlf-one-midtown"   // auto-loads /projects/dlf-one-midtown/hero.webp|jpg
        // image="/projects/dlf-one-midtown/hero.jpg" // optional explicit override
      />
      <section className="max-w-5xl mx-auto p-6">
        <p>Below the hero… add anything you like for visual checks.</p>
      </section>
    </main>
  );
}
