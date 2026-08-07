const CLIENTS = ["TATA","Infosys","Wipro","HDFC Bank","Dabur","Dr. Reddy's","Mahindra","HCL","Bajaj"];
const TESTIMONIALS = [
  { quote:"The Choice Company delivered 500 Diwali hampers across 8 cities flawlessly. Quality exceeded our expectations.", name:"Rohit Sharma", role:"HR Head, Leading IT Company", stars:5 },
  { quote:"Our employee welcome kits were a huge hit. Custom branding was done perfectly and delivery was on time.", name:"Priya Mehta", role:"HR Manager, Startup", stars:5 },
  { quote:"Best vendor for bulk gifting. Competitive pricing, great quality, and responsive team throughout the process.", name:"Ankit Jain", role:"Admin Manager, BFSI Firm", stars:5 },
];
export default function SocialProof() {
  return (
    <section className="section-py" style={{ background:"var(--cream)" }}>
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Client Logos */}
          <div>
            <h3 className="font-bold text-navy text-base mb-5 text-center lg:text-left">Trusted by 500+ Businesses</h3>
            <div className="grid grid-cols-3 gap-3">
              {CLIENTS.map((c) => (
                <div key={c} className="h-14 bg-white rounded-xl flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-100">
                  {c}
                </div>
              ))}
            </div>
          </div>
          {/* Testimonials */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-navy text-base mb-5 text-center lg:text-left">What Our Clients Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="card p-5">
                  <div className="flex mb-3">
                    {"★".repeat(t.stars).split("").map((s, i) => (
                      <span key={i} className="text-gold text-sm">{s}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 italic mb-4 leading-relaxed">"{t.quote}"</p>
                  <div>
                    <div className="text-xs font-bold text-navy">— {t.name}</div>
                    <div className="text-[11px] text-gray-400">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
