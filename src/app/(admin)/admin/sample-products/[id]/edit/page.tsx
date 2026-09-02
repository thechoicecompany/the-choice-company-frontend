// app/admin/sample-products/[id]/edit/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SampleProductForm from "@/components/admin/sample-products/SampleProductForm";
import { fetchAdminSampleProduct, updateSampleProduct } from "@/lib/api/adminSampleProducts";
import type { AdminSampleProduct, UpdateSampleProductPayload } from "@/lib/types/sampleProduct.types";

export default function EditSampleProductPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [product, setProduct] = useState<AdminSampleProduct | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAdminSampleProduct(Number(id))
            .then(setProduct)
            .catch(err => setError(err instanceof Error ? err.message : "Failed to load product"));
    }, [id]);

    async function handleSubmit(payload: UpdateSampleProductPayload) {
        await updateSampleProduct(Number(id), payload);
        router.push("/admin/sample-products");
    }

    if (error) return <div className="p-6 text-red-600">{error}</div>;
    if (!product) return <div className="p-6 text-gray-400">Loading…</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-navy mb-6">Edit — {product.name}</h1>
            <SampleProductForm initial={product} onSubmit={handleSubmit} submitLabel="Save Changes" />
        </div>
    );
}