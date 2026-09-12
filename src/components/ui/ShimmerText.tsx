"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ShimmerTextProps {
    children: string;
    as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
    className?: string;
    /** Color stops for the shimmer gradient */
    colors?: string[];
    duration?: number;
}

export default function ShimmerText({
    children,
    as: Tag = "span",
    className = "",
    colors = ["#C89B3C", "#F0CC7A", "#C89B3C", "#8B6A1F", "#C89B3C"],
    duration = 3,
}: ShimmerTextProps) {
    const ref = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const el = ref.current;
            if (!el) return;

            gsap.to(el, {
                backgroundPosition: "200% center",
                duration,
                ease: "none",
                repeat: -1,
            });
        },
        { scope: ref }
    );

    const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;

    return (
        <Tag
            ref={ref as React.RefObject<HTMLHeadingElement>}
            className={className}
            style={{
                background: gradient,
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundPosition: "0% center",
                willChange: "background-position",
            }}
        >
            {children}
        </Tag>
    );
}