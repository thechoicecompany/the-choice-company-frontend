"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileText, CalendarClock, Gift } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.92C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.22 8.22 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.26-8.24 2.2 0 4.28.86 5.83 2.42a8.18 8.18 0 0 1 2.42 5.83c0 4.55-3.7 8.24-8.26 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.47-.01-.17 0-.43.06-.66.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.71.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.67-1.19.21-.58.21-1.08.14-1.19-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

export default function CtaBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16"
      style={{ background: "var(--navy)" }}
    >
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--gold) 20%, var(--gold) 80%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full opacity-20 motion-safe:animate-[pulse_6s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
      />

      <div className="container-site relative flex flex-col md:flex-row items-center justify-between gap-10">
        <div
          className="flex items-center gap-5 transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.35)" }}
          >
            <Gift className="h-6 w-6" style={{ color: "var(--gold)" }} strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-white">
              Need corporate gifts?
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Let's build something memorable, together.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* WhatsApp — real brand mark, brand green */}
          <a
            href="https://wa.me/916268899194"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-md rounded-lg font-medium inline-flex items-center gap-1 text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
            style={{
              background: "#25D366",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transitionDelay: "0ms",
            }}
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp
          </a>

          {/* Get quote */}
          <Link
            href="/bulk-orders#inquiry-form"
            className="btn-gold rounded-lg font-medium inline-flex items-center gap-2 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transitionDelay: "80ms",
            }}
          >
            <FileText className="h-4 w-4" strokeWidth={2} />
            Get quote
          </Link>

          {/* Book meeting */}
          <Link
            href="/contact"
            className="btn-md rounded-lg font-medium inline-flex items-center gap-2 text-white border transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-lg hover:shadow-black/30"
            style={{
              borderColor: "rgba(255,255,255,0.45)",
              background: "rgba(255,255,255,0.04)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transitionDelay: "160ms",
            }}
          >
            <CalendarClock className="h-4 w-4" strokeWidth={2} color="currentColor" />
            Book meeting
          </Link>
        </div>
      </div>
    </section >
  );
}