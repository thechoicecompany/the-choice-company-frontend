export default function CompanyOverview() {
  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-label">OUR STORY</span>
            <h2 className="section-title mb-4">India's Trusted Corporate Gifting Partner</h2>
            <span className="gold-rule" />
            <p className="text-gray-600 text-base leading-relaxed mb-5">
              The Choice Company was founded with a simple belief — every corporate gift should tell a story. Since 2010, we've been helping India's leading businesses create memorable gifting experiences that strengthen relationships and reinforce brand identity.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              From Diwali hampers for 5,000 employees to custom onboarding kits for growing startups, we've delivered millions of branded gifts across 28 states, earning the trust of 500+ corporate clients.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[["500+","Corporate Clients"],["10M+","Gifts Delivered"],["28","States Covered"]].map(([n,l]) => (
                <div key={l} className="text-center">
                  <div className="font-playfair text-3xl font-bold text-gold">{n}</div>
                  <div className="text-xs text-gray-500 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-6xl">🏭</div>
            <div className="aspect-square rounded-2xl bg-gold/10 flex items-center justify-center text-6xl mt-8">🎁</div>
            <div className="aspect-square rounded-2xl bg-teal/10 flex items-center justify-center text-6xl -mt-4">✏</div>
            <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-6xl">🚚</div>
          </div>
        </div>
      </div>
    </section>
  );
}
