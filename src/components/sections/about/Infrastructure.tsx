const CAPABILITIES = [
  { icon:"📦", label:"Production Capacity", value:"50,000+ units/month" },
  { icon:"🏭", label:"Manufacturing Units",  value:"3 facilities" },
  { icon:"🔍", label:"QC Checkpoints",       value:"5-stage process" },
  { icon:"🚚", label:"Logistics Partners",   value:"15+ couriers" },
  { icon:"🗺",  label:"States Covered",       value:"28 states + UTs" },
  { icon:"⚡", label:"Rush Order TAT",        value:"5–7 working days" },
];
export default function Infrastructure() {
  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <div className="text-center mb-12">
          <span className="section-label">CAPABILITIES</span>
          <h2 className="section-title">Infrastructure & Scale</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {CAPABILITIES.map(({ icon, label, value }) => (
            <div key={label} className="card-flat p-5 text-center">
              <div className="text-3xl mb-3">{icon}</div>
              <div className="text-lg font-bold text-gold">{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
