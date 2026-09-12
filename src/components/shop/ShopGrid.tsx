"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TiltCard from "@/components/ui/TiltCard";
import { useCart } from "@/lib/hooks/useCart";
import { formatINR } from "@/lib/utils/formatCurrency";
import ImageCarousel from "@/components/shared/ImageCarousel";
import type { SampleProduct } from "@/lib/types/sampleProduct.types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CATEGORIES = [
  "All", "Drinkware", "Bags", "Eco-Friendly",
  "Desk Essentials", "Festive Hampers", "Employee Kits", "Electronics", "Stationery",
];

function getImageList(product: SampleProduct): string[] {
  const all: string[] = [];
  if (product.image) all.push(product.image);
  if (product.images) all.push(...product.images.filter(Boolean));
  return [...new Set(all)];
}

export default function ShopGridAnimated({ products }: { products: SampleProduct[] }) {
  const { addItem, isInCart } = useCart();
  const [activeTab, setActiveTab] = useState("All");
  const [added, setAdded] = useState<number | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const filtered = activeTab === "All" ? products : products.filter(p => p.category === activeTab);

  useGSAP(
    () => {
      // Tab bar slide in
      if (tabsRef.current) {
        gsap.fromTo(
          tabsRef.current.children,
          { opacity: 0, x: -12 },
          {
            opacity: 1, x: 0, stagger: 0.04, duration: 0.4, ease: "power2.out",
            scrollTrigger: { trigger: tabsRef.current, start: "top 90%", once: true }
          }
        );
      }
      // Grid cards
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".shop-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.6,
            stagger: { amount: 0.45, from: "start" },
            ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 82%", once: true }
          }
        );
      }
    },
    { scope: gridRef, dependencies: [activeTab] }
  );

  const handleAdd = (product: SampleProduct, buttonEl: HTMLButtonElement | null) => {
    addItem({
      id: product.id, name: product.name, slug: product.slug,
      image: product.image, category: product.category,
      samplePrice: product.samplePrice, bulkPrice: product.bulkPrice,  // ← added
      maxSampleQty: product.maxSampleQty,
      moq: product.moq,
    });
    setAdded(product.id);
    setTimeout(() => setAdded(null), 2000);

    if (buttonEl) {
      gsap.fromTo(buttonEl, { scale: 0.88 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    }
  };

  return (
    <>
      {/* Category Tabs */}
      <div ref={tabsRef} className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${activeTab === cat
              ? "bg-navy text-white border-navy shadow-md"
              : "border-gray-200 text-gray-600 hover:border-gold hover:text-gold"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filtered.map(product => {
          const inCart = isInCart(product.id);
          const justAdded = added === product.id;
          const savePct = Math.round(((product.samplePrice - product.bulkPrice) / product.samplePrice) * 100);
          const imageList = getImageList(product);

          return (
            <div key={product.id} className="shop-card opacity-0">
              <TiltCard className="h-full" maxTilt={5} scale={1.012}>
                <div
                  className="flex flex-col h-full rounded-xl overflow-hidden bg-white group"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.06)", transition: "box-shadow 0.3s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.11)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                >
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
                      <span className="badge-gold text-[10px]">Sample</span>
                      {product.tags.includes("bestseller") && (
                        <span className="badge text-[10px] bg-orange text-white" style={{ background: "var(--orange)" }}>Bestseller</span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 z-10 bg-white/90 rounded-lg px-2 py-1 text-[10px] font-semibold text-navy pointer-events-none">
                      Max {product.maxSampleQty}
                    </div>
                    <ImageCarousel
                      images={imageList}
                      productName={product.name}
                      productSlug={product.slug}
                      href={`/shop/${product.slug}`}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{product.category}</span>
                    <h3 className="font-bold text-navy text-sm mb-1 leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-200">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{product.description}</p>

                    {/* Pricing */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-navy">{formatINR(product.samplePrice)}</span>
                        <span className="text-xs text-gray-400">/sample</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-teal font-medium">Bulk: {formatINR(product.bulkPrice)}/unit</span>
                        <span className="text-[9px] bg-teal/10 text-teal px-1.5 py-0.5 rounded-full font-semibold">Save {savePct}%</span>
                      </div>
                    </div>

                    <div className="flex gap-3 text-[10px] text-gray-400 mb-3">
                      <span>🚚 {product.shippingDays}d delivery</span>
                      <span>📦 MOQ {product.moq}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="btn-sm btn-outline-navy flex-1 text-center transition-all duration-200 hover:-translate-y-0.5"
                      >
                        Details
                      </Link>
                      <button
                        onClick={(e) => handleAdd(product, e.currentTarget as HTMLButtonElement)}
                        className={`btn-sm flex-1 transition-all duration-200 hover:-translate-y-0.5 will-change-transform ${justAdded ? "bg-teal text-white" : inCart ? "btn-outline-navy" : "btn-gold"
                          }`}
                      >
                        {justAdded ? "✓ Added!" : inCart ? "In Cart" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500">No products in this category</p>
        </div>
      )}
    </>
  );
}