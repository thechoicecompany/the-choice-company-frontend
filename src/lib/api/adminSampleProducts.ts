import type {
    AdminSampleProduct, CreateSampleProductPayload, UpdateSampleProductPayload,
} from "@/lib/types/sampleProduct.types";
import type { ApiResponse, PagedResponse } from "@/lib/types/admin.types";
import { adminFetch } from "@/lib/api/admin";
export async function fetchAdminSampleProducts(
    page = 0, size = 20
): Promise<PagedResponse<AdminSampleProduct>> {
    const res = await adminFetch<ApiResponse<PagedResponse<AdminSampleProduct>>>(
        `/api/admin/sample-products?page=${page}&size=${size}`
    );
    return res.data;
}

export async function fetchAdminSampleProduct(id: number): Promise<AdminSampleProduct> {
    const res = await adminFetch<ApiResponse<AdminSampleProduct>>(`/api/admin/sample-products/${id}`);
    return res.data;
}

export async function createSampleProduct(
    payload: CreateSampleProductPayload
): Promise<AdminSampleProduct> {
    const res = await adminFetch<ApiResponse<AdminSampleProduct>>(
        "/api/admin/sample-products",
        { method: "POST", body: JSON.stringify(payload) }
    );
    fetch("/api/revalidate?path=/shop").catch(() => { });
    return res.data;
}

export async function updateSampleProduct(
    id: number, payload: UpdateSampleProductPayload
): Promise<AdminSampleProduct> {
    const res = await adminFetch<ApiResponse<AdminSampleProduct>>(
        `/api/admin/sample-products/${id}`,
        { method: "PATCH", body: JSON.stringify(payload) }
    );
    fetch(`/api/revalidate?path=/shop`).catch(() => { });
    fetch(`/api/revalidate?path=/shop/${res.data.slug}`).catch(() => { });
    return res.data;
}

export async function softDeleteSampleProduct(id: number): Promise<void> {
    await adminFetch(`/api/admin/sample-products/${id}`, { method: "DELETE" });
    fetch("/api/revalidate?path=/shop").catch(() => { });
}

export async function hardDeleteSampleProduct(id: number): Promise<void> {
    await adminFetch(`/api/admin/sample-products/${id}/permanent`, { method: "DELETE" });
    fetch("/api/revalidate?path=/shop").catch(() => { });
}

export async function deleteSampleProductImage(productId: number, imageId: number): Promise<void> {
    await adminFetch(`/api/admin/sample-products/${productId}/images/${imageId}`, { method: "DELETE" });
}