"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="wrapper header-inner">
        <Link href="/" className="brand">
          ALTINA<span className="tm">™</span> Livings
        </Link>

        <nav className="nav">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`navlink ${pathname === n.href ? "active" : ""}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
