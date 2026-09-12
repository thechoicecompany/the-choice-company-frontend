"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface MarqueeStripProps {
    items: { icon: React.ReactNode; text: string }[];
    speed?: number; // px per second
    direction?: "left" | "right";
    className?: string;
    pauseOnHover?: boolean;
}

export default function MarqueeStrip({
    items,
    speed = 60,
    direction = "left",
    className = "",
    pauseOnHover = true,
}: MarqueeStripProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    useGSAP(
        () => {
            const track = trackRef.current;
            if (!track) return;

            const totalWidth = track.scrollWidth / 2; // duplicated content
            const duration = totalWidth / speed;

            tweenRef.current = gsap.to(track, {
                x: direction === "left" ? -totalWidth : totalWidth,
                duration,
                ease: "none",
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
                },
            });
        },
        { scope: trackRef }
    );

    const handleMouseEnter = () => {
        if (pauseOnHover && tweenRef.current) tweenRef.current.pause();
    };
    const handleMouseLeave = () => {
        if (pauseOnHover && tweenRef.current) tweenRef.current.resume();
    };

    // Duplicate items for seamless loop
    const doubled = [...items, ...items];

    return (
        <div
            className={`overflow-hidden ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={trackRef}
                className="flex items-center gap-0 will-change-transform"
                style={{ width: "max-content" }}
            >
                {doubled.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 px-8 py-3 text-sm font-medium text-white/70 whitespace-nowrap border-r border-white/10 last:border-0"
                    >
                        <span className="flex-shrink-0 opacity-70">{item.icon}</span>
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}