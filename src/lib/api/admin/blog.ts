
// lib/api/admin/blog.ts
import { adminApi } from "../client";   // ← was "./client" // assumed authenticated axios instance, same one your other /admin pages use
import type { AdminBlogPost, BlogRequest, ImageUploadResult } from "@/lib/types/blog.types";
import type { PaginatedResponse } from "@/lib/types/blog.types";

interface ApiEnvelope<T> { success: boolean; message?: string; data: T; }
interface SpringPagedResponse<T> {
    content: T[]; page: number; size: number; totalElements: number; totalPages: number; last: boolean;
}

function mapPage<T>(paged?: SpringPagedResponse<T>): PaginatedResponse<T> {
    if (!paged) return { data: [], total: 0, page: 1, perPage: 20, totalPages: 0 };
    return {
        data: paged.content ?? [],
        total: paged.totalElements ?? 0,
        page: (paged.page ?? 0) + 1,
        perPage: paged.size ?? 20,
        totalPages: paged.totalPages ?? 0,
    };
}

export async function fetchAdminBlogs(params: { status?: string; page?: number; size?: number }) {
    const res = await adminApi.get<ApiEnvelope<SpringPagedResponse<AdminBlogPost>>>("/api/admin/blog", { params });
    return mapPage(res.data?.data);
}

export async function fetchAdminBlogById(id: number): Promise<AdminBlogPost> {
    const res = await adminApi.get<ApiEnvelope<AdminBlogPost>>(`/api/admin/blog/${id}`);
    return res.data.data;
}

export async function createBlog(payload: BlogRequest): Promise<AdminBlogPost> {
    const res = await adminApi.post<ApiEnvelope<AdminBlogPost>>("/api/admin/blog", payload);
    return res.data.data;
}

export async function updateBlog(id: number, payload: BlogRequest): Promise<AdminBlogPost> {
    const res = await adminApi.put<ApiEnvelope<AdminBlogPost>>(`/api/admin/blog/${id}`, payload);
    return res.data.data;
}

export async function deleteBlog(id: number): Promise<void> {
    await adminApi.delete(`/api/admin/blog/${id}`);
}

export async function publishBlog(id: number): Promise<AdminBlogPost> {
    const res = await adminApi.patch<ApiEnvelope<AdminBlogPost>>(`/api/admin/blog/${id}/publish`);
    return res.data.data;
}

export async function unpublishBlog(id: number): Promise<AdminBlogPost> {
    const res = await adminApi.patch<ApiEnvelope<AdminBlogPost>>(`/api/admin/blog/${id}/unpublish`);
    return res.data.data;
}

export async function uploadFeaturedImage(file: File): Promise<ImageUploadResult> {
    const form = new FormData();
    form.append("file", file);
    const res = await adminApi.post<ApiEnvelope<ImageUploadResult>>("/api/admin/blog/upload/featured", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
}

export async function uploadContentImage(file: File): Promise<ImageUploadResult> {
    const form = new FormData();
    form.append("file", file);
    const res = await adminApi.post<ApiEnvelope<ImageUploadResult>>("/api/admin/blog/upload/content", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
}