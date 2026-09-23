"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import NumberTicker from "@/components/ui/NumberTicker";

const STATS = [
    { value: 500, suffix: "+", label: "Corporate Relationships" },
    { value: 10, suffix: "M+", label: "Gifting Units Delivered" },
    { value: 28, suffix: "+", label: "States Served" },
    { value: 1000, suffix: "+", label: "Products & Options" },
];

type Crumb = { label: string; href?: string };

export default function AboutHero({
    breadcrumbs,
    imageSrc = "/About page1.png",
}: {
    breadcrumbs: Crumb[];
    imageSrc?: string;
}) {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

                if (contentRef.current) {
                    tl.fromTo(
                        contentRef.current.children,
                        { opacity: 0, y: 24 },
                        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }
                    );
                }

                if (imageRef.current) {
                    tl.fromTo(
                        imageRef.current,
                        { opacity: 0, scale: 1.08 },
                        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
                        0.15
                    );
                }
            });

            return () => mm.revert();
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden"
            style={{ background: "var(--ivory, #FAF8F3)" }}
        >
            <div className="container-site relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-16 lg:py-24 min-h-[650px] lg:min-h-[430px]">
                {/* Left: copy */}
                <div ref={contentRef}>
                    <nav className="text-xs mb-6" style={{ color: "var(--text-secondary, #647386)" }}>
                        {breadcrumbs.map((c, i) => (
                            <span key={c.label}>
                                {c.href ? (
                                    <Link href={c.href} className="hover:opacity-70 transition-opacity">
                                        {c.label}
                                    </Link>
                                ) : (
                                    <span>{c.label}</span>
                                )}
                                {i < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                            </span>
                        ))}
                    </nav>

                    <span
                        className="text-xs font-semibold uppercase"
                        style={{ color: "var(--gold, #D4A63A)", letterSpacing: "3px" }}
                    >
                        Our Story
                    </span>

                    <h1
                        className="font-playfair font-bold mt-3 mb-4"
                        style={{ color: "var(--navy, #071827)", fontSize: "36px", lineHeight: 0.98 }}
                    >
                        About<br />The Choice Company
                    </h1>

                    <p className="text-base font-medium mb-5" style={{ color: "var(--gold, #D4A63A)" }}>
                        Corporate Gifting, Built for Meaningful Connections
                    </p>

                    <p
                        className="leading-relaxed mb-10"
                        style={{ color: "var(--text-secondary, #647386)", maxWidth: 520 }}
                    >
                        At The Choice Company, we believe that thoughtful gifts have the
                        power to strengthen relationships, build trust, and create
                        lasting impressions for businesses.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                        {STATS.map(({ value, suffix, label }, i) => (
                            <div
                                key={label}
                                className="pl-6"
                                style={{ borderLeft: i === 0 ? "none" : "1px solid var(--border, #E4E6E8)" }}
                            >
                                <div
                                    className="font-playfair font-bold"
                                    style={{ color: "var(--navy, #071827)", fontSize: "28px" }}
                                >
                                    <NumberTicker value={value} suffix={suffix} formatted={false} />
                                </div>
                                <div className="text-xs mt-1 leading-snug" style={{ color: "var(--text-secondary, #647386)" }}>
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: image */}
                <div ref={imageRef} className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[5/4]">
                    <Image
                        src={imageSrc}
                        alt="A branded corporate gift box from The Choice Company"
                        fill
                        priority
                        className="object-cover"
                    />
                    {/* subtle top-right vignette so the light decorative label stays legible over the photo */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(135deg, transparent 55%, rgba(7,24,39,0.35) 100%)",
                        }}
                    />
                </div>
            </div>
        </section>
    );
}