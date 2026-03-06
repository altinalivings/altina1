// src/app/developers/page.tsx
import type { Metadata } from "next";
import DevsClient from "./DevsClient";

export const metadata: Metadata = {
  title: "Top Developers in Delhi NCR | ALTINA™ Livings",
  description:
    "Explore leading developers including DLF, M3M, Sobha, and Godrej. ALTINA™ Livings is your trusted channel partner for premium projects.",
  alternates: { canonical: "/developers" },
};

export default function DevelopersPage() {
  return <DevsClient />;
}
