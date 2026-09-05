import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ContactForm from "@/components/sections/about/ContactForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact The Choice Company for bulk gifting enquiries.",
};

const contactDetails = [
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    label: "Phone",
    value: "+91 62688 99194",
    href: "tel:+916268899194",
    note: "Mon – Sat, 9 am – 7 pm",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    label: "Email",
    value: "info@thechoicecompany.in",
    href: "mailto:info@thechoicecompany.in",
    note: "Replies within 2 business hours",
  },
  {
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/916268899194",
    note: "Quickest for instant answers",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    label: "Office",
    value: "Indore, Madhya Pradesh",
    href: null,
    note: "India",
  },
];

/* ── Decorative background SVG illustrations ─────────────────── */

/** Gift box with ribbon — top-left */
const GiftBoxSVG = () => (
  <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="absolute -top-4 -left-6 opacity-[0.07] rotate-[-12deg]" aria-hidden>
    {/* Box body */}
    <rect x="12" y="46" width="86" height="56" rx="4" fill="#0a1946" />
    {/* Box lid */}
    <rect x="8" y="34" width="94" height="16" rx="3" fill="#d4af37" />
    {/* Ribbon vertical */}
    <rect x="48" y="34" width="14" height="68" fill="#0a1946" opacity="0.6" />
    {/* Ribbon horizontal on lid */}
    <rect x="8" y="34" width="94" height="16" rx="3" fill="none" />
    <rect x="8" y="40" width="94" height="4" fill="#0a1946" opacity="0.4" />
    {/* Bow left loop */}
    <ellipse cx="38" cy="30" rx="16" ry="10" fill="#d4af37" transform="rotate(-20 38 30)" />
    {/* Bow right loop */}
    <ellipse cx="72" cy="30" rx="16" ry="10" fill="#d4af37" transform="rotate(20 72 30)" />
    {/* Bow center */}
    <circle cx="55" cy="34" r="7" fill="#d4af37" />
    {/* Bow center dark */}
    <circle cx="55" cy="34" r="4" fill="#0a1946" opacity="0.3" />
  </svg>
);

/** Gift hamper basket — bottom-right */
const HamperSVG = () => (
  <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="absolute -bottom-6 -right-4 opacity-[0.07] rotate-[10deg]" aria-hidden>
    {/* Basket body */}
    <path d="M18 58 Q18 105 65 108 Q112 105 112 58Z" fill="#0a1946" />
    {/* Basket weave lines horizontal */}
    <path d="M20 70 Q65 73 110 70" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.5" />
    <path d="M19 83 Q65 87 111 83" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.5" />
    <path d="M21 96 Q65 100 109 96" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.5" />
    {/* Basket weave lines vertical */}
    <path d="M40 58 Q38 90 40 108" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.4" />
    <path d="M65 58 Q65 90 65 108" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.4" />
    <path d="M90 58 Q92 90 90 108" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.4" />
    {/* Basket rim */}
    <rect x="14" y="52" width="102" height="12" rx="6" fill="#d4af37" />
    {/* Handle */}
    <path d="M38 52 Q38 20 65 18 Q92 20 92 52" stroke="#0a1946" strokeWidth="8" fill="none" strokeLinecap="round" />
    {/* Items sticking out — bottle */}
    <rect x="52" y="22" width="10" height="32" rx="3" fill="#d4af37" opacity="0.7" />
    <rect x="50" y="18" width="14" height="8" rx="2" fill="#0a1946" opacity="0.5" />
    {/* Items sticking out — round fruit */}
    <circle cx="80" cy="44" r="10" fill="#d4af37" opacity="0.6" />
    <path d="M80 34 Q84 28 88 30" stroke="#0a1946" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Items sticking out — small box */}
    <rect x="30" y="36" width="16" height="16" rx="2" fill="#0a1946" opacity="0.4" />
    <path d="M30 44 H46 M38 36 V52" stroke="#d4af37" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

/** Laptop / electronic — mid-left floating */
const LaptopSVG = () => (
  <svg width="100" height="76" viewBox="0 0 100 76" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="absolute top-1/2 -left-8 -translate-y-1/2 opacity-[0.065] rotate-[6deg]" aria-hidden>
    {/* Screen */}
    <rect x="10" y="4" width="80" height="52" rx="4" fill="#0a1946" />
    <rect x="15" y="9" width="70" height="42" rx="2" fill="#d4af37" opacity="0.25" />
    {/* Screen content lines */}
    <rect x="22" y="16" width="40" height="3" rx="1" fill="#d4af37" opacity="0.5" />
    <rect x="22" y="23" width="56" height="2" rx="1" fill="#d4af37" opacity="0.3" />
    <rect x="22" y="29" width="48" height="2" rx="1" fill="#d4af37" opacity="0.3" />
    <rect x="22" y="35" width="32" height="2" rx="1" fill="#d4af37" opacity="0.3" />
    {/* Hinge */}
    <rect x="8" y="55" width="84" height="3" rx="1" fill="#0a1946" opacity="0.5" />
    {/* Base */}
    <path d="M2 58 Q2 72 50 72 Q98 72 98 58Z" fill="#0a1946" />
    {/* Trackpad */}
    <rect x="36" y="62" width="28" height="6" rx="3" fill="#d4af37" opacity="0.3" />
  </svg>
);

/** Headphones — top-right floating */
const HeadphonesSVG = () => (
  <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="absolute top-8 right-0 opacity-[0.065] rotate-[15deg]" aria-hidden>
    {/* Arc / headband */}
    <path d="M15 50 Q15 10 45 10 Q75 10 75 50" stroke="#0a1946" strokeWidth="8" fill="none" strokeLinecap="round" />
    {/* Left ear cup outer */}
    <rect x="6" y="46" width="22" height="30" rx="11" fill="#0a1946" />
    {/* Left ear cup inner */}
    <rect x="11" y="51" width="12" height="20" rx="6" fill="#d4af37" opacity="0.35" />
    {/* Right ear cup outer */}
    <rect x="62" y="46" width="22" height="30" rx="11" fill="#0a1946" />
    {/* Right ear cup inner */}
    <rect x="67" y="51" width="12" height="20" rx="6" fill="#d4af37" opacity="0.35" />
    {/* Cable */}
    <path d="M45 74 Q45 82 52 84" stroke="#0a1946" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
    <circle cx="54" cy="85" r="3" fill="#d4af37" opacity="0.5" />
  </svg>
);

/** Small ribbon star / sparkle — scattered */
const SparkSVG = ({ className }: { className: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className} aria-hidden>
    <path d="M12 2 L13.5 9 L20 8 L14.5 12.5 L17 20 L12 15.5 L7 20 L9.5 12.5 L4 8 L10.5 9 Z"
      fill="#d4af37" />
  </svg>
);

/** Small gift tag */
const GiftTagSVG = ({ className }: { className: string }) => (
  <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className} aria-hidden>
    <rect x="2" y="8" width="32" height="34" rx="3" fill="#0a1946" />
    <circle cx="18" cy="8" r="5" stroke="#0a1946" strokeWidth="3" fill="none" />
    <rect x="8" y="18" width="20" height="2.5" rx="1" fill="#d4af37" opacity="0.6" />
    <rect x="8" y="24" width="14" height="2" rx="1" fill="#d4af37" opacity="0.4" />
    <rect x="8" y="30" width="17" height="2" rx="1" fill="#d4af37" opacity="0.4" />
  </svg>
);

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Let's Talk Gifting"
        subtitle="Our team responds within 2 business hours"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      {/* ── Main contact section ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">

        {/* ── Background layer ──────────────────────────────────── */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">

          {/* Soft colour orbs */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-navy/[0.04] blur-3xl" />
          <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full bg-gold/[0.03] blur-2xl -translate-x-1/2" />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage: "radial-gradient(circle, #0a1946 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* ── Decorative gift illustrations ── */}

          {/* Gift box — top left corner */}
          <div className="absolute top-6 left-4 lg:left-10">
            <GiftBoxSVG />
          </div>

          {/* Hamper — bottom right */}
          <div className="absolute bottom-8 right-6 lg:right-16">
            <HamperSVG />
          </div>

          {/* Laptop — mid left */}
          <div className="hidden lg:block absolute top-1/2 left-2 -translate-y-1/2">
            <LaptopSVG />
          </div>

          {/* Headphones — top right */}
          <div className="hidden lg:block absolute top-10 right-10">
            <HeadphonesSVG />
          </div>

          {/* Small gift tags scattered */}
          <GiftTagSVG className="absolute top-[22%] right-[8%] opacity-[0.06] rotate-[18deg]" />
          <GiftTagSVG className="absolute bottom-[28%] left-[6%] opacity-[0.05] -rotate-[14deg]" />

          {/* Gold sparkle stars */}
          <SparkSVG className="absolute top-[12%] left-[30%] opacity-[0.12] rotate-[10deg] w-5 h-5" />
          <SparkSVG className="absolute top-[60%] right-[20%] opacity-[0.10] -rotate-[8deg] w-4 h-4" />
          <SparkSVG className="absolute bottom-[15%] left-[40%] opacity-[0.09] rotate-[25deg] w-3 h-3" />
          <SparkSVG className="absolute top-[38%] right-[4%] opacity-[0.08] w-4 h-4" />

          {/* Diagonal faint gold line accent */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #d4af37 0px, #d4af37 1px, transparent 1px, transparent 60px)",
            }}
          />
        </div>

        {/* ── Content ───────────────────────────────────────────── */}
        <div className="container-site relative z-10 py-12 lg:py-14">

          {/* Compact intro strip */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8 pb-7 border-b border-gray-100">
            <div>
              <span className="section-label">CONTACT US</span>
              <h2 className="section-title mt-1 mb-0">Get in touch</h2>
            </div>
            <p className="text-sm text-gray-400 max-w-xs sm:text-right leading-relaxed">
              Our gifting specialists guide you from brief to delivery — every time.
            </p>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

            {/* ── LEFT: form card ─────────────────────────────── */}
            <div className="relative rounded-2xl border border-gray-100 bg-white/85 backdrop-blur-sm shadow-sm shadow-navy/5 p-7 lg:p-8">
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <div className="mb-5">
                <h3 className="text-base font-semibold text-navy">Send a message</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  We'll get back to you within 2 business hours.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* ── RIGHT: sticky sidebar ───────────────────────── */}
            <div className="lg:sticky lg:top-24 flex flex-col gap-3">

              {contactDetails.map(({ icon, label, value, href, note }) => (
                <div
                  key={label}
                  className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white/85 backdrop-blur-sm px-4 py-3.5 transition-all duration-200 hover:border-gold/30 hover:shadow-sm hover:shadow-gold/10"
                >
                  <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center text-gold flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase leading-none mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="block text-navy font-semibold text-sm hover:text-gold transition-colors duration-150 truncate leading-tight"
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="block text-navy font-semibold text-sm leading-tight">{value}</span>
                    )}
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-none">{note}</p>
                  </div>
                  {href && (
                    <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 group-hover:text-gold transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-3 my-0.5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] text-gray-300 font-semibold tracking-wider uppercase">Or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Bulk inquiry CTA */}
              <div className="rounded-xl bg-navy px-5 py-5 relative overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gold/10 blur-xl" />
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-gold/5 blur-lg" />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-semibold tracking-widest text-gold/70 uppercase mb-1.5">
                    Corporate &amp; Bulk
                  </p>
                  <h4 className="text-white font-semibold text-sm mb-1.5 leading-snug">
                    Need gifts for 50+ people?
                  </h4>
                  <p className="text-white/50 text-xs mb-4 leading-relaxed">
                    Share quantities, budget, and timelines — get a custom proposal in 24 hours.
                  </p>
                  <a
                    href="/bulk-orders#inquiry-form"
                    className="inline-flex items-center gap-1.5 bg-gold text-navy font-semibold text-xs px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors duration-150"
                  >
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>
                    Submit bulk inquiry
                  </a>
                </div>
              </div>

              {/* Online indicator */}
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-white/85 backdrop-blur-sm border border-gray-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                <p className="text-[11px] text-gray-500">
                  Team <span className="font-semibold text-gray-700">online now</span> — avg. reply under 90 min
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────── */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="container-site py-10">
          <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-200">
            {[
              { stat: "2 hrs", label: "Average response time" },
              { stat: "500+", label: "Corporate clients" },
              { stat: "100%", label: "Custom-branded options" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-navy mb-0.5">{stat}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}