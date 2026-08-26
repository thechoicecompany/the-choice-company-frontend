"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { fetchAdminProduct, updateProduct } from "@/lib/api/admin";
import type { AdminProduct, UpdateProductPayload } from "@/lib/types/admin.types";

export default function EditProductPage() {
  const router = useRouter();
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

  async function handleSubmit(payload: UpdateProductPayload) {
    await updateProduct(id, payload);
    router.push("/admin/products");
    router.refresh();
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-7 h-7 border-4 border-navy border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !product) return (
    <div className="p-6 bg-red-50 rounded-2xl text-red-700 text-sm">
      ⚠ Failed to load product: {error}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* Quick links */}
      <div className="flex gap-3">
        <Link href={`/admin/products/${id}/pricing`}
          className="px-4 py-2 rounded-xl text-sm font-semibold border border-gold/40 text-amber-700 hover:bg-gold hover:text-white transition-all">
          💰 Manage Pricing Tiers
        </Link>
        <Link href="/admin/products"
          className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
          ← Back to Products
        </Link>
      </div>

      {/* Product info banner */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <img src={product.image} alt={product.name}
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
        <div>
          <p className="font-bold text-navy">{product.name}</p>
          <p className="text-xs text-gray-400">{product.slug} · {product.category}</p>
          {product.inventory && (
            <p className="text-xs text-gray-500 mt-0.5">
              Stock: <b className={product.inventory.availableQty <= 0 ? "text-red-600" : "text-green-600"}>
                {product.inventory.availableQty}
              </b> available
            </p>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <ProductForm
          initial={product}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
