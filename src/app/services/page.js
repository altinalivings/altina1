export const metadata = { title: "Services | Altina Livings" };
export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Our Services</h1>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>Project discovery and shortlisting</li>
        <li>Site visits and guided tours</li>
        <li>Price negotiation & booking assistance</li>
        <li>Paperwork coordination</li>
      </ul>
    </div>
  );
}
