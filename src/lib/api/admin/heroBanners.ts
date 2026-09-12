import { adminFetch } from "@/lib/api/admin";
import type { ApiResponse } from "@/lib/types/admin.types";
import type {
    HeroBanner,
    CreateHeroBannerPayload,
    UpdateHeroBannerPayload,
    ImageUploadResult,
} from "@/lib/types/heroBanner.types";

// ── Public — no auth ─────────────────────────────────────────────────────────

export async function getActiveBanners(): Promise<HeroBanner[]> {
    const API = process.env.NEXT_PUBLIC_API_URL;
    if (!API) return [];

    try {
        const res = await fetch(`${API}/api/hero-banners`, {
            next: {
                revalidate: 300, // fallback ceiling — normally busted instantly via the tag
                tags: ["hero-banners"],
            },
        });

        if (!res.ok) {
            return [];
        }

        const data = await res.json();

        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

// ── Admin ────────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/hero-banners
 *
 * Spring Boot returns:
 * [
 *   { ... },
 *   { ... }
 * ]
 *
 * Therefore this is HeroBanner[], NOT ApiResponse<HeroBanner[]>.
 */
export async function getAllBanners(): Promise<HeroBanner[]> {
    const res = await adminFetch<HeroBanner[]>(
        "/api/admin/hero-banners"
    );

    return Array.isArray(res) ? res : [];
}

/**
 * GET /api/admin/hero-banners/{id}
 */
export async function getBannerById(id: number): Promise<HeroBanner> {
    const res = await adminFetch<HeroBanner>(
        `/api/admin/hero-banners/${id}`
    );

    return res;
}

/**
 * POST /api/admin/hero-banners
 *
 * The proxy route revalidates the "hero-banners" tag on a successful
 * response, so the public homepage picks this up on its very next request.
 */
export async function createBanner(
    payload: CreateHeroBannerPayload
): Promise<HeroBanner> {
    const res = await adminFetch<HeroBanner>(
        "/api/admin/hero-banners",
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );

    return res;
}

/**
 * PUT /api/admin/hero-banners/{id}
 */
export async function updateBanner(
    id: number,
    payload: UpdateHeroBannerPayload
): Promise<HeroBanner> {
    const res = await adminFetch<HeroBanner>(
        `/api/admin/hero-banners/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(payload),
        }
    );

    return res;
}

/**
 * DELETE /api/admin/hero-banners/{id}
 *
 * Backend returns 204 No Content. The proxy route now returns that as a
 * null-body response (instead of crashing) and revalidates "hero-banners"
 * before returning, so a deleted banner's image never gets served stale.
 */
export async function deleteBanner(id: number): Promise<void> {
    await adminFetch(
        `/api/admin/hero-banners/${id}`,
        {
            method: "DELETE",
        }
    );
}

/**
 * PATCH /api/admin/hero-banners/{id}/toggle
 */
export async function toggleBannerActive(
    id: number
): Promise<HeroBanner> {
    const res = await adminFetch<HeroBanner>(
        `/api/admin/hero-banners/${id}/toggle`,
        {
            method: "PATCH",
        }
    );

    return res;
}

/**
 * POST /api/admin/hero-banners/reorder
 */
export async function reorderBanners(
    orderedIds: number[]
): Promise<HeroBanner[]> {
    const res = await adminFetch<HeroBanner[]>(
        "/api/admin/hero-banners/reorder",
        {
            method: "POST",
            body: JSON.stringify({ orderedIds }),
        }
    );

    return Array.isArray(res) ? res : [];
}

// ── Upload ───────────────────────────────────────────────────────────────────

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export async function uploadBannerImage(
    file: File
): Promise<ImageUploadResult> {
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(
            "Only JPEG, PNG, or WebP images are allowed."
        );
    }

    if (file.size > MAX_FILE_BYTES) {
        throw new Error(
            "Image must be under 5 MB."
        );
    }

    const fd = new FormData();

    fd.append("file", file);
    fd.append("folder", "tcc/hero-banners");

    const res = await fetch(
        "/api/proxy/api/upload/image-with-id",
        {
            method: "POST",
            body: fd,
        }
    );

    const json = await res.json();

    if (!res.ok) {
        const err = json as {
            message?: string;
            error?: string;
        };

        throw new Error(
            err.message ??
            err.error ??
            `Upload failed: ${res.status}`
        );
    }

    return (
        (json as ApiResponse<ImageUploadResult>).data ??
        json
    ) as ImageUploadResult;
}
