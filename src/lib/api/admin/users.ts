import { adminFetch } from "@/lib/api/admin";
import type { ApiResponse, AdminUser } from "@/lib/types/admin.types";

export interface AdminUserFull extends AdminUser {
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
}

export interface CreateUserPayload {
    fullName: string;
    email: string;
    password: string;
    role: AdminUser["role"];
}

export async function fetchAdminUsers(): Promise<AdminUserFull[]> {
    const res = await adminFetch<ApiResponse<AdminUserFull[]>>("/api/admin/users");
    return res.data;
}

export async function createAdminUser(payload: CreateUserPayload): Promise<AdminUserFull> {
    const res = await adminFetch<ApiResponse<AdminUserFull>>(
        "/api/admin/users",
        { method: "POST", body: JSON.stringify(payload) }
    );
    return res.data;
}

export async function toggleAdminUserActive(id: number): Promise<AdminUserFull> {
    const res = await adminFetch<ApiResponse<AdminUserFull>>(
        `/api/admin/users/${id}/toggle-active`,
        { method: "PATCH" }
    );
    return res.data;
}

export async function deleteAdminUser(id: number): Promise<void> {
    await adminFetch(`/api/admin/users/${id}`, { method: "DELETE" });
}