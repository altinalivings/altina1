// src/components/Seo.tsx
"use client";
import Head from "next/head";

type Props = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
};

export default function Seo({
  title = "ALTINA™ Livings",
  description = "Premium channel partner for luxury real estate across Delhi NCR.",
  url,
  image = "/og/altina-default.jpg",
}: Props) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.altina.example";
  const absUrl = url ? url : site;
  const absImg = image?.startsWith("http") ? image : `${site}${image}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={absUrl} />

      {/* OG */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={absUrl} />
      <meta property="og:image" content={absImg} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absImg} />
    </Head>
  );
}
