import { springApi } from "./client";
import type { Product, ProductDetail, ProductFilters, PaginatedResponse } from "@/lib/types/product.types";

export async function fetchProducts(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
  const p = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) p.set(k, String(v));
  });
  const res = await springApi.get(`/api/products?${p.toString()}`);
  return res.data;
}

export async function fetchProductBySlug(slug: string): Promise<ProductDetail | null> {
  try {
    const res = await springApi.get(`/api/products/${slug}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function fetchAllProductSlugs(): Promise<string[]> {
  const res = await springApi.get("/api/products/slugs");
  return res.data;
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const res = await springApi.get("/api/products?featured=true&limit=6");
  return res.data?.data ?? [];
}
