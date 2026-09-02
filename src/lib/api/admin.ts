import type {
    AdminProduct, ApiResponse, PagedResponse, DashboardStats,
    CreateProductPayload, UpdateProductPayload, PricingTier,
    InventoryResponse, UpdateInventoryPayload,
    Inquiry, InquiryStatus, CatalogueRequest,
    ContactMessage, ContactStatus,
} from "@/lib/types/admin.types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8089";


// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function adminFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("tcc_admin_token")
            : null;

    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    });

    // ── 401: session expired or token invalid ────────────────────────────────
    if (res.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("tcc_admin_token");
        localStorage.removeItem("tcc_admin_user");
        document.cookie =
            "tcc_admin_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        window.location.href = "/admin/login?reason=session_expired";
        // Return a never-resolving promise — navigation is in progress
        return new Promise(() => { });
    }

    const json = await res.json();

    if (!res.ok) {
        if (
            json.details &&
            typeof json.details === "object" &&
            !Array.isArray(json.details)
        ) {
            const messages = Object.entries(json.details as Record<string, string>)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join("; ");
            throw new Error(messages || json.error || json.message || "Validation failed");
        }
        throw new Error(json.message ?? json.error ?? `API error ${res.status}`);
    }

    return json as T;
}
// ── DASHBOARD ─────────────────────────────────────────────────────────────────
export async function fetchDashboardStats(): Promise<DashboardStats> {
    const res = await adminFetch<ApiResponse<DashboardStats>>(
        "/api/admin/dashboard/stats"
    );
    return res.data;
}

// ── PRODUCT WITH IMAGES ───────────────────────────────────────────────────────
/**
 * Creates a product + saves image metadata in one JSON call.
 * Images are already uploaded to Cloudinary by the frontend (via uploadSlots).
 * This sends the product data + resolved Cloudinary URLs to the backend.
 * Backend saves Product + ProductImage records in one transaction.
 */
export async function createProductWithImages(
    payload: Record<string, unknown>
): Promise<AdminProduct> {
    const res = await adminFetch<ApiResponse<AdminProduct>>(
        "/api/admin/products",
        { method: "POST", body: JSON.stringify(payload) }
    );
    return res.data;
}

/**
 * Bulk-upload images via backend in one multipart request.
 * Use when you want backend to handle all uploads in one shot.
 * Returns array of { url, publicId } from Cloudinary.
 */
export async function uploadImagesBulk(
    files: File[]
): Promise<Array<{ url: string; publicId: string }>> {
    const token = typeof window !== "undefined"
        ? localStorage.getItem("tcc_admin_token") : null;

    const form = new FormData();
    files.forEach(f => form.append("files", f));

    const res = await fetch(`${BASE}/api/upload/images/bulk`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
    });
    const json = await res.json();
    if (!res.ok) {
        if (json.details && typeof json.details === "object" && !Array.isArray(json.details)) {
            const messages = Object.entries(json.details as Record<string, string>)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join("; ");
            throw new Error(messages || json.error || json.message || `Upload error ${res.status}`);
        }
        throw new Error(json.message ?? json.error ?? `Upload error ${res.status}`);
    }
    return (json as { data: Array<{ url: string; publicId: string }> }).data;
}

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export async function fetchAdminProducts(
    page = 0, size = 20
): Promise<PagedResponse<AdminProduct>> {
    const res = await adminFetch<ApiResponse<PagedResponse<AdminProduct>>>(
        `/api/admin/products?page=${page}&size=${size}`
    );
    return res.data;
}

export async function fetchAdminProduct(id: number): Promise<AdminProduct> {
    const res = await adminFetch<ApiResponse<AdminProduct>>(
        `/api/admin/products/${id}`
    );
    return res.data;
}

export async function createProduct(
    payload: CreateProductPayload
): Promise<AdminProduct> {
    const res = await adminFetch<ApiResponse<AdminProduct>>(
        "/api/admin/products",
        { method: "POST", body: JSON.stringify(payload) }
    );
    return res.data;
}

export async function updateProduct(
    id: number, payload: UpdateProductPayload
): Promise<AdminProduct> {
    const res = await adminFetch<ApiResponse<AdminProduct>>(
        `/api/admin/products/${id}`,
        { method: "PATCH", body: JSON.stringify(payload) }
    );
    return res.data;
}

export async function updateProductPricing(
    id: number, basePrice: number, tiers: Omit<PricingTier, "id">[]
): Promise<AdminProduct> {
    const res = await adminFetch<ApiResponse<AdminProduct>>(
        `/api/admin/products/${id}/pricing`,
        { method: "PUT", body: JSON.stringify({ basePrice, pricingTiers: tiers }) }
    );
    return res.data;
}

export async function softDeleteProduct(id: number): Promise<void> {
    await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
}

export async function hardDeleteProduct(id: number): Promise<void> {
    await adminFetch(`/api/admin/products/${id}/permanent`, { method: "DELETE" });
}

// ── INVENTORY ─────────────────────────────────────────────────────────────────
export async function fetchAllInventory(): Promise<InventoryResponse[]> {
    const res = await adminFetch<ApiResponse<InventoryResponse[]>>(
        "/api/admin/products/inventory"
    );
    return res.data;
}

export async function fetchProductInventory(
    productId: number
): Promise<InventoryResponse> {
    const res = await adminFetch<ApiResponse<InventoryResponse>>(
        `/api/admin/products/${productId}/inventory`
    );
    return res.data;
}

export async function updateInventory(
    productId: number, payload: UpdateInventoryPayload
): Promise<InventoryResponse> {
    const res = await adminFetch<ApiResponse<InventoryResponse>>(
        `/api/admin/products/${productId}/inventory`,
        { method: "PATCH", body: JSON.stringify(payload) }
    );
    return res.data;
}

export async function fetchLowStock(): Promise<InventoryResponse[]> {
    const res = await adminFetch<ApiResponse<InventoryResponse[]>>(
        "/api/admin/products/inventory/low-stock"
    );
    return res.data;
}

export async function fetchOutOfStock(): Promise<InventoryResponse[]> {
    const res = await adminFetch<ApiResponse<InventoryResponse[]>>(
        "/api/admin/products/inventory/out-of-stock"
    );
    return res.data;
}

// ── INQUIRIES ─────────────────────────────────────────────────────────────────
export async function fetchInquiries(params: {
    page?: number; size?: number;
    status?: InquiryStatus; state?: string; category?: string;
}): Promise<PagedResponse<Inquiry>> {
    const q = new URLSearchParams();
    if (params.page !== undefined) q.set("page", String(params.page));
    if (params.size !== undefined) q.set("size", String(params.size));
    if (params.status) q.set("status", params.status);
    if (params.state) q.set("state", params.state);
    if (params.category) q.set("category", params.category);

    const res = await adminFetch<ApiResponse<PagedResponse<Inquiry>>>(
        `/api/inquiries?${q.toString()}`
    );
    return res.data;
}

export async function fetchInquiry(id: number): Promise<Inquiry> {
    const res = await adminFetch<ApiResponse<Inquiry>>(`/api/inquiries/${id}`);
    return res.data;
}

export async function updateInquiryStatus(
    id: number, status: InquiryStatus, note?: string
): Promise<Inquiry> {
    const res = await adminFetch<ApiResponse<Inquiry>>(
        `/api/inquiries/${id}/status`,
        { method: "PATCH", body: JSON.stringify({ status, note }) }
    );
    return res.data;
}

export async function addInquiryNote(
    id: number, content: string
): Promise<Inquiry> {
    const res = await adminFetch<ApiResponse<Inquiry>>(
        `/api/inquiries/${id}/notes`,
        { method: "POST", body: JSON.stringify({ content }) }
    );
    return res.data;
}

// ── CATALOGUE ─────────────────────────────────────────────────────────────────
export async function fetchCatalogueRequests(
    page = 0, size = 20
): Promise<PagedResponse<CatalogueRequest>> {
    const res = await adminFetch<ApiResponse<PagedResponse<CatalogueRequest>>>(
        `/api/catalogue/admin/requests?page=${page}&size=${size}`
    );
    return res.data;
}

export async function deleteProductImage(
    productId: number, imageId: number
): Promise<void> {
    await adminFetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: "DELETE",
    });
}


// ── CONTACT MESSAGES ──────────────────────────────────────────────────────────
// NEW — mirrors fetchInquiries/updateInquiryStatus exactly, hits ContactController.
export async function fetchContactMessages(params: {
    page?: number; size?: number; status?: ContactStatus;
}): Promise<PagedResponse<ContactMessage>> {
    const q = new URLSearchParams();
    if (params.page !== undefined) q.set("page", String(params.page));
    if (params.size !== undefined) q.set("size", String(params.size));
    if (params.status) q.set("status", params.status);

    const res = await adminFetch<ApiResponse<PagedResponse<ContactMessage>>>(
        `/api/admin/contact?${q.toString()}`
    );
    return res.data;
}

export async function fetchContactMessage(id: number): Promise<ContactMessage> {
    const res = await adminFetch<ApiResponse<ContactMessage>>(
        `/api/admin/contact/${id}`
    );
    return res.data;
}

export async function updateContactMessageStatus(
    id: number, status: ContactStatus, assignedTo?: number
): Promise<ContactMessage> {
    const res = await adminFetch<ApiResponse<ContactMessage>>(
        `/api/admin/contact/${id}/status`,
        { method: "PATCH", body: JSON.stringify({ status, assignedTo }) }
    );
    return res.data;
}
