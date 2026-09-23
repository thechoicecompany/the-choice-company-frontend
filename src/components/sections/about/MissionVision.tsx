"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Target, Eye } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COMMITMENTS = [
    { label: "Quality", copy: "Products selected with purpose and care, not just catalog volume." },
    { label: "Scale", copy: "Capabilities for requirements running into thousands of units." },
    { label: "Availability", copy: "A broad range covering everyday gifting and large-scale campaigns." },
    { label: "Customization", copy: "Branding and presentation tailored to your requirement." },
    { label: "Speed", copy: "Responsive execution for time-sensitive requirements." },
    { label: "Partnership", copy: "A dependable approach built for long-term relationships." },
];

export default function MissionVision() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const commitmentsRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                if (cardsRef.current) {
                    gsap.fromTo(
                        cardsRef.current.children,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.12,
                            ease: "power2.out",
                            scrollTrigger: { trigger: cardsRef.current, start: "top 82%", once: true },
                        }
                    );
                }

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
        <section ref={sectionRef} className="section-py" style={{ background: "var(--ivory, #FAF8F3)" }}>
            <div className="container-site">
                <div className="mb-14">
                    <span
                        className="block text-xs font-semibold uppercase"
                        style={{ color: "var(--gold, #D4A63A)", letterSpacing: "3px" }}
                    >
                        Our Purpose
                    </span>
                </div>

                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-20">
                    <div>
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                            style={{ background: "var(--white, #FFFFFF)", border: "1px solid #E7D39D" }}
                        >
                            <Target size={26} style={{ color: "var(--gold, #D4A63A)" }} strokeWidth={1.75} />
                        </div>
                        <h3
                            className="font-playfair text-2xl font-bold mb-3"
                            style={{ color: "var(--text-primary, #102235)" }}
                        >
                            Our Mission
                        </h3>
                        <p className="leading-relaxed" style={{ color: "var(--text-secondary, #647386)" }}>
                            To make every business relationship stronger through gifting
                            that is considered, well-executed and consistent, at whatever
                            scale a client needs.
                        </p>
                    </div>

                    <div>
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                            style={{ background: "var(--white, #FFFFFF)", border: "1px solid #E7D39D" }}
                        >
                            <Eye size={26} style={{ color: "var(--gold, #D4A63A)" }} strokeWidth={1.75} />
                        </div>
                        <h3
                            className="font-playfair text-2xl font-bold mb-3"
                            style={{ color: "var(--text-primary, #102235)" }}
                        >
                            Our Vision
                        </h3>
                        <p className="leading-relaxed" style={{ color: "var(--text-secondary, #647386)" }}>
                            To be India&apos;s most trusted corporate gifting partner,
                            known for quality, reliability and innovation.
                        </p>
                    </div>
                </div>

                <div className="pt-14" style={{ borderTop: "1px solid var(--border, #E4E6E8)" }}>
                    <div className="mb-10">
                        <span
                            className="text-xs font-semibold uppercase"
                            style={{ color: "var(--gold, #D4A63A)", letterSpacing: "3px" }}
                        >
                            Our Commitment
                        </span>
                    </div>
                    <div ref={commitmentsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
                        {COMMITMENTS.map(({ label, copy }) => (
                            <div key={label} className="pl-5" style={{ borderLeft: "2px solid var(--border-gold, rgba(212,166,58,0.35))" }}>
                                <h4 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary, #102235)" }}>
                                    {label}
                                </h4>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary, #647386)" }}>
                                    {copy}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}