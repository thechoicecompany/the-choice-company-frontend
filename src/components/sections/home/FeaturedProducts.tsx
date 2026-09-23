// "use client";

// import { useState, useCallback, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";
// import { CaretLeft, CaretRight } from "@phosphor-icons/react";
// import TiltCard from "@/components/ui/TiltCard";
// import type { Product } from "@/lib/types/product.types";
// import { formatINR } from "@/lib/utils/formatCurrency";
// // FeaturedProductsAnimated.tsx — remove the local ImageCarousel function, add this import
// import ImageCarousel from "@/components/shared/ImageCarousel";
// gsap.registerPlugin(ScrollTrigger, useGSAP);

// // ─── helpers ────────────────────────────────────────────────────────────────

// function getImageList(product: Product): string[] {
//   if (product.productImages && product.productImages.length > 0) {
//     return product.productImages
//       .sort((a, b) => a.sortOrder - b.sortOrder)
//       .map((img) => img.listingUrl ?? img.imageUrl);
//   }
//   const all: string[] = [];
//   if (product.image) all.push(product.image);
//   if (product.images) all.push(...product.images.filter(Boolean));
//   return [...new Set(all)];
// }

// function getFeatures(product: Product): { icon: string; label: string }[] {
//   const tagMap: Record<string, { icon: string; label: string }> = {
//     sustainable: { icon: "♻", label: "Sustainable" },
//     reusable: { icon: "↺", label: "Reusable" },
//     branding: { icon: "◈", label: "Custom Branding" },
//     "fast-heating": { icon: "⚡", label: "Fast Heating" },
//     "auto-cutoff": { icon: "◉", label: "Auto Cut-off" },
//     premium: { icon: "◆", label: "Premium Build" },
//     lightweight: { icon: "◇", label: "Lightweight" },
//     durable: { icon: "◈", label: "Durable" },
//     modern: { icon: "▣", label: "Modern Design" },
//     bestseller: { icon: "★", label: "Bestseller" },
//   };

//   const fromTags =
//     product.tags
//       ?.map((t) => tagMap[t.toLowerCase()])
//       .filter(Boolean)
//       .slice(0, 3) ?? [];

//   if (fromTags.length >= 2) return fromTags as { icon: string; label: string }[];

//   const catMap: Record<string, { icon: string; label: string }[]> = {
//     "eco-friendly": [
//       { icon: "♻", label: "Sustainable" },
//       { icon: "↺", label: "Reusable" },
//       { icon: "◈", label: "Custom Branding" },
//     ],
//     electronics: [
//       { icon: "⚡", label: "Fast Heating" },
//       { icon: "◉", label: "Auto Cut-off" },
//       { icon: "◆", label: "Premium Build" },
//     ],
//     "travel-kits": [
//       { icon: "◇", label: "Lightweight" },
//       { icon: "◈", label: "Durable" },
//       { icon: "▣", label: "Modern Design" },
//     ],
//   };

//   return (
//     catMap[product.categorySlug?.toLowerCase()] ??
//     catMap[product.category?.toLowerCase().replace(/\s+/g, "-")] ?? [
//       { icon: "◆", label: "Premium" },
//       { icon: "◈", label: "Quality" },
//       { icon: "▣", label: "Branding" },
//     ]
//   );
// }

// // ─── Decorative SVGs ─────────────────────────────────────────────────────────

// function LeafClusterTopLeft() {
//   return (
//     <svg
//       viewBox="0 0 280 260"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className="absolute top-0 left-0 w-[220px] md:w-[280px] pointer-events-none select-none"
//       aria-hidden="true"
//     >
//       {/* Large back leaf */}
//       <path
//         d="M-20 10 C30 -10, 130 20, 160 110 C130 90, 60 80, -20 10Z"
//         fill="#4a7c3f"
//         opacity="0.18"
//       />
//       {/* Mid leaf */}
//       <path
//         d="M-10 40 C40 10, 150 50, 170 160 C130 130, 50 110, -10 40Z"
//         fill="#3d6b34"
//         opacity="0.22"
//       />
//       {/* Front large leaf */}
//       <path
//         d="M0 80 C50 40, 180 70, 200 200 C150 165, 60 150, 0 80Z"
//         fill="#2d5225"
//         opacity="0.28"
//       />
//       {/* Slim accent leaf top */}
//       <path
//         d="M30 0 C45 30, 55 80, 40 130 C30 100, 20 50, 30 0Z"
//         fill="#4a7c3f"
//         opacity="0.20"
//       />
//       {/* Slim accent leaf right */}
//       <path
//         d="M60 -10 C90 20, 110 75, 90 140 C75 110, 60 60, 60 -10Z"
//         fill="#3d6b34"
//         opacity="0.16"
//       />
//       {/* Stem lines */}
//       <path
//         d="M0 80 Q80 120 200 200"
//         stroke="#2d5225"
//         strokeWidth="1"
//         opacity="0.18"
//         fill="none"
//       />
//       <path
//         d="M-10 40 Q70 90 170 160"
//         stroke="#2d5225"
//         strokeWidth="0.8"
//         opacity="0.14"
//         fill="none"
//       />
//       {/* Small detail leaves */}
//       <path
//         d="M100 10 C115 30, 125 60, 110 90 C100 65, 95 38, 100 10Z"
//         fill="#4a7c3f"
//         opacity="0.14"
//       />
//       <path
//         d="M130 25 C148 48, 155 82, 138 115 C126 88, 122 56, 130 25Z"
//         fill="#3d6b34"
//         opacity="0.12"
//       />
//     </svg>
//   );
// }

// function LeafClusterBottomRight() {
//   return (
//     <svg
//       viewBox="0 0 280 260"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className="absolute bottom-0 right-0 w-[220px] md:w-[280px] pointer-events-none select-none"
//       style={{ transform: "rotate(180deg)" }}
//       aria-hidden="true"
//     >
//       <path
//         d="M-20 10 C30 -10, 130 20, 160 110 C130 90, 60 80, -20 10Z"
//         fill="#4a7c3f"
//         opacity="0.18"
//       />
//       <path
//         d="M-10 40 C40 10, 150 50, 170 160 C130 130, 50 110, -10 40Z"
//         fill="#3d6b34"
//         opacity="0.22"
//       />
//       <path
//         d="M0 80 C50 40, 180 70, 200 200 C150 165, 60 150, 0 80Z"
//         fill="#2d5225"
//         opacity="0.28"
//       />
//       <path
//         d="M30 0 C45 30, 55 80, 40 130 C30 100, 20 50, 30 0Z"
//         fill="#4a7c3f"
//         opacity="0.20"
//       />
//       <path
//         d="M60 -10 C90 20, 110 75, 90 140 C75 110, 60 60, 60 -10Z"
//         fill="#3d6b34"
//         opacity="0.16"
//       />
//       <path
//         d="M0 80 Q80 120 200 200"
//         stroke="#2d5225"
//         strokeWidth="1"
//         opacity="0.18"
//         fill="none"
//       />
//       <path
//         d="M100 10 C115 30, 125 60, 110 90 C100 65, 95 38, 100 10Z"
//         fill="#4a7c3f"
//         opacity="0.14"
//       />
//       <path
//         d="M130 25 C148 48, 155 82, 138 115 C126 88, 122 56, 130 25Z"
//         fill="#3d6b34"
//         opacity="0.12"
//       />
//     </svg>
//   );
// }

// function GiftBoxIcon() {
//   return (
//     <svg
//       viewBox="0 0 40 40"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-8 h-8"
//       aria-hidden="true"
//     >
//       {/* Box body */}
//       <rect x="4" y="18" width="32" height="18" rx="1.5" stroke="#c49736" strokeWidth="1.4" fill="none" />
//       {/* Box lid */}
//       <rect x="2" y="13" width="36" height="6" rx="1.5" stroke="#c49736" strokeWidth="1.4" fill="none" />
//       {/* Ribbon vertical */}
//       <line x1="20" y1="13" x2="20" y2="36" stroke="#c49736" strokeWidth="1.4" />
//       {/* Ribbon horizontal on lid */}
//       <line x1="2" y1="16" x2="38" y2="16" stroke="#c49736" strokeWidth="1.4" />
//       {/* Bow left loop */}
//       <path d="M20 13 C16 8, 8 8, 10 13" stroke="#c49736" strokeWidth="1.4" fill="none" strokeLinecap="round" />
//       {/* Bow right loop */}
//       <path d="M20 13 C24 8, 32 8, 30 13" stroke="#c49736" strokeWidth="1.4" fill="none" strokeLinecap="round" />
//       {/* Bow knot */}
//       <circle cx="20" cy="13" r="1.5" fill="#c49736" />
//     </svg>
//   );
// }

// // ─── Image Carousel ──────────────────────────────────────────────────────────

// function ImageCarousel({
//   images,
//   productName,
//   productSlug,
// }: {
//   images: string[];
//   productName: string;
//   productSlug: string;
// }) {
//   const [current, setCurrent] = useState(0);
//   const total = images.length;

//   const prev = useCallback(
//     (e: React.MouseEvent) => {
//       e.preventDefault();
//       e.stopPropagation();
//       setCurrent((i) => (i - 1 + total) % total);
//     },
//     [total]
//   );

//   const next = useCallback(
//     (e: React.MouseEvent) => {
//       e.preventDefault();
//       e.stopPropagation();
//       setCurrent((i) => (i + 1) % total);
//     },
//     [total]
//   );

//   return (
//     <Link
//       href={`/products/${productSlug}`}
//       className="block relative aspect-[4/3] overflow-hidden bg-[#f5f2eb]"
//     >
//       {images.map((src, idx) => (
//         <div
//           key={idx}
//           className={`absolute inset-0 transition-opacity duration-400 ${idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
//             }`}
//         >
//           <Image
//             src={src}
//             alt={`${productName} — image ${idx + 1}`}
//             fill
//             className="object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
//             sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
//             priority={idx === 0}
//           />
//         </div>
//       ))}

//       {total > 1 && (
//         <>
//           <button
//             onClick={prev}
//             aria-label="Previous image"
//             className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/85 hover:bg-white shadow-sm flex items-center justify-center text-[#10233f] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//           >
//             <CaretLeft size={14} weight="bold" />
//           </button>
//           <button
//             onClick={next}
//             aria-label="Next image"
//             className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/85 hover:bg-white shadow-sm flex items-center justify-center text-[#10233f] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//           >
//             <CaretRight size={14} weight="bold" />
//           </button>
//           <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/15">
//             {images.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   setCurrent(idx);
//                 }}
//                 aria-label={`Image ${idx + 1}`}
//                 className={`rounded-full transition-all duration-200 ${idx === current
//                   ? "w-4 h-1.5 bg-white"
//                   : "w-1.5 h-1.5 bg-white/50"
//                   }`}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </Link>
//   );
// }

// // ─── Main Component ──────────────────────────────────────────────────────────

// export default function FeaturedProductsAnimated({
//   products,
// }: {
//   products: Product[];
// }) {
//   const sectionRef = useRef<HTMLElement>(null);
//   const headingRef = useRef<HTMLDivElement>(null);
//   const gridRef = useRef<HTMLDivElement>(null);

//   useGSAP(
//     () => {
//       if (headingRef.current) {
//         gsap.fromTo(
//           headingRef.current.children,
//           { opacity: 0, y: 28 },
//           {
//             opacity: 1,
//             y: 0,
//             duration: 0.7,
//             stagger: 0.12,
//             ease: "power3.out",
//             scrollTrigger: {
//               trigger: headingRef.current,
//               start: "top 85%",
//               once: true,
//             },
//           }
//         );
//       }

//       if (gridRef.current) {
//         const cards = gridRef.current.querySelectorAll(".product-card");
//         gsap.fromTo(
//           cards,
//           { opacity: 0, y: 48, scale: 0.95 },
//           {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             duration: 0.65,
//             stagger: { amount: 0.5, from: "start" },
//             ease: "power3.out",
//             scrollTrigger: {
//               trigger: gridRef.current,
//               start: "top 80%",
//               once: true,
//             },
//           }
//         );
//       }
//     },
//     { scope: sectionRef }
//   );

//   return (
//     <section
//       ref={sectionRef}
//       className="relative section-py overflow-hidden"
//       style={{ background: "#f7f3ee" }}
//     >
//       {/* ── Decorative leaf clusters ── */}
//       <LeafClusterTopLeft />
//       <LeafClusterBottomRight />

//       {/* ── Subtle gold arc left edge ── */}
//       <svg
//         viewBox="0 0 60 400"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-auto pointer-events-none select-none hidden lg:block"
//         aria-hidden="true"
//       >
//         <path
//           d="M50 0 Q-20 200 50 400"
//           stroke="#c49736"
//           strokeWidth="0.8"
//           opacity="0.25"
//           fill="none"
//         />
//         <path
//           d="M38 20 Q-30 200 38 380"
//           stroke="#c49736"
//           strokeWidth="0.5"
//           opacity="0.15"
//           fill="none"
//         />
//       </svg>

//       {/* ── Subtle gold arc right edge ── */}
//       <svg
//         viewBox="0 0 60 400"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         className="absolute right-0 top-1/2 -translate-y-1/2 h-[60%] w-auto pointer-events-none select-none hidden lg:block"
//         style={{ transform: "translateY(-50%) scaleX(-1)" }}
//         aria-hidden="true"
//       >
//         <path
//           d="M50 0 Q-20 200 50 400"
//           stroke="#c49736"
//           strokeWidth="0.8"
//           opacity="0.25"
//           fill="none"
//         />
//         <path
//           d="M38 20 Q-30 200 38 380"
//           stroke="#c49736"
//           strokeWidth="0.5"
//           opacity="0.15"
//           fill="none"
//         />
//       </svg>

//       {/* ── Top-left tagline ── */}
//       <div className="absolute top-8 left-6 hidden lg:block pointer-events-none select-none">
//         <p
//           className="text-[10px] font-semibold tracking-[0.22em] leading-relaxed uppercase"
//           style={{ color: "#6b5c3e" }}
//         >
//           Premium Gifts
//           <br />
//           For A Stronger
//           <br />
//           Tomorrow
//         </p>
//         <div className="mt-1.5 w-8 h-px" style={{ background: "#c49736" }} />
//       </div>

//       {/* ── Top-right cursive tagline ── */}
//       <div className="absolute top-6 right-6 hidden lg:block pointer-events-none select-none text-right">
//         <p
//           className="leading-snug"
//           style={{
//             fontFamily: "var(--font-script)",
//             fontSize: "22px",
//             color: "#b98a2f",
//             lineHeight: 1.3,
//           }}
//         >
//           Corporate Gifts
//           <br />
//           That Create
//           <br />
//           Connections
//         </p>
//       </div>

//       {/* ── Bottom-left tagline ── */}
//       <div className="absolute bottom-8 left-6 hidden lg:block pointer-events-none select-none">
//         <div className="mb-1.5 w-8 h-px" style={{ background: "#c49736" }} />
//         <p
//           className="text-[10px] font-semibold tracking-[0.22em] leading-relaxed uppercase"
//           style={{ color: "#6b5c3e" }}
//         >
//           Quality Gifts
//           <br />
//           Lasting Relationships
//         </p>
//       </div>

//       {/* ── Bottom-right wordmark ── */}
//       <div className="absolute bottom-8 right-6 hidden lg:block pointer-events-none select-none">
//         <div className="flex items-center gap-2.5">
//           <GiftBoxIcon />
//           <div>
//             <p
//               className="text-[9px] font-bold tracking-[0.28em] uppercase"
//               style={{ color: "#c49736" }}
//             >
//               The Choice
//             </p>
//             <p
//               className="text-[9px] font-bold tracking-[0.28em] uppercase"
//               style={{ color: "#c49736" }}
//             >
//               Company
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ── Content ── */}
//       <div className="container-site relative z-10">

//         {/* Heading */}
//         <div ref={headingRef} className="text-center mb-12">
//           <div className="flex items-center justify-center gap-3 mb-2">
//             <div className="h-px w-10" style={{ background: "#c49736" }} />
//             <span
//               className="text-[11px] font-bold tracking-[0.2em] uppercase"
//               style={{ color: "#214a04" }}
//             >
//               Our Collection
//             </span>
//             <div className="h-px w-10" style={{ background: "#c49736" }} />
//           </div>
//           <h2 className="section-title mt-1">Featured Collections</h2>
//         </div>

//         {/* Grid */}
//         <div
//           ref={gridRef}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//         >
//           {products.map((product) => {
//             const imageList = getImageList(product);
//             const features = getFeatures(product);

//             return (
//               <div key={product.id} className="product-card opacity-0">
//                 <TiltCard className="h-full" maxTilt={6} scale={1.015}>
//                   <div
//                     className="flex flex-col h-full rounded-xl overflow-hidden bg-white group"
//                     style={{
//                       boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
//                       transition: "box-shadow 0.3s ease",
//                     }}
//                     onMouseEnter={(e) => {
//                       (e.currentTarget as HTMLDivElement).style.boxShadow =
//                         "0 12px 40px rgba(0,0,0,0.12)";
//                     }}
//                     onMouseLeave={(e) => {
//                       (e.currentTarget as HTMLDivElement).style.boxShadow =
//                         "0 4px 16px rgba(0,0,0,0.06)";
//                     }}
//                   >
//                     {/* Image area */}
//                     <div className="relative flex-shrink-0">
//                       <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
//                         {product.tags?.includes("bestseller") && (
//                           <span
//                             className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow"
//                             style={{ background: "var(--orange)" }}
//                           >
//                             Bestseller
//                           </span>
//                         )}
//                       </div>
//                       <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] font-semibold text-navy pointer-events-none shadow-sm">
//                         MOQ {product.moq}
//                       </div>
//                       <ImageCarousel
//                         images={imageList}
//                         productName={product.name}
//                         productSlug={product.slug}
//                       />
//                     </div>

//                     {/* Card body */}
//                     <div className="p-5 flex flex-col flex-1">
//                       <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.14em] mb-1.5">
//                         {product.category}
//                       </span>
//                       <h3 className="font-serif font-bold text-[#10233f] text-[18px] leading-snug mb-4 line-clamp-2 group-hover:text-[#b98a2f] transition-colors duration-200">
//                         {product.name}
//                       </h3>

//                       <div className="flex items-center gap-3 mb-5 text-xs text-gray-500 flex-wrap">
//                         {features.map((f, i) => (
//                           <span key={i} className="flex items-center gap-1.5">
//                             {i > 0 && (
//                               <span className="h-4 w-px bg-gray-200 mr-1.5" />
//                             )}
//                             <span className="text-[#a87920]">{f.icon}</span>
//                             {f.label}
//                           </span>
//                         ))}
//                       </div>

//                       <div className="flex items-baseline gap-1 mb-3">
//                         <span className="text-[22px] font-bold text-[#10233f]">
//                           {formatINR(product.basePrice)}
//                         </span>
//                         <span className="text-xs text-gray-400">/unit (bulk)</span>
//                       </div>

//                       {product.stockStatus && (
//                         <div className="mb-5">
//                           <span
//                             className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full ${product.stockStatus === "IN_STOCK"
//                               ? "bg-green-50 text-green-700"
//                               : product.stockStatus === "LOW_STOCK"
//                                 ? "bg-amber-50 text-amber-700"
//                                 : "bg-red-50 text-red-600"
//                               }`}
//                           >
//                             <span className="text-[8px]">●</span>
//                             {product.stockStatus === "IN_STOCK"
//                               ? "In Stock"
//                               : product.stockStatus === "LOW_STOCK"
//                                 ? "Low Stock"
//                                 : "Out of Stock"}
//                           </span>
//                         </div>
//                       )}

//                       <div className="flex gap-2 mt-auto">
//                         <Link
//                           href={`/products/${product.slug}`}
//                           className="flex-1 h-11 rounded-lg border border-[#10233f] flex items-center justify-center text-sm font-semibold text-[#10233f] transition-all duration-300 hover:bg-[#10233f] hover:text-white"
//                         >
//                           View Details
//                         </Link>
//                         <Link
//                           href={`/bulk-orders?product=${product.slug}`}
//                           className="flex-1 h-11 rounded-lg flex items-center justify-center text-sm font-semibold text-white bg-[#c49736] transition-all duration-300 hover:bg-[#ad8329] hover:-translate-y-0.5 hover:shadow-lg"
//                         >
//                           Get Quote
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </TiltCard>
//               </div>
//             );
//           })}
//         </div>

//         {/* View All */}
//         <div className="text-center mt-10">
//           <Link
//             href="/products"
//             className="btn-outline-navy btn-lg inline-flex items-center gap-2 group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
//           >
//             View All Products
//             <span className="transition-transform duration-200 group-hover:translate-x-1">
//               →
//             </span>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }




"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TiltCard from "@/components/ui/TiltCard";
import ImageCarousel from "@/components/shared/ImageCarousel";
import type { Product } from "@/lib/types/product.types";
import { formatINR } from "@/lib/utils/formatCurrency";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── helpers ────────────────────────────────────────────────────────────────

function getImageList(product: Product): string[] {
  if (product.productImages && product.productImages.length > 0) {
    return product.productImages
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => img.listingUrl ?? img.imageUrl);
  }
  const all: string[] = [];
  if (product.image) all.push(product.image);
  if (product.images) all.push(...product.images.filter(Boolean));
  return [...new Set(all)];
}

function getFeatures(product: Product): { icon: string; label: string }[] {
  const tagMap: Record<string, { icon: string; label: string }> = {
    sustainable: { icon: "♻", label: "Sustainable" },
    reusable: { icon: "↺", label: "Reusable" },
    branding: { icon: "◈", label: "Custom Branding" },
    "fast-heating": { icon: "⚡", label: "Fast Heating" },
    "auto-cutoff": { icon: "◉", label: "Auto Cut-off" },
    premium: { icon: "◆", label: "Premium Build" },
    lightweight: { icon: "◇", label: "Lightweight" },
    durable: { icon: "◈", label: "Durable" },
    modern: { icon: "▣", label: "Modern Design" },
    bestseller: { icon: "★", label: "Bestseller" },
  };

  const fromTags =
    product.tags
      ?.map((t) => tagMap[t.toLowerCase()])
      .filter(Boolean)
      .slice(0, 3) ?? [];

  if (fromTags.length >= 2) return fromTags as { icon: string; label: string }[];

  const catMap: Record<string, { icon: string; label: string }[]> = {
    "eco-friendly": [
      { icon: "♻", label: "Sustainable" },
      { icon: "↺", label: "Reusable" },
      { icon: "◈", label: "Custom Branding" },
    ],
    electronics: [
      { icon: "⚡", label: "Fast Heating" },
      { icon: "◉", label: "Auto Cut-off" },
      { icon: "◆", label: "Premium Build" },
    ],
    "travel-kits": [
      { icon: "◇", label: "Lightweight" },
      { icon: "◈", label: "Durable" },
      { icon: "▣", label: "Modern Design" },
    ],
  };

  return (
    catMap[product.categorySlug?.toLowerCase()] ??
    catMap[product.category?.toLowerCase().replace(/\s+/g, "-")] ?? [
      { icon: "◆", label: "Premium" },
      { icon: "◈", label: "Quality" },
      { icon: "▣", label: "Branding" },
    ]
  );
}

// ─── Decorative SVGs ─────────────────────────────────────────────────────────

function LeafClusterTopLeft() {
  return (
    <svg
      viewBox="0 0 280 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-0 w-[220px] md:w-[280px] pointer-events-none select-none"
      aria-hidden="true"
    >
      <path d="M-20 10 C30 -10, 130 20, 160 110 C130 90, 60 80, -20 10Z" fill="#4a7c3f" opacity="0.18" />
      <path d="M-10 40 C40 10, 150 50, 170 160 C130 130, 50 110, -10 40Z" fill="#3d6b34" opacity="0.22" />
      <path d="M0 80 C50 40, 180 70, 200 200 C150 165, 60 150, 0 80Z" fill="#2d5225" opacity="0.28" />
      <path d="M30 0 C45 30, 55 80, 40 130 C30 100, 20 50, 30 0Z" fill="#4a7c3f" opacity="0.20" />
      <path d="M60 -10 C90 20, 110 75, 90 140 C75 110, 60 60, 60 -10Z" fill="#3d6b34" opacity="0.16" />
      <path d="M0 80 Q80 120 200 200" stroke="#2d5225" strokeWidth="1" opacity="0.18" fill="none" />
      <path d="M-10 40 Q70 90 170 160" stroke="#2d5225" strokeWidth="0.8" opacity="0.14" fill="none" />
      <path d="M100 10 C115 30, 125 60, 110 90 C100 65, 95 38, 100 10Z" fill="#4a7c3f" opacity="0.14" />
      <path d="M130 25 C148 48, 155 82, 138 115 C126 88, 122 56, 130 25Z" fill="#3d6b34" opacity="0.12" />
    </svg>
  );
}

function LeafClusterBottomRight() {
  return (
    <svg
      viewBox="0 0 280 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 right-0 w-[220px] md:w-[280px] pointer-events-none select-none"
      style={{ transform: "rotate(180deg)" }}
      aria-hidden="true"
    >
      <path d="M-20 10 C30 -10, 130 20, 160 110 C130 90, 60 80, -20 10Z" fill="#4a7c3f" opacity="0.18" />
      <path d="M-10 40 C40 10, 150 50, 170 160 C130 130, 50 110, -10 40Z" fill="#3d6b34" opacity="0.22" />
      <path d="M0 80 C50 40, 180 70, 200 200 C150 165, 60 150, 0 80Z" fill="#2d5225" opacity="0.28" />
      <path d="M30 0 C45 30, 55 80, 40 130 C30 100, 20 50, 30 0Z" fill="#4a7c3f" opacity="0.20" />
      <path d="M60 -10 C90 20, 110 75, 90 140 C75 110, 60 60, 60 -10Z" fill="#3d6b34" opacity="0.16" />
      <path d="M0 80 Q80 120 200 200" stroke="#2d5225" strokeWidth="1" opacity="0.18" fill="none" />
      <path d="M100 10 C115 30, 125 60, 110 90 C100 65, 95 38, 100 10Z" fill="#4a7c3f" opacity="0.14" />
      <path d="M130 25 C148 48, 155 82, 138 115 C126 88, 122 56, 130 25Z" fill="#3d6b34" opacity="0.12" />
    </svg>
  );
}

function GiftBoxIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" aria-hidden="true">
      <rect x="4" y="18" width="32" height="18" rx="1.5" stroke="#c49736" strokeWidth="1.4" fill="none" />
      <rect x="2" y="13" width="36" height="6" rx="1.5" stroke="#c49736" strokeWidth="1.4" fill="none" />
      <line x1="20" y1="13" x2="20" y2="36" stroke="#c49736" strokeWidth="1.4" />
      <line x1="2" y1="16" x2="38" y2="16" stroke="#c49736" strokeWidth="1.4" />
      <path d="M20 13 C16 8, 8 8, 10 13" stroke="#c49736" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M20 13 C24 8, 32 8, 30 13" stroke="#c49736" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="13" r="1.5" fill="#c49736" />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function FeaturedProductsAnimated({ products }: { products: Product[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current.children,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
          }
        );
      }
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".product-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 48, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.65,
            stagger: { amount: 0.5, from: "start" },
            ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 80%", once: true },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative section-py overflow-hidden"
      style={{ background: "#f7f3ee" }}
    >
      {/* ── Decorative leaf clusters ── */}
      <LeafClusterTopLeft />
      <LeafClusterBottomRight />

      {/* ── Gold arc left ── */}
      <svg viewBox="0 0 60 400" fill="none" xmlns="http://www.w3.org/2000/svg"
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-auto pointer-events-none select-none hidden lg:block"
        aria-hidden="true">
        <path d="M50 0 Q-20 200 50 400" stroke="#c49736" strokeWidth="0.8" opacity="0.25" fill="none" />
        <path d="M38 20 Q-30 200 38 380" stroke="#c49736" strokeWidth="0.5" opacity="0.15" fill="none" />
      </svg>

      {/* ── Gold arc right ── */}
      <svg viewBox="0 0 60 400" fill="none" xmlns="http://www.w3.org/2000/svg"
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[60%] w-auto pointer-events-none select-none hidden lg:block"
        style={{ transform: "translateY(-50%) scaleX(-1)" }}
        aria-hidden="true">
        <path d="M50 0 Q-20 200 50 400" stroke="#c49736" strokeWidth="0.8" opacity="0.25" fill="none" />
        <path d="M38 20 Q-30 200 38 380" stroke="#c49736" strokeWidth="0.5" opacity="0.15" fill="none" />
      </svg>

      {/* ── Top-left tagline ── */}
      <div className="absolute top-8 left-6 hidden lg:block pointer-events-none select-none">
        <p className="text-[10px] font-semibold tracking-[0.22em] leading-relaxed uppercase" style={{ color: "#6b5c3e" }}>
          Premium Gifts<br />For A Stronger<br />Tomorrow
        </p>
        <div className="mt-1.5 w-8 h-px" style={{ background: "#c49736" }} />
      </div>

      {/* ── Top-right cursive tagline ── */}
      <div className="absolute top-6 right-6 hidden lg:block pointer-events-none select-none text-right">
        <p style={{ fontFamily: "var(--font-script)", fontSize: "22px", color: "#b98a2f", lineHeight: 1.3 }}>
          Corporate Gifts<br />That Create<br />Connections
        </p>
      </div>

      {/* ── Bottom-left tagline ── */}
      <div className="absolute bottom-8 left-6 hidden lg:block pointer-events-none select-none">
        <div className="mb-1.5 w-8 h-px" style={{ background: "#c49736" }} />
        <p className="text-[10px] font-semibold tracking-[0.22em] leading-relaxed uppercase" style={{ color: "#6b5c3e" }}>
          Quality Gifts<br />Lasting Relationships
        </p>
      </div>

      {/* ── Bottom-right wordmark ── */}
      <div className="absolute bottom-8 right-6 hidden lg:block pointer-events-none select-none">
        <div className="flex items-center gap-2.5">
          <GiftBoxIcon />
          <div>
            <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "#c49736" }}>The Choice</p>
            <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: "#c49736" }}>Company</p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container-site relative z-10">

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-10" style={{ background: "#c49736" }} />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "#214a04" }}>
              Our Collection
            </span>
            <div className="h-px w-10" style={{ background: "#c49736" }} />
          </div>
          <h2 className="section-title mt-1">Featured Collections</h2>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageList = getImageList(product);
            const features = getFeatures(product);

            return (
              <div key={product.id} className="product-card opacity-0">
                <TiltCard className="h-full" maxTilt={6} scale={1.015}>
                  <div
                    className="flex flex-col h-full rounded-xl overflow-hidden bg-white group"
                    style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.06)", transition: "box-shadow 0.3s ease" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                  >
                    {/* Image area */}
                    <div className="relative flex-shrink-0">
                      {/* Bestseller badge */}
                      {product.tags?.includes("bestseller") && (
                        <div className="absolute top-3 left-3 z-10 pointer-events-none">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow"
                            style={{ background: "var(--orange)" }}
                          >
                            Bestseller
                          </span>
                        </div>
                      )}
                      {/* MOQ badge */}
                      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] font-semibold text-navy pointer-events-none shadow-sm">
                        MOQ {product.moq}
                      </div>
                      {/* Shared carousel — no local duplicate */}
                      <ImageCarousel
                        images={imageList}
                        productName={product.name}
                        productSlug={product.slug}
                        counterPosition="bottom-right"
                      />
                    </div>

                    {/* Card body */}
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.14em] mb-1.5">
                        {product.category}
                      </span>
                      <h3 className="font-serif font-bold text-[#10233f] text-[18px] leading-snug mb-4 line-clamp-2 group-hover:text-[#b98a2f] transition-colors duration-200">
                        {product.name}
                      </h3>

                      {/* Feature chips */}
                      <div className="flex items-center gap-3 mb-5 text-xs text-gray-500 flex-wrap">
                        {features.map((f, i) => (
                          <span key={i} className="flex items-center gap-1.5">
                            {i > 0 && <span className="h-4 w-px bg-gray-200 mr-1.5" />}
                            <span className="text-[#a87920]">{f.icon}</span>
                            {f.label}
                          </span>
                        ))}
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-[22px] font-bold text-[#10233f]">{formatINR(product.basePrice)}</span>
                        <span className="text-xs text-gray-400">/unit (bulk)</span>
                      </div>

                      {/* Stock */}
                      {product.stockStatus && (
                        <div className="mb-5">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full ${product.stockStatus === "IN_STOCK" ? "bg-green-50 text-green-700"
                            : product.stockStatus === "LOW_STOCK" ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-600"
                            }`}>
                            <span className="text-[8px]">●</span>
                            {product.stockStatus === "IN_STOCK" ? "In Stock"
                              : product.stockStatus === "LOW_STOCK" ? "Low Stock"
                                : "Out of Stock"}
                          </span>
                        </div>
                      )}

                      {/* CTAs */}
                      <div className="flex gap-2 mt-auto">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex-1 h-11 rounded-lg border border-[#10233f] flex items-center justify-center text-sm font-semibold text-[#10233f] transition-all duration-300 hover:bg-[#10233f] hover:text-white"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/bulk-orders?product=${product.slug}`}
                          className="flex-1 h-11 rounded-lg flex items-center justify-center text-sm font-semibold text-white bg-[#c49736] transition-all duration-300 hover:bg-[#ad8329] hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          Get Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="btn-outline-navy btn-lg inline-flex items-center gap-2 group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            View All Products
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}


