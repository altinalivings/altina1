// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8 text-sm text-gray-600">
        © {new Date().getFullYear()} Altina Livings. All rights reserved.
      </div>
    </footer>
  );
}
