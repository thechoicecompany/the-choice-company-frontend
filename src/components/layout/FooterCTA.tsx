"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle, FileText, CalendarCheck, Gift } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FooterCTA() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const giftRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-left", {
        opacity: 0, y: 30, duration: 0.8,
        scrollTrigger: { trigger: ctaRef.current, start: "top 88%" },
      });
      gsap.from(".cta-right", {
        opacity: 0, y: 20, duration: 0.7, delay: 0.2,
        scrollTrigger: { trigger: ctaRef.current, start: "top 88%" },
      });
      gsap.from(giftRef.current, {
        scale: 0.9, opacity: 0, duration: 0.9, delay: 0.4, ease: "power2.out",
        scrollTrigger: { trigger: ctaRef.current, start: "top 88%" },
      });
      gsap.to(giftRef.current, {
        y: -8, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.5,
      });
    },
    { scope: ctaRef }
  );

  return (
    <div
      ref={ctaRef}
      style={{
        borderTop: "1px solid #D4A63A",
        borderBottom: "1px solid rgba(212,166,58,0.35)",
        background: "#071827",
      }}
    >
      {/* Desktop layout: 3 zones — left text | center buttons | right gift */}
      <div
        className="hidden lg:grid"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "36px 40px",
          gridTemplateColumns: "1fr auto auto",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Zone 1 — Text */}
        <div className="cta-left flex items-center gap-5 min-w-0">
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 56, height: 56,
              border: "1px solid rgba(212,166,58,0.45)",
              background: "rgba(212,166,58,0.08)",
            }}
          >
            <Gift size={24} color="#D4A63A" />
          </div>
          <div className="min-w-0">
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "3px",
              color: "#D4A63A", textTransform: "uppercase", marginBottom: 4,
            }}>
              Let's Connect
            </p>
            <h2 style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(24px, 2.8vw, 40px)",
              fontWeight: 500, color: "#FFFFFF", lineHeight: 1.15, margin: 0,
            }}>
              Let's create something{" "}
              <span style={{ color: "#D4A63A" }}>memorable.</span>
            </h2>
            <p style={{ color: "#AEB9C5", fontSize: 15, marginTop: 6, margin: "6px 0 0" }}>
              Premium corporate gifting, thoughtfully customized for your business.
            </p>
          </div>
        </div>

        {/* Zone 2 — Buttons */}
        <div className="cta-right flex items-center gap-3 flex-shrink-0">
          <CTAButtons />
        </div>

        {/* Zone 3 — Gift box */}
        <div ref={giftRef} className="flex flex-col items-center flex-shrink-0" style={{ width: 140 }}>
          <GiftBoxSVG />
          <p style={{
            fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
            fontSize: 12, color: "#D4A63A", fontStyle: "italic",
            textAlign: "center", marginTop: 8, lineHeight: 1.5,
          }}>
            Thoughtful Gifts<br />Stronger Relationships
          </p>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden" style={{ padding: "32px 24px" }}>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 48, height: 48,
              border: "1px solid rgba(212,166,58,0.45)",
              background: "rgba(212,166,58,0.08)",
            }}
          >
            <Gift size={20} color="#D4A63A" />
          </div>
          <div>
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "3px",
              color: "#D4A63A", textTransform: "uppercase", marginBottom: 2,
            }}>
              Let's Connect
            </p>
            <h2 style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
              fontSize: 26, fontWeight: 500, color: "#FFFFFF", lineHeight: 1.2, margin: 0,
            }}>
              Let's create something{" "}
              <span style={{ color: "#D4A63A" }}>memorable.</span>
            </h2>
          </div>
        </div>
        <p style={{ color: "#AEB9C5", fontSize: 14, marginBottom: 24 }}>
          Premium corporate gifting, thoughtfully customized for your business.
        </p>
        <div className="flex flex-col gap-3">
          <MobileButton href="https://wa.me/916268899194" bg="#22C76F" color="#fff" external>
            <MessageCircle size={17} /> WhatsApp →
          </MobileButton>
          <MobileButton href="/get-quote" bg="#D4A63A" color="#071827">
            <FileText size={17} /> Get Quote →
          </MobileButton>
          <MobileButton href="/contact" bg="transparent" color="#fff" bordered>
            <CalendarCheck size={17} /> Book Meeting →
          </MobileButton>
        </div>
      </div>
    </div>
  );
}

function CTAButtons() {
  return (
    <>

      <a href="https://wa.me/916268899194"
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        style={{
          height: 50, padding: "0 22px", borderRadius: 10,
          background: "#22C76F", color: "#fff", fontWeight: 600, fontSize: 14,
          textDecoration: "none", whiteSpace: "nowrap",
        }}
      >
        <MessageCircle size={16} /> WhatsApp →
      </a >

      <a href="/get-quote"
        className="flex items-center gap-2 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        style={{
          height: 50, padding: "0 22px", borderRadius: 10,
          background: "#D4A63A", color: "#071827", fontWeight: 600, fontSize: 14,
          textDecoration: "none", whiteSpace: "nowrap",
          boxShadow: "0 8px 25px rgba(212,166,58,0.20)",
        }
        }
      >
        <FileText size={16} /> Get Quote →
      </a >

      <a href="/contact"
        className="flex items-center gap-2 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        style={{
          height: 50, padding: "0 22px", borderRadius: 10,
          background: "transparent", border: "1px solid #566675",
          color: "#fff", fontWeight: 600, fontSize: 14,
          textDecoration: "none", whiteSpace: "nowrap",
        }}
      >
        <CalendarCheck size={16} /> Book Meeting →
      </a >
    </>
  );
}

function MobileButton({
  href, bg, color, children, bordered, external,
}: {
  href: string; bg: string; color: string; children: React.ReactNode;
  bordered?: boolean; external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center justify-center gap-2"
      style={{
        height: 50, borderRadius: 10, background: bg, color,
        fontWeight: 600, fontSize: 14, textDecoration: "none",
        border: bordered ? "1px solid #566675" : "none",
      }
      }
    >
      {children}
    </a >
  );
}

function GiftBoxSVG() {
  return (
    <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" width={120}>
      <rect x="15" y="70" width="110" height="80" rx="4" fill="#0B2031" stroke="#D4A63A" strokeWidth="1.5" />
      <rect x="10" y="55" width="120" height="22" rx="4" fill="#0B2031" stroke="#D4A63A" strokeWidth="1.5" />
      <rect x="62" y="55" width="16" height="22" fill="rgba(212,166,58,0.35)" />
      <rect x="62" y="70" width="16" height="80" fill="rgba(212,166,58,0.25)" />
      <rect x="15" y="105" width="110" height="14" fill="rgba(212,166,58,0.25)" />
      <ellipse cx="57" cy="52" rx="22" ry="14" fill="#D4A63A" transform="rotate(-30 57 52)" />
      <ellipse cx="57" cy="52" rx="16" ry="9" fill="#0B2031" transform="rotate(-30 57 52)" />
      <ellipse cx="83" cy="52" rx="22" ry="14" fill="#D4A63A" transform="rotate(30 83 52)" />
      <ellipse cx="83" cy="52" rx="16" ry="9" fill="#0B2031" transform="rotate(30 83 52)" />
      <circle cx="70" cy="55" r="8" fill="#D4A63A" />
      <circle cx="70" cy="55" r="4" fill="#F2C96B" />
      <path d="M62 68 Q55 80 50 88" stroke="#D4A63A" strokeWidth="4" strokeLinecap="round" />
      <path d="M78 68 Q85 80 90 88" stroke="#D4A63A" strokeWidth="4" strokeLinecap="round" />
      <text x="70" y="100" textAnchor="middle" fill="#D4A63A" fontSize="7" fontWeight="600" letterSpacing="1" fontFamily="sans-serif">THE CHOICE</text>
      <text x="70" y="112" textAnchor="middle" fill="#D4A63A" fontSize="7" fontWeight="600" letterSpacing="1" fontFamily="sans-serif">COMPANY</text>
    </svg>
  );
}