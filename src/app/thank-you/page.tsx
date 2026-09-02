"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ThankYouContent() {
  const p = useSearchParams();
  const ref = p.get("ref") || "TCC-2026-00000";
  const company = p.get("company") || "Your Company";
  return (
    <div className="min-h-screen section-py" style={{ background: "var(--cream)" }}>
      <div className="container-site max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 anim-fade-in" style={{ background: "var(--teal)" }}>
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="font-playfair text-3xl font-bold text-navy mb-3">Inquiry Submitted!</h1>
        <p className="text-gray-500 mb-8">Thank you, <strong className="text-navy">{company}</strong>. Our team will contact you within 24 hours.</p>
        <div className="card p-6 mb-8 border-2 border-gold/30">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Your Inquiry Reference</p>
          <div className="font-playfair text-3xl font-bold text-navy">{ref}</div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={`https://wa.me/916268899194?text=Ref: ${ref}`} target="_blank" rel="noopener noreferrer"
            className="btn-md text-white rounded-lg" style={{ background: "#25D366" }}>💬 WhatsApp</a>
          <Link href="/products" className="btn-outline-navy">🛍 Browse More</Link>
          <Link href="/" className="btn-outline-navy">← Home</Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}