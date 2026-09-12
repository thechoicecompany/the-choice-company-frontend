"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface CounterStatProps {
    value: number;
    prefix?: string;
    suffix?: string;
    label: string;
    duration?: number;
    decimals?: number;
    className?: string;
    labelClassName?: string;
    valueClassName?: string;
}

export default function CounterStat({
    value,
    prefix = "",
    suffix = "",
    label,
    duration = 2,
    decimals = 0,
    className = "",
    labelClassName = "text-xs text-gray-500 mt-1",
    valueClassName = "font-playfair text-3xl font-bold text-gold",
}: CounterStatProps) {
    const counterRef = useRef<HTMLSpanElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const el = counterRef.current;
            const wrap = wrapRef.current;
            if (!el || !wrap) return;

            const counter = { val: 0 };

            gsap.to(counter, {
                val: value,
                duration,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: wrap,
                    start: "top 85%",
                    once: true,
                },
                onUpdate() {
                    el.textContent = counter.val.toFixed(decimals);
                },
            });
        },
        { scope: wrapRef }
    );

    return (
        <div ref={wrapRef} className={className}>
            <div className={valueClassName}>
                {prefix}
                <span ref={counterRef}>0</span>
                {suffix}
            </div>
            <div className={labelClassName}>{label}</div>
        </div>
    );
}