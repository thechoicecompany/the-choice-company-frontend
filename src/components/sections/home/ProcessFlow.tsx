"use client";
import { useEffect, useRef, useState } from "react";
const STEPS = [
  { n:1, icon:"📋", title:"Submit Requirement",  desc:"Fill our inquiry form with product, quantity and branding details" },
  { n:2, icon:"📄", title:"Receive Quotation",   desc:"Detailed quote from our team within 24 hours" },
  { n:3, icon:"✅", title:"Finalization",        desc:"Approve the quote, sample, and production specs" },
  { n:4, icon:"🏭", title:"Production",          desc:"Bulk manufacturing with stringent quality checks" },
  { n:5, icon:"🚚", title:"Delivery",            desc:"Pan-India delivery to your doorstep" },
];
export default function ProcessFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section className="section-py bg-white" ref={ref}>
      <div className="container-site">
        <div className="text-center mb-12">
          <span className="section-label">HOW IT WORKS</span>
          <h2 className="section-title">Our Simple Buying Journey</h2>
        </div>
        <div className="relative flex flex-col md:flex-row items-start gap-4">
          {/* Horizontal connector line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gray-200 mx-[80px]" />
          {visible && <div className="hidden md:block absolute top-8 left-0 h-0.5 bg-gold transition-all duration-[2s] ease-out mx-[80px]" style={{ width:"calc(100% - 160px)" }} />}

          {STEPS.map(({ n, icon, title, desc }, i) => (
            <div key={n} className={`flex-1 flex flex-col items-center text-center px-2 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay:`${i * 120}ms` }}>
              <div className="relative z-10 w-16 h-16 rounded-full border-2 border-gold bg-white flex items-center justify-center text-2xl mb-3 shadow-sm">
                {icon}
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-white text-[10px] font-bold flex items-center justify-center">{n}</span>
              </div>
              <div className="font-bold text-navy text-sm mb-1">{title}</div>
              <div className="text-[11px] text-gray-500 leading-relaxed">{desc}</div>
              {i < STEPS.length - 1 && <div className="md:hidden w-0.5 h-6 bg-gray-200 mt-3" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
