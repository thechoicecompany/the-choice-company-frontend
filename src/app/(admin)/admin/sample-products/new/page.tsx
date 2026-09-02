// app/admin/sample-products/new/page.tsx
"use client";
import { useRouter } from "next/navigation";
import SampleProductForm from "@/components/admin/sample-products/SampleProductForm";
import { createSampleProduct } from "@/lib/api/adminSampleProducts";
import type { CreateSampleProductPayload } from "@/lib/types/sampleProduct.types";

export default function NewSampleProductPage() {
    const router = useRouter();

    async function handleSubmit(payload: CreateSampleProductPayload) {
        await createSampleProduct(payload);
        router.push("/admin/sample-products");
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-navy mb-6">Add Sample Product</h1>
            <SampleProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
        </div>
    );
}