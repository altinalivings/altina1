import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import FeaturedProjects from "@/components/FeaturedProjects";
import USPs from "@/components/USPs";
import Testimonials from "@/components/Testimonials";
import EnquirySection from "@/components/EnquirySection";

export default function Home() {
  return (
    <main>
      {/* HERO with glass enquiry */}
      <Hero />

      {/* Developer trust strip */}
      <section className="py-8 bg-white">
        <div className="altina-container">
          <TrustStrip />
        </div>
      </section>

      {/* Featured Projects (dark band) */}
      <section id="projects" className="section-dark py-12">
        <div className="altina-container text-white">
          <h2 className="h2">Featured Projects</h2>
          <p className="mt-1 text-sm text-gray-300">
            Curated launches from DLF, M3M, Sobha & Godrej.
          </p>
          <div className="mt-6">
            <FeaturedProjects />
          </div>
        </div>
      </section>

      {/* What we do / USPs */}
      <section className="py-12">
        <div className="altina-container">
          <h2 className="h2">What We Do</h2>
          <p className="mt-1 text-sm text-gray-600">
            Concierge advisory for primary sales & investments across NCR.
          </p>
          <div className="mt-6">
            <USPs />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-muted py-12">
        <div className="altina-container">
          <h2 className="h2">What Clients Say</h2>
          <p className="mt-1 text-sm text-gray-600">
            Investors and homebuyers on their experience with us.
          </p>
          <div className="mt-6">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* Enquire band */}
      <section id="enquire" className="py-12">
        <div className="altina-container">
          <div className="mb-6">
            <h2 className="h2">Enquire Now</h2>
            <p className="mt-1 text-sm text-gray-600">
              Share your preferences. We’ll send bespoke options and arrange site visits.
            </p>
          </div>
          <EnquirySection />
        </div>
      </section>
    </main>
  );
}
