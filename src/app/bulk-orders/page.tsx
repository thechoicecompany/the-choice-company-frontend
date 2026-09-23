import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero/PageHero";
import BulkInquiryForm from "@/components/forms/BulkInquiryForm";

export const metadata: Metadata = {
  title: "Bulk Corporate Gift Orders",
  description: "Submit bulk gifting requirements. MOQ from 50 units. Get quote in 24 hours.",
};

export default function BulkOrdersPage() {
  return (
    <>
      <PageHero
        title="Bulk Order Solutions"
        subtitle="Submit your requirement — our team responds within 24 hours"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Bulk Orders" }]}
      />

      <section className="relative py-20 md:py-32 overflow-hidden">

        {/* ── Base: deep forest green ── */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-[#0d2b1f] to-[#081a10]" />

        {/* ── Gold glow — top-right ── */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-yellow-400/10 blur-[130px] pointer-events-none" />

        {/* ── Teal glow — bottom-left ── */}
        <div className="absolute -bottom-32 -left-24 w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-[110px] pointer-events-none" />

        {/* ── Warm gold centre pulse ── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full bg-yellow-300/5 blur-[80px] pointer-events-none" />

        {/* ── Dot grid texture ── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #fde68a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── Hairline vertical accents ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-[22%] w-px h-full bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent" />
          <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-transparent via-yellow-300/10 to-transparent" />
        </div>

        {/* ── Horizontal rule top ── */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

        {/* ── Content ── */}
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6" id="inquiry-form">

          {/* Header */}
          <div className="text-left mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.22em] text-yellow-400 mb-3">
              Get a Quote
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-none">
              Submit Your<br />
              <span className="text-yellow-400">Bulk Requirement</span>
            </h2>
            <p className="mt-4 text-emerald-200/60 text-base max-w-lg leading-relaxed">
              Fill in your gifting brief below and our team will craft a custom proposal within 24 hours.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-emerald-900/20 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)] p-8 md:p-10">
            <BulkInquiryForm />
          </div>

          {/* Bottom caption */}
          <p className="mt-6 text-center text-xs text-emerald-700/60 tracking-wide">
            Your data is encrypted and never shared with third parties.
          </p>

        </div>
      </section>
    </>
  );
}