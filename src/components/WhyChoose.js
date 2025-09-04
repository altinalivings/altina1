import Wrapper from "@/components/Wrapper";

export default function WhyChoose() {
  const stats = [
    { label: "Years of Industry Expertise", value: "15+" },
    { label: "Home Buyers & Investors Served", value: "3200+" },
    { label: "Working with Best Developers", value: "Top 4" },
    { label: "Commitment to Transparency", value: "100%" },
  ];
  return (
    <section className="py-12 md:py-16 bg-amber-50/60 border-t">
      <Wrapper>
        <h2 className="text-center text-2xl md:text-3xl font-semibold">Why Choose <span className="text-amber-700">Altina Livings</span>?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {stats.map(s => (
            <div key={s.label} className="text-center rounded-xl bg-white border p-6 shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-gray-800">{s.value}</div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
