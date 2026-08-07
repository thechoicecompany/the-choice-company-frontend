"use client";
import { useEffect, useRef } from "react";
import type { KitBuilderHook } from "@/lib/hooks/useKitBuilder";

const SAMPLE_PRODUCTS = [
  { id:1,  name:"Steel Thermos",    icon:"🥤", price:280, category:"drinkware" },
  { id:2,  name:"Copper Bottle",    icon:"🍶", price:320, category:"drinkware" },
  { id:3,  name:"Coffee Mug",       icon:"☕", price:180, category:"drinkware" },
  { id:4,  name:"Laptop Bag",       icon:"💼", price:680, category:"bags" },
  { id:5,  name:"Backpack",         icon:"🎒", price:750, category:"bags" },
  { id:6,  name:"Tote Bag",         icon:"👜", price:220, category:"bags" },
  { id:7,  name:"Notepad",          icon:"📓", price:120, category:"desk" },
  { id:8,  name:"Pen Set",          icon:"🖊",  price:95,  category:"desk" },
  { id:9,  name:"Desk Organiser",   icon:"🗂",  price:340, category:"desk" },
  { id:10, name:"Wireless Mouse",   icon:"🖱",  price:420, category:"desk" },
  { id:11, name:"T-Shirt",          icon:"👕", price:280, category:"apparel" },
  { id:12, name:"Cap",              icon:"🧢", price:180, category:"apparel" },
  { id:13, name:"Dry Fruit Hamper", icon:"🫙", price:450, category:"food" },
  { id:14, name:"Scented Candle",   icon:"🕯",  price:260, category:"lifestyle" },
  { id:15, name:"Bamboo Pen",       icon:"✏",  price:65,  category:"desk" },
  { id:16, name:"Wireless Earbuds", icon:"🎧", price:890, category:"electronics" },
];

export default function Step4AICombo({ kit }: { kit: KitBuilderHook }) {
  const hasGenerated = useRef(false);

  const selectedProducts = SAMPLE_PRODUCTS.filter(p => kit.selectedProducts.has(p.id));
  const perKit           = selectedProducts.reduce((s, p) => s + p.price, 0);

  const generate = () => kit.generateAICombo(SAMPLE_PRODUCTS);

  return (
    <div className="space-y-5">
      {/* AI Generator Panel */}
      <div className="card p-6">
        <h3 className="font-bold text-navy mb-1 flex items-center gap-2">
          <span className="text-xl">🤖</span> AI Kit Recommendation
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          Our AI analyses your occasion, budget, and selected products to suggest the optimal combo
        </p>

        {/* Selected products summary */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedProducts.map(p => (
            <span key={p.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
              {p.icon} {p.name}
            </span>
          ))}
        </div>

        {/* Generate button */}
        {!kit.aiRecommendation && !kit.isAILoading && (
          <button onClick={generate} className="btn-navy w-full py-3.5 text-sm">
            ✨ Generate Best Combo with AI
          </button>
        )}

        {/* Thinking state */}
        {kit.isAILoading && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-navy anim-dot" />
              <span className="w-2.5 h-2.5 rounded-full bg-navy anim-dot-2" />
              <span className="w-2.5 h-2.5 rounded-full bg-navy anim-dot-3" />
            </div>
            <p className="text-sm text-navy font-medium">
              AI is analysing your products, occasion &amp; budget...
            </p>
          </div>
        )}

        {/* AI Result */}
        {kit.aiRecommendation && !kit.isAILoading && (
          <div className="p-5 rounded-xl border border-gold/30 bg-amber-50/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">✨</span>
              <span className="font-bold text-navy text-sm">AI Recommendation</span>
              <span className="badge-gold text-[10px] ml-auto">Powered by Claude</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{kit.aiRecommendation}</p>
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map(p => (
                <span key={p.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-100 text-green-800">
                  ✓ {p.name}
                </span>
              ))}
            </div>
            {/* Regenerate */}
            <button onClick={generate} className="mt-4 text-xs text-gold hover:underline font-medium">
              🔄 Regenerate recommendation
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="card p-5 bg-navy text-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gold">{kit.selectedCount}</div>
            <div className="text-xs text-white/60 mt-1">Products</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gold">₹{perKit.toLocaleString("en-IN")}</div>
            <div className="text-xs text-white/60 mt-1">Per Kit</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gold">
              ₹{(perKit * kit.quantity).toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-white/60 mt-1">Total Est.</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => kit.setStep(3)} className="btn-outline-navy flex-1">← Back</button>
        <button onClick={() => kit.setStep(5)}
          disabled={!kit.aiRecommendation && kit.selectedCount === 0}
          className="btn-gold flex-[3] disabled:opacity-40">
          Review &amp; Get Quote →
        </button>
      </div>
    </div>
  );
}
