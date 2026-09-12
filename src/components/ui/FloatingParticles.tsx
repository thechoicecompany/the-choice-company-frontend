"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface Particle {
    x: number;
    y: number;
    size: number;
    opacity: number;
    duration: number;
    delay: number;
    color: string;
}

interface FloatingParticlesProps {
    count?: number;
    className?: string;
    colors?: string[];
}

export default function FloatingParticles({
    count = 18,
    className = "",
    colors = ["#C89B3C", "#1A5C4A", "#0D1B2A"],
}: FloatingParticlesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<gsap.core.Tween[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Generate random particles
        const particles: Particle[] = Array.from({ length: count }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.25 + 0.05,
            duration: Math.random() * 6 + 4,
            delay: Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));

        // Create DOM elements and animate
        particles.forEach((p) => {
            const dot = document.createElement("div");
            dot.style.cssText = `
        position: absolute;
        left: ${p.x}%;
        top: ${p.y}%;
        width: ${p.size}px;
        height: ${p.size}px;
        border-radius: 50%;
        background: ${p.color};
        opacity: ${p.opacity};
        pointer-events: none;
        will-change: transform, opacity;
      `;
            container.appendChild(dot);

            // Float animation
            const tween = gsap.to(dot, {
                y: -40 - Math.random() * 40,
                x: (Math.random() - 0.5) * 30,
                opacity: 0,
                duration: p.duration,
                delay: p.delay,
                ease: "power1.inOut",
                repeat: -1,
                yoyo: true,
            });

            particlesRef.current.push(tween);
        });

        return () => {
            particlesRef.current.forEach((t) => t.kill());
            particlesRef.current = [];
            // Remove all children
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        };
    }, [count, colors]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
            aria-hidden="true"
        />
    );
}