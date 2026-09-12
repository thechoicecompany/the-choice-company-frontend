"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  as?: "button" | "a";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  onClick,
  href,
  as = "button",
  type = "button",
  disabled,
  style,
  target,
  rel,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const onMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(inner, {
      x: deltaX,
      y: deltaY,
      duration: 0.4,
      ease: "power2.out",
    });
  });

  const onMouseLeave = contextSafe(() => {
    const inner = innerRef.current;
    if (!inner) return;
    gsap.to(inner, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  });

  const onMouseDown = contextSafe(() => {
    const inner = innerRef.current;
    if (!inner) return;
    gsap.to(inner, { scale: 0.96, duration: 0.1, ease: "power2.in" });
  });

  const onMouseUp = contextSafe(() => {
    const inner = innerRef.current;
    if (!inner) return;
    gsap.to(inner, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });
  });

  const Tag = as as React.ElementType;

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className="inline-block"
    >
      <div ref={innerRef} className="inline-block will-change-transform">
        <Tag
          href={href}
          type={as === "button" ? type : undefined}
          onClick={onClick}
          disabled={disabled}
          className={className}
          style={style}
          target={target}
          rel={rel}
        >
          {children}
        </Tag>
      </div>
    </div>
  );
}