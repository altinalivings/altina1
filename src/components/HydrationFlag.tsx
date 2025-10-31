// src/components/HydrationFlag.tsx
"use client";
import { useEffect } from "react";

export default function HydrationFlag() {
  useEffect(() => {
    (window as any).__ALTINA_HYDRATED__ = true;
    console.log("[HydrationFlag] Client hydrated.");
  }, []);
  return null;
}