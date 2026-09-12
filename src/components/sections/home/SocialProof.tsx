"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NumberTicker from "@/components/ui/NumberTicker";
import SpotlightCard from "@/components/ui/SpotlightCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CLIENTS = ["TATA", "Infosys", "Wipro", "HDFC Bank", "Dabur", "Dr. Reddy's", "Mahindra", "HCL", "Bajaj"];

const TESTIMONIALS = [
  { quote: "The Choice Company delivered 500 Diwali hampers across 8 cities flawlessly. Quality exceeded our expectations.", name: "Rohit Sharma", role: "HR Head, Leading IT Company", stars: 5 },
  { quote: "Our employee welcome kits were a huge hit. Custom branding was done perfectly and delivery was on time.", name: "Priya Mehta", role: "HR Manager, Startup", stars: 5 },
  { quote: "Best vendor for bulk gifting. Competitive pricing, great quality, and responsive team throughout.", name: "Ankit Jain", role: "Admin Manager, BFSI Firm", stars: 5 },
];

const STATS = [
  { value: 500, suffix: "+", label: "Corporate Clients" },
  { value: 10, suffix: "M+", label: "Units Delivered" },
  { value: 28, suffix: "+", label: "States Covered" },
  { value: 99, suffix: "%", label: "On-Time Delivery" },
];

export default function SocialProofAnimated() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Stats strip
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: statsRef.current, start: "top 85%", once: true }
          }
        );
      }

      // Client logos
      if (clientsRef.current) {
        gsap.fromTo(
          clientsRef.current.children,
          { opacity: 0, scale: 0.88 },
          {
            opacity: 1, scale: 1, stagger: 0.07, duration: 0.45, ease: "back.out(1.4)",
            scrollTrigger: { trigger: clientsRef.current, start: "top 85%", once: true }
          }
        );
      }

      // Testimonials
      if (testimonialsRef.current) {
        gsap.fromTo(
          testimonialsRef.current.children,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, stagger: 0.14, duration: 0.65, ease: "power3.out",
            scrollTrigger: { trigger: testimonialsRef.current, start: "top 82%", once: true }
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-py" style={{ background: "var(--cream)" }}>
      <div className="container-site space-y-12">

        {/* Stats bar */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-navy"
        >
          {STATS.map(({ value, suffix, label }) => (
            <div key={label} className="text-center">
              <div className="font-playfair text-3xl font-bold text-gold">
                <NumberTicker value={value} suffix={suffix} formatted={false} />
              </div>
              <div className="text-xs text-white/60 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Client Logos */}
          <div>
            <h3 className="font-bold text-navy text-base mb-5 text-center lg:text-left">
              Trusted by 500+ Businesses
            </h3>
            <div ref={clientsRef} className="grid grid-cols-3 gap-3">
              {CLIENTS.map((c) => (
                <div
                  key={c}
                  className="h-14 bg-white rounded-xl flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-100 hover:border-gold/40 hover:text-navy transition-all duration-200 cursor-default"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-navy text-base mb-5 text-center lg:text-left">
              What Our Clients Say
            </h3>
            <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t) => (
                <SpotlightCard
                  key={t.name}
                  className="p-5 rounded-xl bg-white border border-gray-100 flex flex-col"
                  spotlightColor="rgba(200,155,60,0.07)"
                  borderRadius="0.75rem"
                >
                  {/* Stars */}
                  <div className="flex mb-3">
                    {"★".repeat(t.stars).split("").map((s, i) => (
                      <span key={i} className="text-gold text-sm">{s}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 italic mb-4 leading-relaxed flex-1">
                    "{t.quote}"
                  </p>
                  <div>
                    <div className="text-xs font-bold text-navy">— {t.name}</div>
                    <div className="text-[11px] text-gray-400">{t.role}</div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}