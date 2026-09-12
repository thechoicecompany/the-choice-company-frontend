"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useGSAP(() => {
    const el = overlayRef.current;
    if (!el) return;

    // Skip the wipe on initial mount — only animate on route changes
    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(el, { scaleY: 0 });
      return;
    }

    const tl = gsap.timeline();
    tl.set(el, { transformOrigin: "bottom", scaleY: 0 })
      .to(el, { scaleY: 1, duration: 0.35, ease: "power3.inOut" })
      .set(el, { transformOrigin: "top" })
      .to(el, { scaleY: 0, duration: 0.4, ease: "power3.inOut", delay: 0.05 });
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[500] will-change-transform"
      style={{ background: "var(--navy)", transform: "scaleY(0)" }}
    />
  );
}