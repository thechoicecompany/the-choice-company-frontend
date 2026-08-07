const TEAM = [
  { name:"Amit Sharma",    role:"Founder & CEO",          emoji:"👨‍💼" },
  { name:"Priya Mehta",    role:"Head of Operations",     emoji:"👩‍💼" },
  { name:"Rahul Gupta",    role:"Design & Branding Lead", emoji:"👨‍🎨" },
  { name:"Sneha Joshi",    role:"Client Relations Head",  emoji:"👩‍💻" },
];
export default function TeamGrid() {
  return (
    <section className="section-py" style={{ background: "var(--cream)" }}>
      <div className="container-site">
        <div className="text-center mb-12">
          <span className="section-label">OUR TEAM</span>
          <h2 className="section-title">The People Behind The Choice</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map(({ name, role, emoji }) => (
            <div key={name} className="card p-6 text-center group">
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-4xl mx-auto mb-4 group-hover:bg-gold/20 transition-colors">{emoji}</div>
              <h3 className="font-bold text-navy text-sm mb-1">{name}</h3>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
