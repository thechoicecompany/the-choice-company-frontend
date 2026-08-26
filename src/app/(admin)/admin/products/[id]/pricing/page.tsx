"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PricingTierForm from "@/components/admin/PricingTierForm";
import { fetchAdminProduct, updateProductPricing } from "@/lib/api/admin";
import type { AdminProduct, PricingTier } from "@/lib/types/admin.types";

export default function PricingPage() {
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminProduct(id)
      .then(setProduct)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(basePrice: number, tiers: Omit<PricingTier, "id">[]) {
    const updated = await updateProductPricing(id, basePrice, tiers);
    setProduct(updated);
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-7 h-7 border-4 border-navy border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !product) return (
    <div className="p-6 bg-red-50 rounded-2xl text-red-700 text-sm">⚠ {error}</div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4">

      <div className="flex gap-3">
        <Link href={`/admin/products/${id}`}
          className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
          ← Back to Edit Product
        </Link>
        <Link href="/admin/products"
          className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
          ← All Products
        </Link>
      </div>

      {/* Product banner */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <img src={product.image} alt={product.name}
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
        <div>
          <p className="font-bold text-navy">{product.name}</p>
          <p className="text-xs text-gray-400">{product.category} · MOQ {product.moq} units</p>
        </div>
      </div>

      {/* Info box */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <b>Note:</b> Submitting this form replaces ALL existing pricing tiers atomically.
        Make sure to include all tiers including the ones you want to keep.
      </div>

      {/* Pricing form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <PricingTierForm
          productId={id}
          basePrice={product.basePrice}
          tiers={product.pricingTiers}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
