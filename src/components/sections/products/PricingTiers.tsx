"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Tag } from "@phosphor-icons/react";

gsap.registerPlugin(useGSAP);


import type { PricingTier } from "@/lib/types/product.types";
interface PricingTiersProps {
  tiers: PricingTier[];
}

export default function PricingTiers({ tiers }: PricingTiersProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".tier-row", {
      opacity: 0,
      x: -10,
      stagger: 0.06,
      duration: 0.4,
      ease: "power2.out",
      delay: 0.5,
    });
  }, { scope: ref });

  if (!tiers || tiers.length === 0) return null;

  return (
    <div ref={ref} className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Tag size={14} weight="fill" className="text-amber-500" />
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Volume Pricing</span>
      </div>
      <div className="rounded-xl border border-zinc-200/80 overflow-hidden">
        <div className="grid grid-cols-3 bg-zinc-50 px-4 py-2.5 border-b border-zinc-200/80">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Qty Range</span>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-center">Per Unit</span>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-right">Savings</span>
        </div>
        {tiers.map((tier, i) => {
          const basePrice = tiers[0].price;
          const saving = i === 0 ? 0 : Math.round(((basePrice - tier.price) / basePrice) * 100);
          const isFirst = i === 0;
          const isLast = i === tiers.length - 1;
          return (
            <div
              key={i}
              className={`tier-row grid grid-cols-3 px-4 py-3 border-b border-zinc-100 last:border-0 transition-colors ${isFirst ? "bg-white" : "bg-white hover:bg-amber-50/50"
                }`}
            >
              <span className="text-sm text-zinc-700 font-medium">
                {isLast ? `${tier.minQty}+` : `${tier.minQty}–${tier.maxQty}`}
              </span>
              <span className="text-sm font-semibold text-zinc-900 text-center">
                ₹{tier.price.toFixed(2)}
              </span>
              <span className="text-right">
                {saving > 0 ? (
                  <span className="inline-block text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    -{saving}%
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-400">Base</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
