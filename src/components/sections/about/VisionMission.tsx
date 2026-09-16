"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COMMITMENTS = [
  { label: "Quality", copy: "Products selected with purpose and care, not just catalog volume." },
  { label: "Scale", copy: "Capabilities for requirements running into thousands of units." },
  { label: "Availability", copy: "A broad range covering everyday gifting and large-scale campaigns." },
  { label: "Customization", copy: "Branding and presentation tailored to your requirement." },
  { label: "Speed", copy: "Responsive execution for time-sensitive requirements." },
  { label: "Partnership", copy: "A dependable approach built for long-term relationships." },
];

export default function VisionMission() {
  const sectionRef = useRef<HTMLElement>(null);
  const rulesRef = useRef<HTMLSpanElement[]>([]); // was HTMLDivElement[] — the ref targets <span>
  const commitmentsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        rulesRef.current.forEach((rule) => {
          if (!rule) return;
          const copy = rule.parentElement?.querySelector("[data-copy]");
          gsap.set(rule, { transformOrigin: "left center", scaleX: 0 });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: rule, start: "top 85%", once: true },
          });
          tl.to(rule, { scaleX: 1, duration: 0.5, ease: "power2.inOut" });
          if (copy) {
            tl.from(copy, { opacity: 0, y: 10, duration: 0.4, ease: "power2.out" }, "-=0.2");
          }
        });

        if (commitmentsRef.current) {
          gsap.fromTo(
            commitmentsRef.current.children,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.07,
              ease: "power2.out",
              scrollTrigger: { trigger: commitmentsRef.current, start: "top 85%", once: true },
            }
          );
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-py" style={{ background: "var(--cream)" }}>
      <div className="container-site">
        <div className="mb-14">
          <span className="section-label">Our Purpose</span>
          <h2 className="section-title mt-2">Vision &amp; Mission</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-20">
          <div>
            <h3 className="font-playfair text-2xl font-bold text-navy mb-4 leading-snug">
              India's most trusted corporate gifting partner.
            </h3>
            <span
              className="gold-rule mb-4 block"
              ref={(el) => { if (el) rulesRef.current[0] = el; }}
            />
            <p data-copy className="text-gray-600 leading-relaxed">
              To make every business relationship stronger through gifting
              that is considered, well-executed and consistent, at whatever
              scale a client needs.
            </p>
          </div>
          <div>
            <h3 className="font-playfair text-2xl font-bold text-navy mb-4 leading-snug">
              One partner, from sourcing to delivery.
            </h3>
            <span
              className="gold-rule mb-4 block"
              ref={(el) => { if (el) rulesRef.current[1] = el; }}
            />
            <p data-copy className="text-gray-600 leading-relaxed">
              To deliver corporate gifting at scale, combining sourcing,
              customization, branding and logistics into a single,
              dependable process for every client.
            </p>
          </div>
        </div>

        <div className="pt-14 border-t border-gray-200">
          <div className="mb-10">
            <span className="section-label">Our Commitment</span>
          </div>
          <div ref={commitmentsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
            {COMMITMENTS.map(({ label, copy }) => (
              <div key={label} className="border-l-2 border-gold/30 pl-5">
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