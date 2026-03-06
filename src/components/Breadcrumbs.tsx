// src/components/Breadcrumbs.tsx
import Link from "next/link";
import Script from "next/script";

type BreadcrumbItem = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Generate structured data for breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.altinalivings.com"
      },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": item.label,
        "item": `https://www.altinalivings.com${item.href}`
      }))
    ]
  };

  return (
    <>
      <nav 
        aria-label="Breadcrumb" 
        className="text-sm text-altina-ivory/60 mb-6"
      >
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link 
              href="/" 
              className="hover:text-altina-gold transition-colors"
            >
              Home
            </Link>
          </li>
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-altina-ivory/40">/</span>
              {idx === items.length - 1 ? (
                <span className="text-altina-gold font-medium">
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href} 
                  className="hover:text-altina-gold transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Structured Data for Breadcrumbs */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </>
  );
}
