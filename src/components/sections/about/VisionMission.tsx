export default function VisionMission() {
  return (
    <section className="section-py" style={{ background: "var(--cream)" }}>
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-8">
            <div className="text-4xl mb-4">🔭</div>
            <h3 className="font-playfair text-2xl font-bold text-navy mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">To be India's most trusted and innovative corporate gifting partner — making every business relationship stronger through the art of meaningful gifting.</p>
          </div>
          <div className="card p-8">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-playfair text-2xl font-bold text-navy mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">To deliver premium, custom-branded corporate gifts at scale — combining quality craftsmanship, creative design, and seamless logistics to exceed every client's expectations.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[["🏆","Quality First"],["🤝","Client-Centric"],["♻️","Sustainable"],["🚀","Innovation"]].map(([icon,label]) => (
            <div key={label as string} className="card-flat p-5 text-center">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-sm font-bold text-navy">{label as string}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
