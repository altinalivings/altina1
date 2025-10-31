// src/app/not-found.tsx
export const metadata = {
  title: "Page Not Found",
  description: "We couldn’t find that page.",
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">404 — Page Not Found</h1>
      <p className="mt-2 text-white/70">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <a href="/" className="mt-6 inline-block rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95">
        Back to Home
      </a>
    </main>
  );
}