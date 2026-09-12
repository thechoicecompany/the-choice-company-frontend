"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SpotlightCard from "@/components/ui/SpotlightCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ITEMS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Premium Quality",
    desc: "Curated products from verified manufacturers with 5-stage quality checks",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Custom Branding",
    desc: "Logo printing, embroidery, laser engraving, and full custom packaging",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Fast Production",
    desc: "7–15 day turnaround for most orders, rush options always available",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
    title: "Bulk Order Experts",
    desc: "Handling 50 to 50,000+ units with consistent quality at every scale",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: "Quality Assured",
    desc: "100% inspection before dispatch — zero defective units shipped",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "Dedicated Support",
    desc: "Personal account manager from inquiry to delivery for every client",
  },
];

export default function WhyChooseUsAnimated() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      // Heading reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current.children,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Grid cards stagger
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll("li");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: {
              amount: 0.55,
              from: "start",
            },
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
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
    <section
      ref={sectionRef}
      className="section-py relative overflow-hidden"
      style={{ background: "var(--navy)" }}
      aria-labelledby="why-choose-us-heading"
    >
      {/* Ambient glow top */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 blur-[80px]"
        style={{
          background:
            "radial-gradient(ellipse, #C89B3C 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="container-site relative">
        <div ref={headingRef} className="text-center mb-14">
          <span className="section-label text-gold block">OUR PROMISE</span>
          <h2
            id="why-choose-us-heading"
            className="section-title text-white mt-2"
          >
            Why Choose The Choice Company?
          </h2>
        </div>

        <ul
          ref={gridRef}
          role="list"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 list-none p-0 m-0"
        >
          {ITEMS.map(({ icon, title, desc }) => (
            <li key={title}>
              <SpotlightCard
                className="h-full text-center p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-gold/30 transition-colors duration-300 cursor-default"
                spotlightColor="rgba(200,155,60,0.12)"
                borderRadius="1rem"
              >
                <span
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 text-gold"
                  style={{ background: "rgba(200,155,60,0.1)" }}
                  role="img"
                  aria-label={title}
                >
                  {icon}
                </span>
                <p className="text-sm font-bold text-white mb-2">{title}</p>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  {desc}
                </p>
              </SpotlightCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}