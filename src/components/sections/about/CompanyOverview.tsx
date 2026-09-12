"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NumberTicker from "@/components/ui/NumberTicker";
import SpotlightCard from "@/components/ui/SpotlightCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CAPABILITIES = [
  { num: "01", label: "Product Range", copy: "Wide selection across corporate gifting & merchandise" },
  { num: "02", label: "Customization", copy: "Branding, personalization & premium packaging" },
  { num: "03", label: "Bulk Scale", copy: "Solutions for hundreds to thousands of units" },
  { num: "04", label: "Delivery", copy: "Reliable multi-location & urgent fulfillment" },
];

const STATS = [
  { value: 500, suffix: "+", label: "Corporate Relationships" },
  { value: 10, prefix: "", suffix: "M+", label: "Gifting Units Delivered" },
  { value: 28, suffix: "+", label: "States Served" },
  { value: 1000, suffix: "s", label: "Products & Options" },
];

export default function CompanyOverviewAnimated() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Text column
      if (textRef.current) {
        const children = Array.from(textRef.current.children);
        gsap.fromTo(
          children,
          { opacity: 0, x: -28 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      // Capability cards
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 32, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-py bg-white">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Story */}
          <div ref={textRef}>
            <span className="section-label block">OUR STORY</span>
            <h2 className="section-title mb-4 mt-2">
              Corporate Gifting, Built for Scale
            </h2>
            <span className="gold-rule" />

            <p className="text-gray-600 text-base leading-relaxed mb-5">
              The Choice Company is a corporate gifting and merchandise partner
              helping businesses create meaningful experiences for their
              employees, customers, dealers, partners and stakeholders.
            </p>
            <p className="text-gray-600 text-base leading-relaxed mb-10">
              We serve organizations across Mobility, Telecommunications, FMCG,
              Pharmaceuticals, Manufacturing, Industrial Operations and Events —
              delivering solutions that combine the right products, professional
              customization and dependable execution.
            </p>

            {/* Animated Stats */}
            <div className="grid grid-cols-4 gap-6 pt-8 border-t border-gray-200">
              {STATS.map(({ value, prefix = "", suffix, label }) => (
                <div key={label}>
                  <div className="font-playfair text-3xl font-bold text-gold">
                    {prefix}
                    <NumberTicker
                      value={value}
                      suffix={suffix}
                      className="font-playfair text-3xl font-bold text-gold"
                      formatted={false}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 leading-snug">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Capability cards */}
          <div
            ref={cardsRef}
            className="grid grid-cols-2 gap-6"
          >
            {CAPABILITIES.map(({ num, label, copy }) => (
              <SpotlightCard
                key={num}
                className="rounded-2xl border border-gray-200 p-7 bg-white hover:border-gold/40 transition-colors duration-300 cursor-default"
                spotlightColor="rgba(200,155,60,0.08)"
                borderRadius="1rem"
              >
                <div className="font-playfair text-sm text-gold mb-4 tracking-wide">
                  {num}
                </div>
                <h3 className="font-bold text-navy text-base mb-2">{label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{copy}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}