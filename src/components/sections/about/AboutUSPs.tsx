"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShieldCheck, Truck, Percent, Palette, Headset, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const USPS = [
    { icon: ShieldCheck, label: "Best Product Quality", copy: "Every item vetted before it reaches your shortlist." },
    { icon: Truck, label: "Timely Delivery", copy: "Dispatch schedules built around your event or campaign date." },
    { icon: Percent, label: "Competitive Pricing", copy: "Bulk pricing without cutting corners on finish." },
    { icon: Palette, label: "Customization", copy: "Branding and presentation tailored to your requirement." },
    { icon: Headset, label: "Dedicated Support", copy: "A responsive team from inquiry to delivery for every client." },
    { icon: Award, label: "Multi-Brand Range", copy: "Official dealer for multiple leading brands." },
];

export default function AboutUSPs() {
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                if (!gridRef.current) return;
                gsap.fromTo(
                    gridRef.current.children,
                    { opacity: 0, y: 25 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.08,
                        ease: "power2.out",
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
                    <span
                        className="block text-xs font-semibold uppercase"
                        style={{ color: "var(--gold, #D4A63A)", letterSpacing: "3px" }}
                    >
                        Why Choose Us
                    </span>
                    <h2
                        className="font-playfair font-bold mt-2"
                        style={{ color: "var(--text-primary, #102235)", fontSize: "32px" }}
                    >
                        Key USPs of The Choice Company
                    </h2>
                </div>

                <div
                    ref={gridRef}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10 text-center"
                >
                    {USPS.map(({ icon: Icon, label, copy }) => (
                        <div key={label} className="flex flex-col items-center px-2">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                                style={{ border: "1px solid var(--border-gold, rgba(212,166,58,0.35))", background: "var(--ivory, #FAF8F3)" }}
                            >
                                <Icon size={22} style={{ color: "var(--gold, #D4A63A)" }} strokeWidth={1.75} />
                            </div>
                            <h3
                                className="text-sm font-bold mb-1.5 leading-snug"
                                style={{ color: "var(--text-primary, #102235)" }}
                            >
                                {label}
                            </h3>
                            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary, #647386)" }}>
                                {copy}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}