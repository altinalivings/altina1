"use client";

export default function BrochureVault({ onClose }) {
  const brochures = [
    { name: "Business Center", file: "/brochures/business-center.pdf" },
    { name: "Corporate Tower", file: "/brochures/corporate-tower.pdf" },
    { name: "Greensville", file: "/brochures/greensville.pdf" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center">
      <div className="w-full md:max-w-xl rounded-t-2xl md:rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h3 className="font-semibold">Brochure Vault</h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        {/* List */}
        <div className="p-5 space-y-3">
          {brochures.map((b) => (
            <div
              key={b.name}
              className="flex items-center justify-between rounded-xl border p-3"
            >
              <div>
                <p className="text-sm font-medium">{b.name}</p>
                <p className="text-xs text-gray-500">PDF • 2–6 MB</p>
              </div>
              <a
                href={b.file}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
