const CAPABILITIES = [
  { label: "Production Capacity", value: "50,000+/mo" },
  { label: "Manufacturing Units", value: "3" },
  { label: "QC Checkpoints", value: "5-stage" },
  { label: "Logistics Partners", value: "15+" },
  { label: "States Covered", value: "28+ UTs" },
  { label: "Rush Order TAT", value: "5–7 days" },
];

export default function Infrastructure() {
  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <div className="mb-12">
          <span className="section-label">CAPABILITIES</span>
          <h2 className="section-title">Infrastructure & Scale</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-l border-gray-200">
          {CAPABILITIES.map(({ label, value }) => (
            <div
              key={label}
              className="border-r border-b border-gray-200 p-6 bg-white flex flex-col justify-between min-h-[120px]"
            >
              <div className="font-playfair text-xl font-bold text-gold whitespace-nowrap">
                {value}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-3">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}