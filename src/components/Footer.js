export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrapper footer-grid">
        <div>
          <div className="brand brand--footer">
            ALTINA<span className="tm">™</span> Livings
          </div>
          <p className="muted">Premium channel partner for leading real-estate developers.</p>
        </div>

        <div>
          <h4 className="footer-head">Company</h4>
          <ul className="foot-links">
            <li><a href="/about">About</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/career">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-head">Help</h4>
          <ul className="foot-links">
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="/terms">Terms</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-head">Contact</h4>
          <p className="muted">info@altina.in</p>
          <p className="muted">+91-XXXXXXXXXX</p>
          <a href="#request-callback" className="btn btn-primary btn-sm">Request a Callback</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="wrapper">
          © {new Date().getFullYear()} ALTINA™ Livings. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
