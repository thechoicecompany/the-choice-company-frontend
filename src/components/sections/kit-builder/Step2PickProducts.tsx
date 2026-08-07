"use client";
import { useState } from "react";
import type { KitBuilderHook } from "@/lib/hooks/useKitBuilder";

const ALL_PRODUCTS = [
  { id:1,  name:"Steel Thermos",      icon:"🥤", price:280, category:"drinkware" },
  { id:2,  name:"Copper Bottle",      icon:"🍶", price:320, category:"drinkware" },
  { id:3,  name:"Coffee Mug",         icon:"☕", price:180, category:"drinkware" },
  { id:4,  name:"Laptop Bag",         icon:"💼", price:680, category:"bags" },
  { id:5,  name:"Backpack",           icon:"🎒", price:750, category:"bags" },
  { id:6,  name:"Tote Bag",           icon:"👜", price:220, category:"bags" },
  { id:7,  name:"Notepad",            icon:"📓", price:120, category:"desk" },
  { id:8,  name:"Pen Set",            icon:"🖊",  price:95,  category:"desk" },
  { id:9,  name:"Desk Organiser",     icon:"🗂",  price:340, category:"desk" },
  { id:10, name:"Wireless Mouse",     icon:"🖱",  price:420, category:"desk" },
  { id:11, name:"T-Shirt",            icon:"👕", price:280, category:"apparel" },
  { id:12, name:"Cap",                icon:"🧢", price:180, category:"apparel" },
  { id:13, name:"Dry Fruit Hamper",   icon:"🫙", price:450, category:"food" },
  { id:14, name:"Scented Candle",     icon:"🕯",  price:260, category:"lifestyle" },
  { id:15, name:"Bamboo Pen",         icon:"✏",  price:65,  category:"desk" },
  { id:16, name:"Wireless Earbuds",   icon:"🎧", price:890, category:"electronics" },
];

const TABS = ["all","drinkware","bags","desk","apparel","electronics","food","lifestyle"] as const;

export default function Step2PickProducts({ kit }: { kit: KitBuilderHook }) {
  const [tab, setTab] = useState<typeof TABS[number]>("all");
  const filtered = tab === "all" ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.category === tab);

  return (
    <div className="space-y-5">
      <div className="card p-6">
        <h3 className="font-bold text-navy mb-1 flex items-center gap-2">
          <span className="text-xl">🛍</span> Choose Products for Your Kit
        </h3>
        <p className="text-xs text-gray-500 mb-4">Select the items you want to include. AI will optimise the combo in the next step.</p>

        {/* Category tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-5 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all capitalize ${
                tab === t ? "bg-navy text-white shadow-sm" : "text-gray-500 hover:text-navy"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((product) => {
            const selected = kit.selectedProducts.has(product.id);
            return (
              <button key={product.id} onClick={() => kit.toggleProduct(product.id)}
                className={`relative p-3 rounded-xl border-2 text-center transition-all ${
                  selected
                    ? "border-navy bg-blue-50/50"
                    : "border-gray-200 bg-white hover:border-gold"
                }`}>
                {/* Checkmark */}
                {selected && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-navy rounded-full text-white text-[10px] flex items-center justify-center">✓</span>
                )}
                <div className="text-3xl mb-2">{product.icon}</div>
                <div className="text-xs font-semibold text-navy leading-tight">{product.name}</div>
                <div className="text-[11px] text-gray-400 mt-1">₹{product.price}/unit</div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Selected: <strong className="text-navy">{kit.selectedCount}</strong> products
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={() => kit.setStep(1)} className="btn-outline-navy flex-1">← Back</button>
        <button onClick={() => kit.setStep(3)}
          disabled={kit.selectedCount === 0}
          className="btn-navy flex-[3] disabled:opacity-40">
          Continue to Logo Upload →
        </button>
      </div>
    </div>
  );
}
