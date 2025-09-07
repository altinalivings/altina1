"use client";

import { useEffect } from "react";
// use "@/lib/tracking" if you have jsconfig; otherwise "../lib/tracking"
import { initAttribution } from "../lib/tracking";

export default function ClientAttribution() {
  useEffect(() => {
    initAttribution();
  }, []);

  return null; // nothing to render
}
