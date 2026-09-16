"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NumberTicker from "@/components/ui/NumberTicker";
import SpotlightCard from "@/components/ui/SpotlightCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CAPABILITIES = [
  { num: "01", label: "Product Range", copy: "Corporate gifts and branded merchandise across dozens of categories, from desk accessories to premium hampers." },
  { num: "02", label: "Customization", copy: "Logo branding, personalization and packaging designed around your brand guidelines." },
  { num: "03", label: "Bulk Scale", copy: "Order fulfillment from a few hundred to several thousand units without compromising on finish." },
  { num: "04", label: "Delivery", copy: "Coordinated dispatch to multiple offices, dealer networks or event sites on a single timeline." },
];

const STATS = [
  { value: 500, suffix: "+", label: "Corporate Relationships" },
  { value: 10, suffix: "M+", label: "Gifting Units Delivered" },
  { value: 28, suffix: "+", label: "States Served" },
  { value: 1000, suffix: "s", label: "Products & Options" },
];

const USPS = [
  { label: "Best Product Quality", copy: "Every item vetted before it reaches your shortlist." },
  { label: "Timely Delivery", copy: "Dispatch schedules built around your event or campaign date." },
  { label: "Best-in-Class Pricing", copy: "Competitive bulk pricing without cutting corners on finish." },
  { label: "Authorized Multi-Brand Dealer", copy: "Official dealer for multiple leading brands, not grey-market resale." },
];

export default function CompanyOverviewAnimated() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const uspRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (textRef.current) {
          gsap.fromTo(
            textRef.current.children,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: { trigger: textRef.current, start: "top 82%", once: true },
            }
          );
        }

        if (cardsRef.current) {
          gsap.fromTo(
            cardsRef.current.children,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: { trigger: cardsRef.current, start: "top 82%", once: true },
            }
          );
        }

        if (uspRef.current) {
          gsap.fromTo(
            uspRef.current.children,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: { trigger: uspRef.current, start: "top 85%", once: true },
            }
          );
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-py bg-white">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div ref={textRef}>
            <span className="section-label block">Our Story</span>
            <h2 className="section-title mb-4 mt-2">Corporate Gifting, Built for Scale</h2>
            <span className="gold-rule" />

            <p className="text-gray-600 text-base leading-relaxed mb-5">
              The Choice Company is a corporate gifting and merchandise partner
              helping businesses create meaningful experiences for their
              employees, customers, dealers, partners and stakeholders
            </p>
            <p className="text-gray-600 text-base leading-relaxed mb-10">
              We serve organizations across Mobility, Telecommunications, FMCG,
              Pharmaceuticals, Manufacturing, Industrial Operations and Events,
              combining the right products, professional customization and
              dependable execution into a single corporate gifting process.
            </p>

            <div className="grid grid-cols-4 gap-6 pt-8 border-t border-gray-200">
              {STATS.map(({ value, suffix, label }) => (
                <div key={label}>
                  <div
                    className="font-playfair text-3xl font-bold"
                    style={{ color: "#245138" }}
                  >
                    <NumberTicker value={value} suffix={suffix} formatted={false} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div ref={cardsRef} className="grid grid-cols-2 gap-6">
            {CAPABILITIES.map(({ num, label, copy }) => (
              <SpotlightCard
                key={num}
                className="rounded-2xl border border-gray-200 p-7 bg-white hover:border-gold/40 transition-colors duration-300 cursor-default"
                spotlightColor="rgba(200,155,60,0.08)"
                borderRadius="1rem"
              >
                <div className="font-playfair text-sm mb-4 tracking-wide" style={{ color: "#245138" }}>{num}</div>
                <h3 className="font-bold text-navy text-base mb-2">{label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{copy}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Key USPs */}
        <div className="mt-20 pt-14 border-t border-gray-200">
          <span className="section-label block mb-2">Why Choose Us</span>
          <h3 className="font-playfair text-2xl font-bold text-navy mb-10">
            Key USPs of The Choice Company
          </h3>
          <div ref={uspRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {USPS.map(({ label, copy }) => (
              <div key={label} className="border-l-2 border-gold pl-5">
                <h4 className="font-bold text-navy text-sm mb-1">{label}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}