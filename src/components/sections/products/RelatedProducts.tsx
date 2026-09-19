"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import type { Product } from "@/lib/types/product.types";

gsap.registerPlugin(useGSAP);

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".related-card", {
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="pt-10 border-t border-zinc-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">You may also like</h2>
        <Link
          href="/products"
          className="text-sm text-amber-600 font-medium flex items-center gap-1 hover:gap-2 transition-all duration-200"
        >
          View all <ArrowRight size={14} weight="bold" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 4).map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="related-card group block rounded-2xl border border-zinc-200/80 bg-white overflow-hidden hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-square bg-zinc-100 overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3">
              <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">{p.category}</span>
              <h3 className="text-sm font-medium text-zinc-800 mt-0.5 leading-tight line-clamp-2">{p.name}</h3>
              <p className="text-xs text-zinc-400 mt-1">Min. {p.moq} units</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}