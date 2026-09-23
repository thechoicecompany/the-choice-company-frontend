"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroBanner } from "@/lib/types/heroBanner.types";

const INTERVAL_MS = 5000;

interface Props {
    initialBanners: HeroBanner[];
}

export default function HeroBannerClient({ initialBanners }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const slides = initialBanners; // stable reference — no state needed

    const goTo = useCallback(
        (index: number) => {
            if (animating || slides.length <= 1) return;
            setAnimating(true);
            setTimeout(() => {
                setActiveIndex(index);
                setAnimating(false);
            }, 300);
        },
        [animating, slides.length]
    );

    const goNext = useCallback(
        () => goTo((activeIndex + 1) % slides.length),
        [goTo, activeIndex, slides.length]
    );

    const goPrev = useCallback(
        () => goTo((activeIndex - 1 + slides.length) % slides.length),
        [goTo, activeIndex, slides.length]
    );

    const startTimer = useCallback(() => {
        if (slides.length <= 1) return;
        timerRef.current = setInterval(goNext, INTERVAL_MS);
    }, [goNext, slides.length]);

    const stopTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        startTimer();
        return stopTimer;
    }, [startTimer, stopTimer]);

    const currentSlide = slides[activeIndex];

    return (
        <section
            className="relative w-full overflow-hidden bg-[#f7f5f0]"
            style={{ aspectRatio: "3 / 1" }}
            onMouseEnter={stopTimer}
            onMouseLeave={startTimer}
            aria-roledescription="carousel"
            aria-label="Featured offers"
        >
            {/* Slide */}
            <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: animating ? 0 : 1 }}
            >
                <Poster
                    slide={currentSlide}
                    // priority=true on the FIRST slide only — tells Next.js to
                    // inject <link rel="preload"> for this image in <head>.
                    // Server already knows this URL so the preload fires before
                    // any client JS runs — this is the LCP fix.
                    priority={activeIndex === 0}
                />
            </div>

            {/* Controls — only when more than 1 slide */}
            {slides.length > 1 && (
                <>


                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                aria-label={`Go to poster ${i + 1}`}
                                aria-current={i === activeIndex}
                                style={{
                                    width: i === activeIndex ? "28px" : "8px",
                                    height: "8px",
                                    borderRadius: "9999px",
                                    background: i === activeIndex
                                        ? "var(--gold)"
                                        : "rgba(255,255,255,0.7)",
                                    transition: "all 0.3s ease",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

// ── Poster ────────────────────────────────────────────────────────────────────

function Poster({ slide, priority }: { slide: HeroBanner; priority?: boolean }) {
    const altText = `${slide.headlineTop} ${slide.headlineBottom}`.trim();

    const img = (
        <Image
            src={slide.imageUrl}
            alt={altText}
            fill
            className="object-cover object-center"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="100vw"
            quality={85}
        />
    );

    if (!slide.ctaLink) {
        return <div className="relative w-full h-full">{img}</div>;
    }

    const isExternal = /^https?:\/\//i.test(slide.ctaLink);

    if (isExternal) {
        return (
            <a
                href={slide.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full h-full cursor-pointer"
                aria-label={altText}
            >
                {img}
            </a>
        );
    }

    return (
        <Link
            href={slide.ctaLink}
            className="relative block w-full h-full cursor-pointer"
            aria-label={altText}
        >
            {img}
        </Link>
    );
}

// ── Arrow ─────────────────────────────────────────────────────────────────────

function Arrow({ direction }: { direction: "left" | "right" }) {
    const points = direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6";
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <polyline points={points} />
        </svg>
    );
}