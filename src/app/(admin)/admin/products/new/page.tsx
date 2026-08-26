"use client";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/api/admin";
import type { CreateProductPayload } from "@/lib/types/admin.types";

export default function NewProductPage() {
  const router = useRouter();

  async function handleSubmit(payload: CreateProductPayload) {
    await createProduct(payload);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm text-gray-500 mb-8">
          Fill in the details below. A pricing tier and inventory record will be created automatically.
        </p>
        <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
      </div>
    </div>
  );
}
