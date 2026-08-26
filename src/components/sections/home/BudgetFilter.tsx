"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BUDGET_RANGES } from "@/lib/constants/budgetRanges";

function BudgetFilterContent() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("budget");

  const select = (value: string) => {
    router.push(`/products?budget=${value}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 justify-center">
      <span className="section-label !mb-0 !text-xs">SHOP BY BUDGET:</span>
      {BUDGET_RANGES.map((b) => (
        <button key={b.value} onClick={() => select(b.value)}
          className={`px-5 py-2 rounded-md text-sm font-medium border-2 transition-all ${active === b.value
            ? "bg-navy text-white border-navy"
            : b.isLuxury
              ? "border-gold text-gold hover:bg-gold hover:text-white"
              : "border-gray-200 text-gray-600 hover:border-navy hover:text-navy"
            }`}>
          {b.isLuxury ? "💎 " : ""}{b.label}
        </button>
      ))}
    </div>
  );
}

export default function BudgetFilter() {
  return (
    <section className="py-6 bg-white border-b border-gray-100">
      <div className="container-site">
        <Suspense fallback={
          <div className="flex justify-center">
            <div className="h-9 w-64 bg-gray-100 rounded-md animate-pulse" />
          </div>
        }>
          <BudgetFilterContent />
        </Suspense>
      </div>
    </section>
  );
}