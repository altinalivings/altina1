"use client";

export default function SeoJsonLd({ schema }) {
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      // Always stringify on the client to avoid hydration noise
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
