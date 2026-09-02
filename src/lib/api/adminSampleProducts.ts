import type {
    AdminSampleProduct, CreateSampleProductPayload, UpdateSampleProductPayload,
} from "@/lib/types/sampleProduct.types";
import type { ApiResponse, PagedResponse } from "@/lib/types/admin.types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8089";

// Reuses the exact adminFetch pattern from lib/api/admin.ts (401 handling, field-error surfacing).
async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== "undefined"
        ? localStorage.getItem("tcc_admin_token") : null;

    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    });

    if (res.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("tcc_admin_token");
        localStorage.removeItem("tcc_admin_user");
        document.cookie = "tcc_admin_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        window.location.href = "/admin/login?reason=session_expired";
        return new Promise(() => { });
    }

    const json = await res.json();
    if (!res.ok) {
        if (json.details && typeof json.details === "object" && !Array.isArray(json.details)) {
            const messages = Object.entries(json.details as Record<string, string>)
                .map(([field, msg]) => `${field}: ${msg}`).join("; ");
            throw new Error(messages || json.error || json.message || "Validation failed");
        }
        throw new Error(json.message ?? json.error ?? `API error ${res.status}`);
    }
    return json as T;
}

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
    // Revalidate the storefront so the new product shows up without waiting for ISR
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