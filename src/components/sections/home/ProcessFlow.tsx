"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

// DrawSVGPlugin needs GSAP Club — fallback to standard scaleX connector
gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    n: 1,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Submit Requirement",
    desc: "Fill the inquiry form with product, quantity and branding details",
  },
  {
    n: 2,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Receive Quotation",
    desc: "Detailed quote from our team within 24 hours",
  },
  {
    n: 3,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    title: "Finalization",
    desc: "Approve the quote, sample, and production specs",
  },
  {
    n: 4,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
    title: "Production",
    desc: "Bulk manufacturing with stringent quality checks",
  },
  {
    n: 5,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Delivery",
    desc: "Pan-India delivery to your doorstep on time",
  },
];

export default function ProcessFlowAnimated() {
  const sectionRef = useRef<HTMLElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const steps = sectionRef.current?.querySelectorAll(".process-step");
      if (!steps) return;

      // Steps reveal with stagger
      gsap.fromTo(
        steps,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // Connector line draw animation
      if (connectorRef.current) {
        gsap.fromTo(
          connectorRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
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
        <div className="text-center mb-14">
          <span className="section-label block">HOW IT WORKS</span>
          <h2 className="section-title mt-2">Our Simple Buying Journey</h2>
        </div>

        <div className="relative">
          {/* Animated connector line — desktop only */}
          <div className="hidden md:block absolute top-8 left-[calc(10%+2rem)] right-[calc(10%+2rem)] h-px bg-gray-100 overflow-hidden">
            <div
              ref={connectorRef}
              className="absolute inset-0 will-change-transform"
              style={{ background: "var(--gold)", transformOrigin: "left center" }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-0">
            {STEPS.map(({ n, icon, title, desc }, i) => (
              <div
                key={n}
                className="process-step flex-1 flex flex-col items-center text-center px-4 opacity-0 relative"
              >
                {/* Circle */}
                <div
                  className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 border-gold bg-white shadow-md mb-4 text-gold transition-transform duration-300 hover:scale-110"
                >
                  {icon}
                  <span
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow"
                    style={{ background: "var(--gold)" }}
                  >
                    {n}
                  </span>
                </div>

                <p className="font-bold text-navy text-sm mb-1">{title}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed max-w-[160px]">
                  {desc}
                </p>

                {/* Mobile connector */}
                {i < STEPS.length - 1 && (
                  <div
                    className="md:hidden w-px h-6 mt-3"
                    style={{ background: "var(--gold)", opacity: 0.4 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}