// "use client";
// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";

// const SLIDES = [
//   {
//     tag: "INDIA'S #1 CORPORATE GIFTING BRAND",
//     h1a: "India's Trusted",
//     h1b: "Corporate Gifting Partner",
//     body: "Customized Corporate Gifts | Employee Kits | Festival Hampers | Promotional Merchandise | PAN India Delivery",
//     img: "/Poster1.png",
//   },
//   {
//     tag: "AI-POWERED KIT BUILDER",
//     h1a: "Build Your Perfect",
//     h1b: "Corporate Gift Kit",
//     body: "Select products, upload your logo, and let AI generate the ideal combo for your team or clients",
//     img: "/Poster2.png",
//   },
//   {
//     tag: "FESTIVE GIFTING SEASON",
//     h1a: "Make Every Festival",
//     h1b: "Memorable with Premium Gifts",
//     body: "Diwali hampers, New Year kits, and seasonal gifting solutions with custom branding — pan-India delivery",
//     img: "/Poster3.png",
//   },
// ];

// export default function HeroBanner() {
//   const [active, setActive] = useState(0);

//   const next = useCallback(() => setActive((a) => (a + 1) % SLIDES.length), []);

//   useEffect(() => {
//     const t = setInterval(next, 5000);
//     return () => clearInterval(t);
//   }, [next]);

//   const slide = SLIDES[active];

//   return (
//     <section className="relative min-h-[540px] md:min-h-[600px] flex items-center overflow-hidden bg-cream">
//       {/* Background image */}
//       <div className="absolute inset-0 z-0">
//         <Image src={slide.img} alt="" fill className="object-cover opacity-10" priority sizes="100vw" />
//         <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-transparent" />
//       </div>

//       <div className="container-site relative z-10 py-16">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Left — Text */}
//           <div className="anim-fade-up" key={active}>
//             <span className="section-label mb-4 block">{slide.tag}</span>
//             <h1 className="font-playfair font-bold leading-tight mb-4">
//               <span className="block text-4xl md:text-5xl text-navy">{slide.h1a}</span>
//               <span className="block text-4xl md:text-5xl" style={{ color: "var(--gold)" }}>{slide.h1b}</span>
//             </h1>
//             <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-lg">{slide.body}</p>

//             {/* CTAs */}
//             <div className="flex flex-wrap gap-3">
//               <Link href="/public/catalog.pdf" target="_blank" className="btn-navy">
//                 📋 Get Catalogue
//               </Link>
//               <Link href="/build-your-kit" className="btn-gold">
//                 ✨ Build Your Kit
//               </Link>
//               <a href="tel:+918109000100" className="btn-outline-navy">
//                 📞 Talk to Expert
//               </a>
//             </div>

//             {/* Slide Dots */}
//             <div className="flex gap-2 mt-8">
//               {SLIDES.map((_, i) => (
//                 <button key={i} onClick={() => setActive(i)}
//                   className="rounded-full transition-all duration-300"
//                   style={{
//                     width: i === active ? "28px" : "8px",
//                     height: "8px",
//                     background: i === active ? "var(--gold)" : "#D1D5DB",
//                   }}
//                   aria-label={`Slide ${i + 1}`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Right — Product Image */}
//           <div className="relative hidden lg:flex items-center justify-center">
//             <div className="relative w-[460px] h-[380px]">
//               <Image src={slide.img} alt="Corporate gift products" fill
//                 className="object-contain anim-fade-in" key={`img-${active}`}
//                 sizes="460px" priority />
//             </div>
//             {/* Floating badge */}
//             <div className="absolute -bottom-2 -left-4 bg-white rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3">
//               <span className="text-2xl">🏆</span>
//               <div>
//                 <div className="text-xs font-bold text-navy">500+ Corporate Clients</div>
//                 <div className="text-xs text-gray-400">Trusted pan-India</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import CatalogGateModal from "@/components/catalog/CatalogGateModal";

const SLIDES = [
  {
    tag: "INDIA'S #1 CORPORATE GIFTING BRAND",
    h1a: "India's Trusted",
    h1b: "Corporate Gifting Partner",
    body: "Customized Corporate Gifts | Employee Kits | Festival Hampers | Promotional Merchandise | PAN India Delivery",
    img: "/Poster1.png",
  },
  {
    tag: "AI-POWERED KIT BUILDER",
    h1a: "Build Your Perfect",
    h1b: "Corporate Gift Kit",
    body: "Select products, upload your logo, and let AI generate the ideal combo for your team or clients",
    img: "/Poster2.png",
  },
  {
    tag: "FESTIVE GIFTING SEASON",
    h1a: "Make Every Festival",
    h1b: "Memorable with Premium Gifts",
    body: "Diwali hampers, New Year kits, and seasonal gifting solutions with custom branding — pan-India delivery",
    img: "/Poster3.png",
  },
];

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [showCatalogGate, setShowCatalogGate] = useState(false);

  const next = useCallback(() => setActive((a) => (a + 1) % SLIDES.length), []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[active];

  return (
    <section className="relative min-h-[540px] md:min-h-[600px] flex items-center overflow-hidden bg-cream">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image src={slide.img} alt="" fill className="object-cover opacity-10" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-transparent" />
      </div>

      <div className="container-site relative z-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div className="anim-fade-up" key={active}>
            <span className="section-label mb-4 block">{slide.tag}</span>
            <h1 className="font-playfair font-bold leading-tight mb-4">
              <span className="block text-4xl md:text-5xl text-navy">{slide.h1a}</span>
              <span className="block text-4xl md:text-5xl" style={{ color: "var(--gold)" }}>{slide.h1b}</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-lg">{slide.body}</p>

            {/* CTAs */}
            {/* <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowCatalogGate(true)} className="btn-navy">
                📋 Get Catalogue
              </button> */}
            <div className="flex flex-wrap gap-3">
              <Link href="/gallery" className="btn-navy">
                📋 Get Catalogue
              </Link>
              <Link href="/build-your-kit" className="btn-gold">
                ✨ Build Your Kit
              </Link>
              <a href="tel:+916268899194" className="btn-outline-navy">
                📞 Talk to Expert
              </a>
            </div>

            {/* Slide Dots */}
            <div className="flex gap-2 mt-8">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? "28px" : "8px",
                    height: "8px",
                    background: i === active ? "var(--gold)" : "#D1D5DB",
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right — Product Image */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-[460px] h-[380px]">
              <Image src={slide.img} alt="Corporate gift products" fill
                className="object-contain anim-fade-in" key={`img-${active}`}
                sizes="460px" priority />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-2 -left-4 bg-white rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-xs font-bold text-navy">500+ Corporate Clients</div>
                <div className="text-xs text-gray-400">Trusted pan-India</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCatalogGate && (
        <CatalogGateModal onClose={() => setShowCatalogGate(false)} />
      )}
    </section>
  );
}