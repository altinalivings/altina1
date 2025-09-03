'use client';
import ContactForm from "./ContactForm";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3>Altina Livings</h3>
          <p>Premium real estate for modern living.</p>
        </div>
        <div className="footer-right">
          <h4>Stay Updated</h4>
          <ContactForm />
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Altina Livings. All rights reserved.</p>
      </div>
    </footer>
  );
}
