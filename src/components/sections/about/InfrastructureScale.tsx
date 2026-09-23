"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const METRICS = [
    { label: "Production Capacity", value: "50,000+/mo" },
    { label: "Manufacturing Units", value: "3" },
    { label: "QC Checkpoints", value: "5-stage" },
    { label: "Logistics Partners", value: "15+" },
    { label: "States Covered", value: "28+ UTs" },
    { label: "Rush Order TAT", value: "5–7 days" },
];



export default function InfrastructureScale({
    imageSrc = "/Warehouse.png",
}: {
    imageSrc?: string;
}) {
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLUListElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                if (gridRef.current) {
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
                }

                if (overlayRef.current) {
                    gsap.fromTo(
                        overlayRef.current.children,
                        { opacity: 0, x: -10 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.4,
                            stagger: 0.08,
                            ease: "power2.out",
                            scrollTrigger: { trigger: overlayRef.current, start: "top 85%", once: true },
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span
                            className="block text-xs font-semibold uppercase"
                            style={{ color: "var(--gold, #D4A63A)", letterSpacing: "3px" }}
                        >
                            Capabilities
                        </span>
                        <h2
                            className="font-playfair font-bold mt-2 mb-4"
                            style={{ color: "var(--text-primary, #102235)", fontSize: "32px" }}
                        >
                            Infrastructure &amp; Scale
                        </h2>
                        <p
                            className="leading-relaxed max-w-2xl mb-8"
                            style={{ color: "var(--text-secondary, #647386)" }}
                        >
                            Three manufacturing units, a five-stage quality check on every
                            batch, and a logistics network built to move large, time-sensitive
                            corporate gifting orders without last-mile surprises.
                        </p>

                        <div
                            ref={gridRef}
                            className="grid grid-cols-2 md:grid-cols-3"
                            style={{ borderTop: "1px solid var(--border, #DDE1E5)", borderLeft: "1px solid var(--border, #DDE1E5)" }}
                        >
                            {METRICS.map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="p-6 flex flex-col justify-between min-h-[120px]"
                                    style={{
                                        borderRight: "1px solid var(--border, #DDE1E5)",
                                        borderBottom: "1px solid var(--border, #DDE1E5)",
                                        background: "var(--white, #FFFFFF)",
                                    }}
                                >
                                    <div
                                        className="font-playfair font-bold whitespace-nowrap"
                                        style={{ color: "var(--navy, #071827)", fontSize: "26px" }}
                                    >
                                        {value}
                                    </div>
                                    <div className="text-xs uppercase tracking-wide mt-3" style={{ color: "var(--text-secondary, #647386)" }}>
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                        <Image
                            src={imageSrc}
                            alt="Warehouse team member preparing a corporate gifting order"
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}