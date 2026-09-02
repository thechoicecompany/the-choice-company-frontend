

"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const NEXT_STEPS = [
  { icon: "📧", time: "Immediately", title: "Confirmation Email", desc: "Order details & invoice sent to your email" },
  { icon: "🏭", time: "1–2 days", title: "Processing", desc: "Your sample is queued for production & quality check" },
  { icon: "🚚", time: "5–7 work days", title: "Shipped", desc: "Dispatched via courier with tracking link" },
  { icon: "📦", time: "7–10 work days", title: "Delivered", desc: "Sample delivered to your address" },
];

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "TCC-DEMO-2026-00000";
  const paymentId = params.get("paymentId") || "";

  return (
    <div className="min-h-screen section-py" style={{ background: "var(--cream)" }}>
      <div className="container-site max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 anim-fade-in"
            style={{ background: "var(--teal)" }}>
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-navy mb-3 anim-fade-up">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-500 text-base">
            Your sample purchase is confirmed. We'll deliver within 7–10 working days.
          </p>
        </div>

        <div className="card p-6 mb-6 text-center border-2 border-gold/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
              <p className="font-playfair text-xl font-bold text-navy">{orderId}</p>
            </div>
            {paymentId && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Payment ID</p>
                <p className="text-sm font-mono text-gray-600 break-all">{paymentId}</p>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Save these IDs for future reference. A confirmation email has been sent.
          </p>
        </div>

        <div className="card p-6 mb-6">
          <h2 className="font-bold text-navy mb-5">What Happens Next?</h2>
          <div className="space-y-4">
            {NEXT_STEPS.map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-full border-2 border-gold bg-white flex items-center justify-center text-xl flex-shrink-0">
                  {s.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="font-semibold text-navy text-sm">{s.title}</span>
                    <span className="badge-gold text-[10px]">{s.time}</span>
                  </div>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 mb-6 border-2 border-teal/30" style={{ background: "#F0FDF4" }}>
          <div className="flex items-start gap-4">
            <span className="text-3xl">📦</span>
            <div className="flex-1">
              <h3 className="font-bold text-teal text-base mb-1">Loved the quality? Place a Bulk Order!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Now that you've seen our quality, get a custom bulk quote — MOQ from 50 units with
                your logo printed, delivered pan-India at wholesale prices.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/bulk-orders#inquiry-form" className="btn-teal">
                  📋 Get Bulk Quote → MOQ 50 units
                </Link>
                <Link href="/build-your-kit" className="btn-outline-navy text-sm">
                  ✨ Try AI Kit Builder
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">

          <a
            href={`https://wa.me/916268899194?text=Hi! My sample order ID is ${orderId}. I'd like to enquire about a bulk order.`}
            target="_blank" rel="noopener noreferrer"
            className="btn-md text-white rounded-lg"
            style={{ background: "#25D366" }}>
            💬 WhatsApp Us
          </a>
          <Link href="/shop" className="btn-outline-navy">🛍 Shop More Samples</Link>
          <Link href="/" className="btn-outline-navy">← Home</Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}