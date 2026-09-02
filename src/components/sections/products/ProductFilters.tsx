"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OCCASIONS } from "@/lib/constants/occasions";
import { BUDGET_RANGES } from "@/lib/constants/budgetRanges";

const CATEGORIES = [
  { slug: "gift-hampers", label: "Gift Hampers" },
  { slug: "laptop-bags", label: "Laptop Bags" },
  { slug: "drinkware", label: "Drinkware" },
  { slug: "office-essentials", label: "Office Essentials" },
  { slug: "apparel", label: "Apparel" },
  { slug: "travel-kits", label: "Travel Kits" },
  { slug: "eco-friendly", label: "Eco-Friendly Gifts" },
  { slug: "premium", label: "Premium Gifts" },
  { slug: "electronics", label: "Electronics" },
  { slug: "custom-merchandise", label: "Custom Merchandise" },
];

interface Props {
  activeFilters: { category?: string; budget?: string; occasion?: string; sort?: string };
}

export default function ProductFilters({ activeFilters }: Props) {
  const router = useRouter();

  const buildHref = (key: string, value: string) => {
    const p = new URLSearchParams(activeFilters as Record<string, string>);
    if (p.get(key) === value) p.delete(key); else p.set(key, value);
    p.delete("page");
    return `/products?${p.toString()}`;
  };

  const clearAll = () => router.push("/products");
  const hasActive = Object.values(activeFilters).some(Boolean);
  return (
    <div className="space-y-4">
      {/* Clear all */}
      {hasActive && (
        <button onClick={clearAll} className="text-xs text-red-500 hover:underline font-medium">
          ✕ Clear all filters
        </button>
      )}

      {/* Category */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Category</h4>
        <div className="space-y-0">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={buildHref("category", cat.slug)}
              className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs leading-tight transition-colors ${activeFilters.category === cat.slug
                ? "bg-navy text-white font-medium"
                : "text-gray-600 hover:bg-gray-50"
                }`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${activeFilters.category === cat.slug ? "bg-gold" : "bg-gray-300"}`} />
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Budget per Kit</h4>
        <div className="space-y-0">
          {BUDGET_RANGES.map((b) => (
            <Link key={b.value} href={buildHref("budget", b.value)}
              className={`flex items-center justify-between px-2 py-1 rounded-md text-xs leading-tight transition-colors ${activeFilters.budget === b.value
                ? "bg-gold text-white font-medium"
                : "text-gray-600 hover:bg-gray-50"
                }`}>
              <span>{b.label}</span>
              {b.isLuxury && <span>💎</span>}
            </Link>
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Occasion</h4>
        <div className="flex flex-wrap gap-1">
          {OCCASIONS.slice(0, 8).map((occ) => (
            <Link key={occ.slug} href={buildHref("occasion", occ.slug)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${activeFilters.occasion === occ.slug
                ? "bg-navy text-white border-navy"
                : "border-gray-200 text-gray-600 hover:border-navy"
                }`}>
              {occ.icon} {occ.label}
            </Link>
          ))}
        </div>
      </div>

      {/* MOQ */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Min. Order Qty</h4>
        <div className="flex flex-wrap gap-1">
          {["50", "100", "250", "500"].map((moq) => (
            <Link key={moq} href={buildHref("moq", moq)}
              className={`px-2 py-0.5 rounded-full text-[10px] border transition-colors ${activeFilters["moq" as keyof typeof activeFilters] === moq
                ? "bg-navy text-white border-navy font-medium"
                : "border-gray-200 text-gray-600 hover:border-navy"
                }`}>
              {moq}+ units
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

}
