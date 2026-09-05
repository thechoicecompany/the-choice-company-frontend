export default function CompanyOverview() {
  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Story */}
          <div>
            <span className="section-label">OUR STORY</span>
            <h2 className="section-title mb-4">Corporate Gifting, Built for Scale</h2>
            <span className="gold-rule" />

            <p className="text-gray-600 text-base leading-relaxed mb-5">
              The Choice Company is a corporate gifting and merchandise partner
              helping businesses create meaningful experiences for their
              employees, customers, dealers, partners and stakeholders.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mb-5">
              We serve organizations across Mobility, Telecommunications,
              FMCG, Pharmaceuticals, Manufacturing, Industrial &amp; Factory
              Operations, Dealership Networks and Events — delivering
              solutions that combine the right products, professional
              customization and dependable execution.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mb-10">
              From hundreds to thousands of units, we manage large-volume
              requirements with a wide product range and strong sourcing
              capabilities — covering selection, customization, branding,
              packaging and delivery, so every client works with a single
              partner for their complete gifting requirement. For urgent
              needs, we also support fast and same-day delivery wherever
              feasible.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 pt-8 border-t border-gray-200">
              {[
                ["500+", "Corporate Relationships"],
                ["10M+", "Gifting Units Delivered"],
                ["28+", "States Served"],
                ["1000s", "Products & Customization Options"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-playfair text-3xl font-bold text-gold">{n}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-snug">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Capability cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-8">
            {[
              {
                num: "01",
                label: "Product Range",
                copy: "Wide selection across corporate gifting & merchandise",
              },
              {
                num: "02",
                label: "Customization",
                copy: "Branding, personalization & packaging",
              },
              {
                num: "03",
                label: "Bulk Scale",
                copy: "Solutions for hundreds to thousands of units",
              },
              {
                num: "04",
                label: "Delivery",
                copy: "Reliable multi-location & urgent fulfillment",
              },
            ].map(({ num, label, copy }) => (
              <div
                key={num}
                className="rounded-2xl border border-gray-200 p-7 bg-white hover:border-gold/40 transition-colors"
              >
                <div className="font-playfair text-sm text-gold mb-4 tracking-wide">
                  {num}
                </div>
                <h3 className="font-bold text-navy text-base mb-2">{label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}