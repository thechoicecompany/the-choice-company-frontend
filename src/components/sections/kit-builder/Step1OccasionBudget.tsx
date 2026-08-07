"use client";
import { OCCASIONS }     from "@/lib/constants/occasions";
import { BUDGET_RANGES } from "@/lib/constants/budgetRanges";
import type { KitBuilderHook } from "@/lib/hooks/useKitBuilder";

export default function Step1OccasionBudget({ kit }: { kit: KitBuilderHook }) {
  return (
    <div className="space-y-5">
      {/* Occasion */}
      <div className="card p-6">
        <h3 className="font-bold text-navy mb-1 flex items-center gap-2">
          <span className="text-xl">🗓</span> Select Occasion
        </h3>
        <p className="text-xs text-gray-500 mb-4">What is this corporate gift kit for?</p>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((occ) => (
            <button key={occ.slug} onClick={() => kit.setOccasion(occ.label)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                kit.occasion === occ.label
                  ? "bg-navy text-white border-navy"
                  : "border-gray-200 text-gray-600 hover:border-gold hover:text-gold"
              }`}>
              {occ.icon} {occ.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="card p-6">
        <h3 className="font-bold text-navy mb-1 flex items-center gap-2">
          <span className="text-xl">₹</span> Budget per Kit
        </h3>
        <p className="text-xs text-gray-500 mb-4">Select your per-unit gifting budget</p>
        <div className="flex flex-wrap gap-3">
          {BUDGET_RANGES.map((b) => (
            <button key={b.value} onClick={() => kit.setBudget(b.value)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                kit.budget === b.value
                  ? "bg-gold text-white border-gold"
                  : "border-gray-200 text-gray-600 hover:border-gold"
              }`}>
              {b.isLuxury ? "💎 " : ""}{b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="card p-6">
        <h3 className="font-bold text-navy mb-1 flex items-center gap-2">
          <span className="text-xl">👥</span> Order Quantity
        </h3>
        <p className="text-xs text-gray-500 mb-4">How many kits do you need? (min. 50)</p>
        <div className="flex items-center gap-4">
          <button onClick={() => kit.setQuantity(kit.quantity - 50)}
            className="w-10 h-10 rounded-full border-2 border-gray-200 font-bold text-xl hover:border-gold transition-colors flex items-center justify-center">
            −
          </button>
          <span className="text-2xl font-bold text-navy w-24 text-center">
            {kit.quantity.toLocaleString("en-IN")}
          </span>
          <button onClick={() => kit.setQuantity(kit.quantity + 50)}
            className="w-10 h-10 rounded-full border-2 border-gray-200 font-bold text-xl hover:border-gold transition-colors flex items-center justify-center">
            +
          </button>
          <span className="text-sm text-gray-400">kits</span>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={() => kit.setStep(2)}
        disabled={!kit.occasion || !kit.budget}
        className="btn-navy w-full py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed">
        Continue to Product Selection →
      </button>
    </div>
  );
}
