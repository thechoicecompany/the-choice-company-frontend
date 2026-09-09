import { useState, useEffect, useCallback, useRef } from "react";
import { getActiveBanners } from "@/lib/api/admin/heroBanners";
import type { HeroBanner } from "@/lib/types/heroBanner.types";

const INTERVAL_MS = 5000;

export function useHeroBannerCarousel() {
    const [slides, setSlides] = useState<HeroBanner[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Fetch live slides on mount
    useEffect(() => {
        getActiveBanners()
            .then((data) => setSlides(data))
            .finally(() => setLoading(false));
    }, []);

    // Reset active index if slides shrink (e.g. after delete)
    useEffect(() => {
        if (slides.length > 0 && activeIndex >= slides.length) {
            setActiveIndex(0);
        }
    }, [slides.length, activeIndex]);

    const goTo = useCallback(
        (index: number) => {
            if (animating || slides.length === 0) return;
            setAnimating(true);
            setTimeout(() => {
                setActiveIndex(index);
                setAnimating(false);
            }, 300);
        },
        [animating, slides.length]
    );

    const goNext = useCallback(
        () => goTo((activeIndex + 1) % Math.max(slides.length, 1)),
        [goTo, activeIndex, slides.length]
    );

    const goPrev = useCallback(
        () => goTo((activeIndex - 1 + Math.max(slides.length, 1)) % Math.max(slides.length, 1)),
        [goTo, activeIndex, slides.length]
    );

    const startTimer = useCallback(() => {
        if (slides.length <= 1) return; // no point cycling a single slide
        timerRef.current = setInterval(goNext, INTERVAL_MS);
    }, [goNext, slides.length]);

    const stopTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        startTimer();
        return stopTimer;
    }, [startTimer, stopTimer]);

    return {
        slides,
        loading,
        activeIndex,
        animating,
        currentSlide: slides[activeIndex] ?? null,
        goTo,
        goNext,
        goPrev,
        pauseTimer: stopTimer,
        resumeTimer: startTimer,
    };
}