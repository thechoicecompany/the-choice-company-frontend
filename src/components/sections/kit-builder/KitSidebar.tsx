"use client";
import type { KitBuilderHook } from "@/lib/hooks/useKitBuilder";

const PRODUCTS_MAP: Record<number, { name: string; icon: string; price: number }> = {
  1:  { name:"Steel Thermos",    icon:"🥤", price:280 },
  2:  { name:"Copper Bottle",    icon:"🍶", price:320 },
  3:  { name:"Coffee Mug",       icon:"☕", price:180 },
  4:  { name:"Laptop Bag",       icon:"💼", price:680 },
  5:  { name:"Backpack",         icon:"🎒", price:750 },
  6:  { name:"Tote Bag",         icon:"👜", price:220 },
  7:  { name:"Notepad",          icon:"📓", price:120 },
  8:  { name:"Pen Set",          icon:"🖊",  price:95  },
  9:  { name:"Desk Organiser",   icon:"🗂",  price:340 },
  10: { name:"Wireless Mouse",   icon:"🖱",  price:420 },
  11: { name:"T-Shirt",          icon:"👕", price:280 },
  12: { name:"Cap",              icon:"🧢", price:180 },
  13: { name:"Dry Fruit Hamper", icon:"🫙", price:450 },
  14: { name:"Scented Candle",   icon:"🕯",  price:260 },
  15: { name:"Bamboo Pen",       icon:"✏",  price:65  },
  16: { name:"Wireless Earbuds", icon:"🎧", price:890 },
};

export default function KitSidebar({ kit }: { kit: KitBuilderHook }) {
  const items  = [...kit.selectedProducts].map(id => PRODUCTS_MAP[id]).filter(Boolean);
  const perKit = items.reduce((s, p) => s + p.price, 0);
  const total  = perKit * kit.quantity;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="px-5 py-4" style={{ background: "var(--navy)" }}>
        <div className="font-semibold text-white text-sm">Your Kit</div>
        <div className="text-[11px] text-white/55 mt-0.5">
          {kit.occasion || "No occasion"} · {kit.budget || "No budget"} · {kit.quantity} kits
        </div>
      </div>

      {/* Items */}
      <div className="p-4 min-h-[120px]">
        {items.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">🎁</div>
            <p className="text-xs text-gray-400">Add products to start building your kit</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-navy truncate">{item.name}</div>
                  <div className="text-[11px] text-gray-400">₹{item.price}/unit</div>
                </div>
                <button
                  onClick={() => kit.toggleProduct([...kit.selectedProducts][i])}
                  className="text-[11px] text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      {items.length > 0 && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Products in kit</span><span className="font-medium text-navy">{items.length}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Est. per kit</span><span className="font-medium text-navy">₹{perKit.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Quantity</span><span className="font-medium text-navy">{kit.quantity} kits</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
            <span className="text-navy">Est. Total</span>
            <span style={{ color: "var(--gold)" }}>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="p-4 border-t border-gray-100 flex gap-2">
        <button onClick={() => kit.setStep(5)}
          className="btn-gold flex-1 text-sm py-2.5">
          📋 Get Quote
        </button>
      </div>

      {/* Logo indicator */}
      {kit.logoUrl && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
            <span className="text-sm">🏢</span>
            <span className="text-[11px] text-green-700 font-medium">Logo uploaded ✓</span>
          </div>
        </div>
      )}
    </div>
  );
}
