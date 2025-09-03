"use client";

import Link from "next/link";
import AnalyticsClient from "../components/AnalyticsClient"; // ✅ fixed path

export default function NotFound() {
  return (
    <>
      {/* Keep analytics running on 404 page */}
      <AnalyticsClient />

      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <h1 className="text-5xl font-bold text-red-600 mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you’re looking for doesn’t exist.  
          It might have been moved or removed.  
        </p>

        <div className="flex gap-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            🏠 Back to Home
          </Link>
          <Link
            href="/projects"
            className="inline-block bg-gray-700 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition"
          >
            🔎 Explore Projects
          </Link>
        </div>
      </div>
    </>
  );
}
