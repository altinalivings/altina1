"use client";
import { useEffect } from "react";
import { persistAttributionFromUrl } from "@/lib/attribution";

export default function AnalyticsClient() {
  useEffect(() => {
    // Capture UTM/GCLID/FBLID from URL and persist to localStorage
    persistAttributionFromUrl();
  }, []);

  return null;
}
