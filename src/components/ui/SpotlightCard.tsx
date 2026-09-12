"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderRadius?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(200,155,60,0.15)",
  borderRadius = "1rem",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: cardRef });

  const onMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(spot, {
      "--x": `${x}px`,
      "--y": `${y}px`,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const onMouseLeave = contextSafe(() => {
    const spot = spotRef.current;
    if (!spot) return;
    gsap.to(spot, { opacity: 0, duration: 0.4 });
  });

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius }}
    >
      {/* Spotlight overlay */}
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 opacity-0 will-change-transform"
        style={{
          borderRadius,
          background: `radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), ${spotlightColor}, transparent 60%)`,
          // CSS custom property animation — set via GSAP
          ["--x" as string]: "50%",
          ["--y" as string]: "50%",
        }}
      />
      {children}
    </div>
  );
}