"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TiltCard from "@/components/ui/TiltCard";
import type { Product } from "@/lib/types/product.types";
import { formatINR } from "@/lib/utils/formatCurrency";

gsap.registerPlugin(ScrollTrigger, useGSAP);




function getImageList(product: Product): string[] {
  if (product.productImages && product.productImages.length > 0) {
    return product.productImages.sort((a, b) => a.sortOrder - b.sortOrder).map(img => img.listingUrl ?? img.imageUrl);
  }
  const all: string[] = [];
  if (product.image) all.push(product.image);
  if (product.images) all.push(...product.images.filter(Boolean));
  return [...new Set(all)];
}

function ImageCarousel({ images, productName, productSlug }: { images: string[]; productName: string; productSlug: string }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prev = useCallback((e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setCurrent(i => (i - 1 + total) % total); }, [total]);
  const next = useCallback((e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setCurrent(i => (i + 1) % total); }, [total]);

  return (
    <Link href={`/products/${productSlug}`} className="block relative h-64 bg-gray-50 overflow-hidden">
      {images.map((src, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-400 ${idx === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <Image src={src} alt={`${productName} — image ${idx + 1}`} fill className="object-contain p-4" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" priority={idx === 0} />
        </div>
      ))}
      {total > 1 && (
        <>
          <button onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center text-navy text-sm opacity-0 group-hover:opacity-100 transition-opacity">‹</button>
          <button onClick={next} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center text-navy text-sm opacity-0 group-hover:opacity-100 transition-opacity">›</button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/20">
            {images.map((_, idx) => (
              <button key={idx} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(idx); }} className={`rounded-full transition-all duration-200 ${idx === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </Link>
  );
}

export default function FeaturedProductsAnimated({ products }: { products: Product[] }) {
  const items = products; const sectionRef = useRef<HTMLElement>(null);
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
    <section ref={sectionRef} className="section-py bg-white">
      <div className="container-site">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12">
          <span className="section-label block">OUR COLLECTION</span>
          <h2 className="section-title mt-2">Featured Collections</h2>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => {
            const imageList = getImageList(product);
            return (
              <div key={product.id} className="product-card opacity-0">
                <TiltCard className="h-full" maxTilt={6} scale={1.015}>
                  <div
                    className="flex flex-col h-full rounded-xl overflow-hidden bg-white group"
                    style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.06)", transition: "box-shadow 0.3s ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                  >
                    {/* Image */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
                        {product.tags?.includes("bestseller") && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow" style={{ background: "var(--orange)" }}>
                            Bestseller
                          </span>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] font-semibold text-navy pointer-events-none shadow-sm">
                        MOQ {product.moq}
                      </div>
                      <ImageCarousel images={imageList} productName={product.name} productSlug={product.slug} />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{product.category}</span>
                      <h3 className="font-bold text-navy text-sm mb-1 leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-200">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{product.description}</p>

                      <div className="mb-3 flex items-baseline gap-1">
                        <span className="text-lg font-bold text-navy">{formatINR(product.basePrice)}</span>
                        <span className="text-xs text-gray-400">/unit (bulk)</span>
                      </div>

                      {product.stockStatus && (
                        <div className="mb-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${product.stockStatus === "IN_STOCK" ? "bg-green-100 text-green-700" : product.stockStatus === "LOW_STOCK" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                            {product.stockStatus === "IN_STOCK" ? "● In Stock" : product.stockStatus === "LOW_STOCK" ? "● Low Stock" : "● Out of Stock"}
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2 mt-auto">
                        <Link href={`/products/${product.slug}`} className="btn-sm btn-outline-navy flex-1 text-center transition-all duration-200 hover:-translate-y-0.5">
                          View Details
                        </Link>
                        <Link href={`/bulk-orders?product=${product.slug}`} className="btn-sm btn-gold flex-1 text-center transition-all duration-200 hover:-translate-y-0.5">
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

