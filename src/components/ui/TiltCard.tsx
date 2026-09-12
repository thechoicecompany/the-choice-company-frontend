"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    maxTilt?: number;     // degrees
    perspective?: number; // px
    scale?: number;
    glare?: boolean;
}

export default function TiltCard({
    children,
    className = "",
    maxTilt = 8,
    perspective = 800,
    scale = 1.02,
    glare = true,
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: cardRef });

    const onMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const px = (e.clientX - cx) / (rect.width / 2);  // -1 to 1
        const py = (e.clientY - cy) / (rect.height / 2); // -1 to 1

        const rotateY = px * maxTilt;
        const rotateX = -py * maxTilt;

        gsap.to(card, {
            rotateX,
            rotateY,
            scale,
            transformPerspective: perspective,
            duration: 0.35,
            ease: "power2.out",
            transformOrigin: "center center",
        });

        if (glare && glareRef.current) {
            const glareX = (px + 1) / 2 * 100; // 0–100%
            const glareY = (py + 1) / 2 * 100;
            gsap.to(glareRef.current, {
                opacity: 0.12,
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.6) 0%, transparent 60%)`,
                duration: 0.3,
            });
        }
    });

    const onMouseLeave = contextSafe(() => {
        const card = cardRef.current;
        if (!card) return;

        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
        });

        if (glare && glareRef.current) {
            gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
        }
    });

    return (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`relative will-change-transform ${className}`}
            style={{ transformStyle: "preserve-3d" }}
        >
            {children}
            {glare && (
                <div
                    ref={glareRef}
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-0"
                    style={{ zIndex: 2 }}
                />
            )}
        </div>
    );
}