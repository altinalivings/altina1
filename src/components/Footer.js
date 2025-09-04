export default function Footer() {
  return (
    <footer className="footer mt-16">
      <div className="container mx-auto px-4 py-8 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>© {new Date().getFullYear()} Altina Livings. All rights reserved.</div>
        <nav className="flex gap-4">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </div>
    </footer>
  );
}
