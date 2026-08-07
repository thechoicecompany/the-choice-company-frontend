import { springApi } from "./client";
import type { BlogPost, BlogFilters, PaginatedResponse } from "@/lib/types/blog.types";

export async function fetchPosts(filters: BlogFilters): Promise<PaginatedResponse<BlogPost>> {
  const p = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")) as Record<string, string>
  );
  const res = await springApi.get(`/api/blog?${p.toString()}`);
  return res.data;
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await springApi.get(`/api/blog/${slug}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function fetchAllBlogSlugs(): Promise<string[]> {
  const res = await springApi.get("/api/blog/slugs");
  return res.data;
}

export async function fetchBlogCategories(): Promise<string[]> {
  const res = await springApi.get("/api/blog/categories");
  return res.data;
}
