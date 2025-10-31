/*
 * SeoProvider component
 *
 * The next-seo DefaultSeo component relies on React hooks internally and must be
 * rendered in a client component. Without the 'use client' directive, Next.js
 * treats the parent server component as a server-only module and can trigger
 * invalid hook call errors when the DefaultSeo component mounts. This wrapper
 * provides a thin client boundary around DefaultSeo while importing the
 * defaultSEO configuration from our seo.ts helper. When used in the root
 * layout, it ensures that SEO metadata is applied consistently across pages
 * without breaking the rules of hooks.
 */
"use client";

import { DefaultSeo } from 'next-seo';
import { defaultSEO } from '@/lib/seo';

export default function SeoProvider() {
  return <DefaultSeo {...defaultSEO} />;
}