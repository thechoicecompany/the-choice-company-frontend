"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ZONES = [
  { name: "North", states: "Delhi, Punjab, Haryana, Rajasthan, UP, Uttarakhand, HP", x: 300, y: 70 },
  { name: "West", states: "Gujarat, Maharashtra, Goa", x: 120, y: 210 },
  { name: "Central", states: "Madhya Pradesh, Chhattisgarh", x: 300, y: 230 },
  { name: "East", states: "West Bengal, Bihar, Jharkhand, Odisha", x: 460, y: 190 },
  { name: "South", states: "Karnataka, Tamil Nadu, Kerala, AP, Telangana", x: 300, y: 380 },
  { name: "Northeast", states: "Assam and neighboring states", x: 480, y: 60 },
];

const HUB = { x: 300, y: 230 };

export default function DeliveryNetwork() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!svgRef.current) return;

        const lines = svgRef.current.querySelectorAll<SVGLineElement>("[data-line]");
        const nodes = svgRef.current.querySelectorAll<SVGGElement>("[data-node]");
        const hub = svgRef.current.querySelector<SVGCircleElement>("[data-hub]");

        gsap.set(lines, { strokeDasharray: 500, strokeDashoffset: 500 }); // removed the dead getTotalLength line
        gsap.set(nodes, { opacity: 0, scale: 0.6, transformOrigin: "center" });
        gsap.set(hub, { scale: 0, transformOrigin: "center" });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: svgRef.current, start: "top 75%", once: true },
        });

        tl.to(hub, { scale: 1, duration: 0.5, ease: "back.out(2)" })
          .to(lines, { strokeDashoffset: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" }, "-=0.1")
          .to(nodes, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.12, ease: "back.out(2)" }, "-=0.5");
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-py bg-white">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-label">Nationwide Reach</span>
            <h2 className="section-title mb-4">Pan-India Delivery Network</h2>
            <span className="gold-rule mb-5 block" />
            <p className="text-gray-600 leading-relaxed mb-6">
              Orders route from our central hub into six regional zones
              covering all 28 states and 8 union territories, with same-day
              dispatch supported wherever feasible for time-sensitive
              corporate gifting campaigns.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="font-playfair text-3xl font-bold" style={{ color: "#245138" }}>28+</div>
                <div className="text-xs text-gray-500 mt-1">States Served</div>
              </div>
              <div>
                <div className="font-playfair text-3xl font-bold" style={{ color: "#245138" }}>8</div>
                <div className="text-xs text-gray-500 mt-1">Union Territories</div>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-gray-600">
              {ZONES.map((z) => (
                <li key={z.name}>
                  <span className="font-bold text-navy">{z.name}: </span>
                  {z.states}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6">
            <svg
              ref={svgRef}
              viewBox="0 0 600 460"
              className="w-full h-auto"
              role="img"
              aria-label="Diagram of The Choice Company's central hub connecting to six regional delivery zones across India"
            >
              {ZONES.map((z) => (
                <line
                  key={`line-${z.name}`}
                  data-line
                  x1={HUB.x}
                  y1={HUB.y}
                  x2={z.x}
                  y2={z.y}
                  stroke="var(--gold, #B08D57)"
                  strokeWidth={1.5}
                  opacity={0.6}
                />
              ))}

              <circle data-hub cx={HUB.x} cy={HUB.y} r={14} fill="var(--navy, #0B1F3A)" />
              <text x={HUB.x} y={HUB.y + 32} textAnchor="middle" className="fill-navy text-[11px] font-bold">
                Central Hub
              </text>

              {ZONES.map((z) => (
                <g key={z.name} data-node transform={`translate(${z.x}, ${z.y})`}>
                  <circle r={9} fill="white" stroke="var(--gold, #B08D57)" strokeWidth={2} />
                  <text y={-16} textAnchor="middle" className="fill-navy text-[11px] font-bold">
                    {z.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}