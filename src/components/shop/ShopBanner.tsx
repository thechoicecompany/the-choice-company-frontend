// SHOP BANNER — explains the demo purchase concept to visitors
export default function ShopBanner() {
  const STEPS = [
    { icon: "🛒", title: "Order 1–5 Samples", desc: "Buy single units at sample pricing to evaluate quality firsthand" },
    { icon: "✅", title: "Evaluate Quality", desc: "Check material, finish, print quality & packaging in person" },
    { icon: "📋", title: "Place Bulk Order", desc: "Satisfied? Order 50–50,000 units with your logo at wholesale rates" },
  ];

  return (
    <section className="bg-white border-b border-gray-100 py-10">
      <div className="container-site">
        <div className="text-center mb-8">
          <span className="section-label">HOW IT WORKS</span>
          <h2 className="section-title text-2xl">Try Before You Commit to Bulk</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-4 items-start p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "var(--gold)", opacity: 0.9 }}>
                {s.icon}
              </div>
              <div>
                <div className="font-bold text-navy text-sm mb-1">
                  <span className="text-gold mr-2">Step {i + 1}.</span>{s.title}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-xl border border-gold/30 bg-amber-50/50 flex flex-wrap items-center gap-3 justify-center text-sm text-gray-600">
          <span>💡</span>
          <span><strong className="text-navy">Sample pricing</strong> is higher per-unit than bulk (covers single-unit production + shipping).</span>
          <span className="hidden md:inline">·</span>
          <span>Bulk orders (50+ units) are priced significantly lower with custom branding included.</span>
        </div>
      </div>
    </section>
  );
}
