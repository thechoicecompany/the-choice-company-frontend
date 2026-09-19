"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

// ── Floating orb config ──────────────────────────────────────────────────────
const ORBS = [
    { size: 520, top: "-10%", left: "-8%", color: "#b8922a", delay: 0, dur: 9 },
    { size: 360, top: "55%", left: "75%", color: "#7c5c1e", delay: 1.5, dur: 11 },
    { size: 260, top: "30%", left: "60%", color: "#d4a843", delay: 0.8, dur: 8 },
    { size: 180, top: "80%", left: "15%", color: "#8b6914", delay: 2, dur: 13 },
    { size: 140, top: "10%", left: "82%", color: "#c49a30", delay: 0.4, dur: 7 },
];

// ── Dot-grid mask ────────────────────────────────────────────────────────────
function DotGrid() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
            }}
        />
    );
}

export default function CataloguePageClient({ children }: { children: ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const orbsRef = useRef<HTMLDivElement>(null);
    const heroTextRef = useRef<HTMLDivElement>(null);
    const formPanelRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // ── 1. Orb idle float ─────────────────────────────────────────────
        const orbs = orbsRef.current?.querySelectorAll<HTMLElement>(".gsap-orb") ?? [];
        orbs.forEach((orb, i) => {
            const cfg = ORBS[i];
            gsap.to(orb, {
                y: `+=${30 + i * 8}`,
                x: `+=${15 + i * 5}`,
                duration: cfg.dur,
                delay: cfg.delay,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });

        // ── 2. Hero text entrance ────────────────────────────────────────
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
            badgeRef.current,
            { opacity: 0, y: -16, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6 },
        )
            .fromTo(
                heroTextRef.current!.querySelectorAll(".gsap-line"),
                { opacity: 0, y: 40, skewY: 2 },
                { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.14 },
                "-=0.3",
            )
            .fromTo(
                heroTextRef.current!.querySelector(".gsap-sub"),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.7 },
                "-=0.4",
            )
            // ── 3. Trust pills ───────────────────────────────────────────────
            .fromTo(
                heroTextRef.current!.querySelectorAll(".gsap-pill"),
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, stagger: 0.12, duration: 0.5 },
                "-=0.3",
            )
            // ── 4. Form panel rise ───────────────────────────────────────────
            .fromTo(
                formPanelRef.current,
                { opacity: 0, y: 56, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: "expo.out" },
                "-=0.5",
            );
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative min-h-[100dvh] overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0d0c0b 0%, #181410 40%, #1e1608 70%, #0d0c0b 100%)" }}
        >
            {/* ── Ambient orbs ── */}
            <div ref={orbsRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                {ORBS.map((orb, i) => (
                    <div
                        key={i}
                        className="gsap-orb absolute rounded-full"
                        style={{
                            width: orb.size,
                            height: orb.size,
                            top: orb.top,
                            left: orb.left,
                            background: `radial-gradient(circle at 35% 35%, ${orb.color}55, transparent 70%)`,
                            filter: "blur(60px)",
                        }}
                    />
                ))}
            </div>

            {/* ── Dot grid ── */}
            <DotGrid />

            {/* ── Thin gold horizontal rule ── */}
            <div
                aria-hidden
                className="pointer-events-none absolute left-0 right-0"
                style={{ top: "50%", height: 1, background: "linear-gradient(90deg, transparent, rgba(184,146,42,0.18), transparent)" }}
            />

            {/* ── Page layout: split left/right ── */}
            {/* <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 py-20 lg:py-0 min-h-[100dvh] flex flex-col lg:flex-row lg:items-center gap-16 lg:gap-24"> */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 py-20 lg:py-0 min-h-[100dvh] flex flex-col lg:flex-row lg:items-start gap-16 lg:gap-24">

                {/* ── LEFT: Hero copy ── */}
                <div ref={heroTextRef} className="flex-1 lg:max-w-[480px] flex flex-col gap-6 pt-8 lg:pt-28">
                    {/* Badge */}
                    <div ref={badgeRef} className="inline-flex items-center gap-2 self-start">                        <span
                        className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border"
                        style={{ color: "#d4a843", borderColor: "rgba(184,146,42,0.35)", background: "rgba(184,146,42,0.08)" }}
                    >
                        Corporate Gifting
                    </span>
                    </div>

                    {/* Headline — two animated lines */}
                    <div className="overflow-hidden">
                        <h1
                            className="gsap-line text-5xl md:text-6xl font-bold leading-none tracking-tighter text-white"
                            style={{ fontFamily: "var(--font-playfair)" }}
                        >
                            Get Our
                        </h1>
                    </div>
                    <div className="overflow-hidden -mt-3">
                        <h1
                            className="gsap-line text-5xl md:text-6xl font-bold leading-none tracking-tighter"
                            style={{ fontFamily: "var(--font-playfair)", color: "#d4a843" }}
                        >
                            Full Catalogue
                        </h1>
                    </div>

                    {/* Sub-copy */}
                    <p className="gsap-sub text-base leading-relaxed max-w-[42ch]" style={{ color: "rgba(255,255,255,0.55)" }}>
                        Share a few details about what you need — curated gift sets, branded merchandise, or festive hampers — and download the complete catalogue instantly.
                    </p>

                    {/* Trust pills */}
                    <div className="flex flex-wrap gap-3 mt-2">
                        {[
                            { icon: "✦", label: "50+ minimum quantity" },
                            { icon: "✦", label: "Custom branding available" },
                            { icon: "✦", label: "Pan-India delivery" },
                        ].map((pill) => (
                            <div
                                key={pill.label}
                                className="gsap-pill flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border"
                                style={{
                                    color: "rgba(255,255,255,0.65)",
                                    borderColor: "rgba(255,255,255,0.12)",
                                    background: "rgba(255,255,255,0.04)",
                                }}
                            >
                                <span style={{ color: "#b8922a" }}>{pill.icon}</span>
                                {pill.label}
                            </div>
                        ))}
                    </div>

                    {/* Decorative vertical rule + stat */}
                    <div className="hidden lg:flex items-stretch gap-5 mt-4">
                        <div className="w-px self-stretch" style={{ background: "rgba(184,146,42,0.3)" }} />
                        <div>
                            <div className="text-3xl font-bold text-white">500+</div>
                            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                                Brands trust The Choice Company
                            </div>
                        </div>
                    </div>
                </div>
                {/* ── RIGHT: Form panel ── */}
                <div ref={formPanelRef} className="flex-1 lg:max-w-[560px] w-full lg:py-16">                    <div
                    className="rounded-3xl p-7 md:p-9 border"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(255,255,255,0.10)",
                        backdropFilter: "blur(24px) saturate(150%)",
                        WebkitBackdropFilter: "blur(24px) saturate(150%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 32px 64px -20px rgba(0,0,0,0.6)",
                    }}
                >
                    {/* Panel header */}
                    <div className="mb-7 pb-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#b8922a" }}>
                            Step 1 of 1
                        </p>
                        <h2 className="text-xl font-semibold text-white">Your Details</h2>
                        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                            Download begins right after you submit.
                        </p>
                    </div>

                    {children}
                </div>
                </div>
            </div>
        </div>
    );
}