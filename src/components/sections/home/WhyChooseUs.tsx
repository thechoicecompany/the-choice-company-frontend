const ITEMS = [
  { icon:"🏅", title:"Premium Quality",       desc:"Curated products from verified manufacturers with strict quality checks" },
  { icon:"✏",  title:"Custom Branding",       desc:"Logo printing, embroidery, laser engraving, and full custom packaging" },
  { icon:"⚡", title:"Fast Production",       desc:"7–15 day turnaround for most orders, rush options available" },
  { icon:"📦", title:"Bulk Order Experts",    desc:"Handling orders from 50 to 50,000+ units with consistent quality" },
  { icon:"🔍", title:"Quality Check",         desc:"100% inspection before dispatch — zero defective units shipped" },
  { icon:"🤝", title:"Dedicated Support",     desc:"Personal account manager for every client from inquiry to delivery" },
];
export default function WhyChooseUs() {
  return (
    <section className="section-py" style={{ background:"var(--navy)" }}>
      <div className="container-site">
        <div className="text-center mb-12">
          <span className="section-label text-gold">OUR PROMISE</span>
          <h2 className="section-title text-white">Why Choose The Choice Company?</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ITEMS.map(({ icon, title, desc }) => (
            <div key={title} className="text-center p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/40 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-3">{icon}</div>
              <div className="text-sm font-bold text-white mb-2">{title}</div>
              <div className="text-[11px] text-white/50 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
