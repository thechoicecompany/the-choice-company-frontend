import { adminApi } from "@/lib/api/client";
import type { GalleryItem } from "@/lib/api/gallery";

export async function adminFetchGalleryItems(): Promise<GalleryItem[]> {
    const res = await adminApi.get("/api/admin/gallery");
    return res.data.data ?? [];
}

export async function adminCreateGalleryItem(form: FormData): Promise<GalleryItem> {
    const res = await adminApi.post("/api/admin/gallery", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
}

export async function adminUpdateGalleryItem(
    id: number,
    payload: {
        projectName: string;
        caption: string;
        category: string;
        clientIndustry?: string;
        quantity?: number;
        sortOrder?: number;
    }
): Promise<GalleryItem> {
    const res = await adminApi.patch(`/api/admin/gallery/${id}`, payload);
    return res.data.data;
}

export async function adminToggleGalleryItem(id: number): Promise<GalleryItem> {
    const res = await adminApi.patch(`/api/admin/gallery/${id}/toggle`);
    return res.data.data;
}

export async function adminDeleteGalleryItem(id: number): Promise<void> {
    await adminApi.delete(`/api/admin/gallery/${id}`);
}