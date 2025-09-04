
import projects from "../data/projects.json";
import PropertyList from "../components/PropertyList";
import PropertyForm from "../components/PropertyForm";
import Testimonials from "../components/Testimonials";
import Link from "next/link";

export default function Page() {
  const featured = projects.filter(p => p.featured).slice(0,3);
  return (
    <>
      <section className="hero-full" style={{backgroundImage:`url('${projects[0].image}')`}}>
        <div className="hero-overlay"></div>
        <div className="hero-inner">
          <h1>Altina Livings</h1>
          <p>Your premium channel partner for DLF, M3M, Mahagun & more. Find curated luxury spaces.</p>
          <div className="hero-ctas">
            <Link href="/listings"><a className="btn" style={{background:'#e9a826',color:'#081018'}}>View Listings</a></Link>
            <a href="#enquire" className="cta-secondary" style={{background:'#fff',padding:'10px 14px',borderRadius:8}}>Request a Call</a>
          </div>
        </div>
      </section>

      <section className="featured-row">
        <h2>Featured Projects</h2>
        <div className="card-grid">
          <PropertyList projects={featured} />
        </div>
        <div style={{marginTop:18}}>
          <Link href="/listings"><a className="btn" style={{background:'#0b5cff',color:'#fff'}}>View All Projects</a></Link>
        </div>
      </section>

      <section className="services">
        <div className="site-wrapper">
          <h3>What We Do</h3>
          <div className="grid">
            <div className="service">Property Consulting</div>
            <div className="service">Project Promotions</div>
            <div className="service">Channel Partnerships</div>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="inner">
          <div className="benefit"><strong>Trusted Partners</strong><div>Top developers</div></div>
          <div className="benefit"><strong>Verified Listings</strong><div>Curated properties</div></div>
          <div className="benefit"><strong>Dedicated Support</strong><div>From enquiry to handover</div></div>
          <div className="benefit"><strong>Transparent Pricing</strong><div>No hidden fees</div></div>
        </div>
      </section>

      <section className="partners">
        <div className="site-wrapper">
          <h3>Developers We Partner With</h3>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexWrap:'wrap',gap:20,marginTop:12}}>
            <img src="/images/logos/dlf.svg" alt="DLF" />
            <img src="/images/logos/m3m.svg" alt="M3M" />
            <img src="/images/logos/mahagun.svg" alt="Mahagun" />
            <img src="/images/logos/godrej.svg" alt="Godrej" />
          </div>
        </div>
      </section>

      <section id="enquire" style={{padding:'28px 0'}}>
        <div className="site-wrapper">
          <h2>Enquire about a property</h2>
          <PropertyForm />
        </div>
      </section>

      <Testimonials />

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <h4>Altina Livings</h4>
            <p>Premium channel partner for DLF, M3M, Mahagun & more.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul style={{listStyle:'none',padding:0}}>
              <li><a href="/listings">Listings</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>hello@altinalivings.com</p>
            <p>+91-9876543210</p>
          </div>
        </div>
        <div className="footer-bottom">© Altina Livings • All rights reserved</div>
      </footer>

      <div className="fab">
        <a href="https://wa.me/911234567890" target="_blank" rel="noreferrer">WhatsApp</a>
        <a className="chat" href="/contact">Contact</a>
      </div>
    </>
  );
}
