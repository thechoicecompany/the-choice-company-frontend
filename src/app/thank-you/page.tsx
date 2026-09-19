"use client";

import { Suspense, useLayoutEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";

function ThankYouContent() {
  const p = useSearchParams();
  const ref = p.get("ref") || "TCC-2026-00000";
  const company = p.get("company") || "Your Company";

  const ringOuterRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<SVGPathElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!checkRef.current || !particlesRef.current) return;

    const path = checkRef.current;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    // Build a small ring of particles once, for the celebratory burst.
    particlesRef.current.innerHTML = "";
    const colors = ["var(--gold)", "var(--teal)", "var(--navy)"];
    const particleEls: HTMLDivElement[] = [];
    for (let i = 0; i < 10; i++) {
      const dot = document.createElement("div");
      dot.style.position = "absolute";
      dot.style.top = "50%";
      dot.style.left = "50%";
      dot.style.width = "6px";
      dot.style.height = "6px";
      dot.style.marginLeft = "-3px";
      dot.style.marginTop = "-3px";
      dot.style.borderRadius = "50%";
      dot.style.background = colors[i % colors.length];
      dot.style.opacity = "0";
      particlesRef.current.appendChild(dot);
      particleEls.push(dot);
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      ringOuterRef.current,
      { scale: 0.4, opacity: 0 },
      { scale: 1, opacity: 0.35, duration: 0.7, ease: "power2.out" }
    )
      .fromTo(
        ringInnerRef.current,
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 0.5, duration: 0.6, ease: "power2.out" },
        "<0.05"
      )
      .fromTo(
        badgeRef.current,
        { scale: 0, rotate: -20, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.55, ease: "back.out(2.2)" },
        "<0.1"
      )
      .to(path, { strokeDashoffset: 0, duration: 0.45, ease: "power1.inOut" }, "-=0.15")
      .to(
        particleEls,
        {
          opacity: 1,
          x: () => gsap.utils.random(-70, 70),
          y: () => gsap.utils.random(-70, 70),
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.02,
        },
        "-=0.2"
      )
      .to(particleEls, { opacity: 0, duration: 0.4 }, "-=0.1")
      .fromTo(
        headingRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.35"
      )
      .fromTo(
        subRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        "-=0.3"
      )
      .fromTo(
        cardRef.current,
        { y: 20, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5 },
        "-=0.25"
      )
      .fromTo(
        actionsRef.current ? actionsRef.current.children : [],
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
        "-=0.2"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="min-h-screen section-py" style={{ background: "var(--cream)" }}>
      <div className="container-site max-w-2xl mx-auto text-center">
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div
            ref={ringOuterRef}
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid var(--teal)" }}
          />
          <div
            ref={ringInnerRef}
            className="absolute inset-2 rounded-full"
            style={{ border: "2px solid var(--gold)" }}
          />
          <div
            ref={badgeRef}
            className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "var(--teal)" }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
              <path
                ref={checkRef}
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
        </div>

        <h1 ref={headingRef} className="font-playfair text-3xl font-bold text-navy mb-3">
          Inquiry submitted
        </h1>
        <p ref={subRef} className="text-gray-500 mb-8">
          Thank you, <strong className="text-navy">{company}</strong>. Our team will contact you within 24 hours.
        </p>

        <div ref={cardRef} className="card p-6 mb-8 border-2 border-gold/30">
          <p className="text-xs font-semibold text-gray-500 tracking-wide mb-2">
            Your inquiry reference
          </p>
          <div className="font-playfair text-3xl font-bold text-navy">{ref}</div>
        </div>

        <div ref={actionsRef} className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/916268899194?text=Ref: ${ref}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-md text-white rounded-lg inline-flex items-center gap-2"
              style={{ background: "#25D366" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.63 1.44 5.15L2 22l5.13-1.55a9.8 9.8 0 0 0 4.9 1.32h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.41 1.3-1.94 1.38-.5.08-1.14.11-1.83-.12-.42-.14-.96-.32-1.65-.63-2.9-1.26-4.79-4.18-4.93-4.38-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.4.27-.28.59-.35.79-.35h.57c.18 0 .43-.07.67.51.25.6.85 2.08.92 2.23.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.29.77 1.26 1.65 2.05 1.13 1 2.09 1.32 2.38 1.47.29.15.46.13.63-.05.17-.18.71-.83.9-1.12.19-.29.38-.24.63-.15.25.1 1.59.75 1.86.89.27.14.46.21.53.32.07.11.07.65-.17 1.33Z" />
              </svg>
              Message us on WhatsApp
            </a>
            <Link href="/products" className="btn-outline-navy">
              Browse more products
            </Link>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-navy transition-colors underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
          <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}