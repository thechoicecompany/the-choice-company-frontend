"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface NumberTickerProps {
    value: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    duration?: number;
    /** If true, formats with commas (1,000+) */
    formatted?: boolean;
}

export default function NumberTicker({
    value,
    prefix = "",
    suffix = "",
    className = "",
    duration = 2.2,
    formatted = true,
}: NumberTickerProps) {
    const numRef = useRef<HTMLSpanElement>(null);
    const wrapRef = useRef<HTMLSpanElement>(null);

    useGSAP(
        () => {
            const el = numRef.current;
            const wrap = wrapRef.current;
            if (!el || !wrap) return;

            const obj = { val: 0 };

            gsap.to(obj, {
                val: value,
                duration,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: wrap,
                    start: "top 88%",
                    once: true,
                },
                onUpdate() {
                    const v = Math.round(obj.val);
                    el.textContent = formatted
                        ? v.toLocaleString("en-IN")
                        : String(v);
                },
            });
        },
        { scope: wrapRef }
    );

    return (
        <span ref={wrapRef} className={className}>
            {prefix}
            <span ref={numRef}>0</span>
            {suffix}
        </span>
    );
}