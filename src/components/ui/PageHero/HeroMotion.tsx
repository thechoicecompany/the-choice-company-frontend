"use client";

// Tiny client component: keeps PageHero itself a server component (SEO + JSON-LD stay server-rendered).
// It finds its parent <section data-hero> and animates the marked children.

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroMotion() {
    const marker = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const scope = marker.current?.closest<HTMLElement>("[data-hero]");
        if (!scope) return;

        const mm = gsap.matchMedia(scope);

        // Only animate when the visitor hasn't asked for reduced motion.
        // (The matching CSS rule that pre-hides items lives in globals.css.)
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const items = scope.querySelectorAll("[data-hero-item]");
            const image = scope.querySelector("[data-hero-image]");
            const parallax = scope.querySelector("[data-hero-parallax]");

            // breadcrumb -> gold bar -> heading -> subtitle -> features -> tagline
            gsap.fromTo(
                items,
                { y: 25, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power3.out",
                    clearProps: "transform",
                }
            );

            // Image only settles from a slight zoom. No opacity fade, so the photo
            // is painted immediately and doesn't delay LCP.
            if (image) {
                gsap.fromTo(
                    image,
                    { scale: 1.08 },
                    { scale: 1, duration: 1.4, ease: "power3.out" }
                );
            }

            // Very slow parallax while scrolling past the hero.
            if (parallax) {
                gsap.to(parallax, {
                    yPercent: 7,
                    ease: "none",
                    scrollTrigger: {
                        trigger: scope,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            }
        });

        return () => mm.revert();
    }, []);

    return <span ref={marker} hidden aria-hidden="true" />;
}