"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealVariant =
  | "fadeUp"
  | "fadeIn"
  | "fadeLeft"
  | "fadeRight"
  | "scaleUp"
  | "staggerChildren";

interface ScrollRevealWrapperProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  /** CSS selector for staggered children (used with "staggerChildren") */
  childSelector?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

const VARIANTS: Record<
  RevealVariant,
  { from: gsap.TweenVars; to: gsap.TweenVars }
> = {
  fadeUp: {
    from: { opacity: 0, y: 48, willChange: "transform, opacity" },
    to: { opacity: 1, y: 0, ease: "power3.out" },
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, ease: "power2.out" },
  },
  fadeLeft: {
    from: { opacity: 0, x: -40, willChange: "transform, opacity" },
    to: { opacity: 1, x: 0, ease: "power3.out" },
  },
  fadeRight: {
    from: { opacity: 0, x: 40, willChange: "transform, opacity" },
    to: { opacity: 1, x: 0, ease: "power3.out" },
  },
  scaleUp: {
    from: {
      opacity: 0,
      scale: 0.88,
      willChange: "transform, opacity",
    },
    to: { opacity: 1, scale: 1, ease: "back.out(1.4)" },
  },
  staggerChildren: {
    from: { opacity: 0, y: 32, willChange: "transform, opacity" },
    to: { opacity: 1, y: 0, ease: "power3.out" },
  },
};

export default function ScrollRevealWrapper({
  children,
  variant = "fadeUp",
  childSelector,
  stagger = 0.1,
  delay = 0,
  duration = 0.75,
  threshold = 0.15,
  className = "",
  once = true,
}: ScrollRevealWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const v = VARIANTS[variant];

      if (variant === "staggerChildren" && childSelector) {
        const targets = el.querySelectorAll(childSelector);
        gsap.fromTo(targets, v.from, {
          ...v.to,
          duration,
          delay,
          stagger,
          scrollTrigger: {
            trigger: el,
            start: `top ${Math.round((1 - threshold) * 100)}%`,
            once,
            toggleActions: once
              ? "play none none none"
              : "play none none reverse",
          },
        });
      } else {
        gsap.fromTo(el, v.from, {
          ...v.to,
          duration,
          delay,
          scrollTrigger: {
            trigger: el,
            start: `top ${Math.round((1 - threshold) * 100)}%`,
            once,
            toggleActions: once
              ? "play none none none"
              : "play none none reverse",
          },
        });
      }
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}