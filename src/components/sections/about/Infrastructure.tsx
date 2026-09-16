"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CAPABILITIES = [
  { label: "Production Capacity", value: "50,000+/mo" },
  { label: "Manufacturing Units", value: "3" },
  { label: "QC Checkpoints", value: "5-stage" },
  { label: "Logistics Partners", value: "15+" },
  { label: "States Covered", value: "28+ UTs" },
  { label: "Rush Order TAT", value: "5–7 days" },
];

export default function Infrastructure() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!gridRef.current) return;
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.4,
            stagger: { each: 0.08, grid: "auto", from: "start" },
            ease: "none",
            scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-py bg-white">
      <div className="container-site">
        <div className="mb-12">
          <span className="section-label">Capabilities</span>
          <h2 className="section-title">Infrastructure &amp; Scale</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mt-4">
            Three manufacturing units, a five-stage quality check on every
            batch, and a logistics network built to move large, time-sensitive
            corporate gifting orders without last-mile surprises.
          </p>
        </div>
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-l border-gray-200">
          {CAPABILITIES.map(({ label, value }) => (
            <div
              key={label}
              className="border-r border-b border-gray-200 p-6 bg-white flex flex-col justify-between min-h-[120px]"
            >
              <div
                className="font-playfair text-2xl font-bold whitespace-nowrap"
                style={{ color: "#245138" }}
              >
                {value}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-3">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}