export default function SectionHeader({ title, subtitle, titleClass = "" }) {
  return (
    <header className="mb-8 text-center">
      <h2 className={`font-serif text-3xl font-semibold ${titleClass || "text-ink"}`}>{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-gray-700">{subtitle}</p>}
    </header>
  );
}
