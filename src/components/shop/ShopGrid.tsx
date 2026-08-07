"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { SAMPLE_PRODUCTS } from "@/lib/constants/sampleProducts";
import { formatINR } from "@/lib/utils/formatCurrency";

const CATEGORIES = ["All", "Drinkware", "Bags", "Eco-Friendly", "Desk Essentials", "Festive Hampers", "Employee Kits", "Electronics", "Stationery"];

export default function ShopGrid() {
  const { addItem, isInCart } = useCart();
  const [activeTab, setActiveTab] = useState("All");
  const [added, setAdded] = useState<number | null>(null);

  const filtered = activeTab === "All"
    ? SAMPLE_PRODUCTS
    : SAMPLE_PRODUCTS.filter(p => p.category === activeTab);

  const handleAdd = (product: typeof SAMPLE_PRODUCTS[0]) => {
    addItem({
      id:          product.id,
      name:        product.name,
      slug:        product.slug,
      image:       product.image,
      category:    product.category,
      samplePrice: product.samplePrice,
      maxSampleQty:product.maxSampleQty,
      moq:         product.moq,
    });
    setAdded(product.id);
    setTimeout(() => setAdded(null), 2000);
  };

  return (
    <>
      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeTab === cat
                ? "bg-navy text-white border-navy"
                : "border-gray-200 text-gray-600 hover:border-gold hover:text-gold"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(product => {
          const inCart   = isInCart(product.id);
          const justAdded= added === product.id;
          const savePct  = Math.round(((product.samplePrice - product.bulkPrice) / product.samplePrice) * 100);

          return (
            <div key={product.id} className="card group flex flex-col">
              {/* Image */}
              <div className="relative h-48 bg-gray-50 overflow-hidden flex-shrink-0">
                <Image src={product.image} alt={product.name} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="badge-gold text-[10px]">Sample</span>
                  {product.tags.includes("bestseller") && (
                    <span className="badge text-[10px] bg-orange text-white">Bestseller</span>
                  )}
                </div>
                {/* Max qty badge */}
                <div className="absolute top-3 right-3 bg-white/90 rounded-lg px-2 py-1 text-[10px] font-semibold text-navy">
                  Max {product.maxSampleQty} units
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  {product.category}
                </span>
                <h3 className="font-bold text-navy text-sm mb-1 leading-snug line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{product.description}</p>

                {/* Pricing */}
                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-navy">{formatINR(product.samplePrice)}</span>
                    <span className="text-xs text-gray-400">/sample unit</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-teal font-medium">
                      Bulk: {formatINR(product.bulkPrice)}/unit
                    </span>
                    <span className="badge text-[9px] bg-teal/10 text-teal px-1.5 py-0.5 rounded-full">
                      Save {savePct}% in bulk
                    </span>
                  </div>
                </div>

                {/* Delivery + MOQ info */}
                <div className="flex gap-3 text-[10px] text-gray-400 mb-3">
                  <span>🚚 {product.shippingDays} day delivery</span>
                  <span>📦 MOQ {product.moq} for bulk</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <Link href={`/shop/${product.slug}`}
                    className="btn-sm btn-outline-navy flex-1 text-center">
                    Details
                  </Link>
                  <button onClick={() => handleAdd(product)}
                    className={`btn-sm flex-1 transition-all ${
                      justAdded
                        ? "bg-teal text-white"
                        : inCart
                        ? "btn-outline-navy"
                        : "btn-gold"
                    }`}>
                    {justAdded ? "✓ Added!" : inCart ? "In Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 col-span-full">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500">No products in this category</p>
        </div>
      )}
    </>
  );
}
