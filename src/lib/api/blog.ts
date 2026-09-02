import { springApi } from "./client";
import type { BlogPost, BlogFilters, PaginatedResponse } from "@/lib/types/blog.types";

// ── Internal shape matching the backend exactly ─────────────────────────────
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

export async function fetchPosts(filters: BlogFilters): Promise<PaginatedResponse<BlogPost>> {
  const p = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")) as Record<string, string>
  );

  const res = await springApi.get<ApiEnvelope<SpringPagedResponse<BlogPost>>>(`/api/blog?${p.toString()}`);
  const paged = res.data?.data;

  if (!paged) {
    return { data: [], total: 0, page: 1, perPage: 12, totalPages: 0 };
  }

  return {
    data: paged.content ?? [],
    total: paged.totalElements ?? 0,
    page: (paged.page ?? 0) + 1,
    perPage: paged.size ?? 12,
    totalPages: paged.totalPages ?? 0,
  };
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await springApi.get<ApiEnvelope<BlogPost>>(`/api/blog/${slug}`);
    return res.data?.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchAllBlogSlugs(): Promise<string[]> {
  const res = await springApi.get<ApiEnvelope<string[]>>("/api/blog/slugs");
  return res.data?.data ?? [];
}

export async function fetchBlogCategories(): Promise<string[]> {
  const res = await springApi.get<ApiEnvelope<string[]>>("/api/blog/categories");
  return res.data?.data ?? [];
}

