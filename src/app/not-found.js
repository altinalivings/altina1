// src/app/not-found.js
export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-3xl font-semibold mb-2">404 — Not Found</h1>
        <p className="text-gray-600">The page you’re looking for doesn’t exist.</p>
      </div>
    </div>
  );
}
