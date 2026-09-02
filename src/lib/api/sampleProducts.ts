import { springApi } from "./client"; // reuse your existing axios instance
import type { SampleProduct } from "@/lib/types/sampleProduct.types";

interface ApiEnvelope<T> {
    success: boolean;
    message?: string;
    data: T;
}
interface SpringPagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export async function fetchSampleProducts(category?: string): Promise<SampleProduct[]> {
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    params.set("size", "100"); // shop grid shows everything on one page today

    const res = await springApi.get<ApiEnvelope<SpringPagedResponse<SampleProduct>>>(
        `/api/sample-products?${params.toString()}`
    );
    return res.data?.data?.content ?? [];
}

export async function fetchSampleProductBySlug(slug: string): Promise<SampleProduct | null> {
    try {
        const res = await springApi.get<ApiEnvelope<SampleProduct>>(`/api/sample-products/${slug}`);
        return res.data?.data ?? null;
    } catch {
        return null;
    }
}

export async function fetchAllSampleProductSlugs(): Promise<string[]> {
    const res = await springApi.get<ApiEnvelope<string[]>>("/api/sample-products/slugs");
    return res.data?.data ?? [];
}

export async function fetchSampleCategories(): Promise<string[]> {
    const res = await springApi.get<ApiEnvelope<string[]>>("/api/sample-products/categories");
    return res.data?.data ?? [];
}