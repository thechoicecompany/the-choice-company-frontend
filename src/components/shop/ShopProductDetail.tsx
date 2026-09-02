"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/hooks/useCart";
import { formatINR } from "@/lib/utils/formatCurrency";
import type { SampleProduct } from "@/lib/types/sampleProduct.types";

export default function ShopProductDetail({ product }: { product: SampleProduct }) {
  const { addItem, updateQty, getItem, isInCart } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = isInCart(product.id);
  const cartItem = getItem(product.id);
  const savePct = Math.round(((product.samplePrice - product.bulkPrice) / product.samplePrice) * 100);

  const handleAddToCart = () => {
    if (inCart) {
      updateQty(product.id, Math.min((cartItem?.quantity ?? 0) + qty, product.maxSampleQty));
    } else {
      addItem({
        id: product.id, name: product.name, slug: product.slug,
        image: product.image, category: product.category,
        samplePrice: product.samplePrice, maxSampleQty: product.maxSampleQty,
        moq: product.moq,
      });
      if (qty > 1) updateQty(product.id, qty);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* ── Image Gallery ── */}
      <div className="space-y-3">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          <Image src={product.images[activeImg] ?? product.image} alt={product.name}
            fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" priority />
          <span className="badge-gold absolute top-4 left-4">Sample Unit</span>
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-gold" : "border-gray-200 opacity-60 hover:opacity-100"
                  }`}>
                <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Product Info ── */}
      <div>
        <span className="badge-gray mb-3 inline-block">{product.category}</span>
        <h1 className="font-playfair text-3xl font-bold text-navy mb-3">{product.name}</h1>
        <p className="text-gray-600 leading-relaxed mb-5">{product.description}</p>

        {/* Pricing card */}
        <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50 mb-6">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-navy">{formatINR(product.samplePrice)}</span>
            <span className="text-sm text-gray-500">per sample unit</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-teal font-medium">
              Bulk rate: {formatINR(product.bulkPrice)}/unit (MOQ {product.moq})
            </span>
            <span className="badge text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded-full">
              Save {savePct}%
            </span>
          </div>
          <p className="text-xs text-gray-400">
            🚚 Free shipping · Delivered in {product.shippingDays}–{product.shippingDays + 2} working days
          </p>
        </div>

        {/* Specs */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
          {[
            ["Material", product.material],
            ["Dimensions", product.dimensions ?? "Standard"],
            ["Weight", product.weight ?? "Standard"],
            ["Max Sample Qty", `${product.maxSampleQty} units`],
            ["Bulk MOQ", `${product.moq} units`],
            ["Branding", product.brandingOptions.join(", ")],
          ].map(([label, value]) => (
            <div key={label} className="flex border-b border-gray-100 last:border-0">
              <div className="w-36 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600 flex-shrink-0">{label}</div>
              <div className="flex-1 px-4 py-3 text-xs text-gray-700">{value}</div>
            </div>
          ))}
        </div>

        {/* Qty + Add to Cart */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-10 h-11 flex items-center justify-center text-navy font-bold hover:bg-gray-50 transition-colors">
              −
            </button>
            <span className="w-10 text-center text-sm font-semibold text-navy">{qty}</span>
            <button onClick={() => setQty(q => Math.min(product.maxSampleQty, q + 1))}
              className="w-10 h-11 flex items-center justify-center text-navy font-bold hover:bg-gray-50 transition-colors">
              +
            </button>
          </div>
          <span className="text-xs text-gray-400">(max {product.maxSampleQty} samples)</span>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={handleAddToCart}
            className={`flex-1 py-3.5 rounded-xl font-semibold text-base transition-all ${added
              ? "bg-teal text-white"
              : "bg-gold text-white hover:bg-amber-600"
              }`}>
            {added ? "✓ Added to Cart!" : inCart ? "Update Cart" : "Add to Cart"}
          </button>
          {inCart && (
            <Link href="/cart" className="btn-outline-navy px-5 py-3.5 rounded-xl">
              View Cart →
            </Link>
          )}
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-2 gap-3">
          {[
            ["🔒", "Secure Payment", "Razorpay encrypted"],
            ["↩", "Easy Returns", "7-day return policy"],
            ["📞", "Support", "+91 62688 99194"],
            ["🏭", "Quality Assured", "5-stage QC check"],
          ].map(([icon, title, sub]) => (
            <div key={title as string} className="flex items-start gap-2 p-3 rounded-xl bg-gray-50">
              <span className="text-lg">{icon}</span>
              <div>
                <div className="text-xs font-bold text-navy">{title as string}</div>
                <div className="text-[10px] text-gray-400">{sub as string}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
