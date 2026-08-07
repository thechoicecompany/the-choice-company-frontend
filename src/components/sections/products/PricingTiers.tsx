import type { PricingTier } from "@/lib/types/product.types";
import { formatINR } from "@/lib/utils/formatCurrency";

export default function PricingTiers({ tiers }: { tiers: PricingTier[] }) {
  if (!tiers?.length) return null;
  return (
    <div className="mb-6">
      <h4 className="text-sm font-bold text-navy mb-3">Bulk Pricing Tiers</h4>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 bg-navy">
          <div className="px-4 py-2 text-xs font-bold text-gold">Quantity</div>
          <div className="px-4 py-2 text-xs font-bold text-gold">Price / Unit</div>
          <div className="px-4 py-2 text-xs font-bold text-gold">Savings</div>
        </div>
        {tiers.map((tier, i) => (
          <div key={i} className={`grid grid-cols-3 border-b border-gray-100 last:border-0 ${i === 0 ? "" : "bg-gray-50/50"}`}>
            <div className="px-4 py-3 text-sm text-gray-700">{tier.label || `${tier.minQty}–${tier.maxQty} units`}</div>
            <div className="px-4 py-3 text-sm font-bold text-navy">{formatINR(tier.price)}</div>
            <div className="px-4 py-3 text-xs text-teal font-medium">
              {i === 0 ? "Base price" : `Save ${Math.round(((tiers[0].price - tier.price) / tiers[0].price) * 100)}%`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
