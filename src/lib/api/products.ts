// import { springApi } from "./client";
// import type { Product, ProductFilters, PaginatedResponse } from "@/lib/types/product.types";

// // ── Internal shapes matching the backend exactly ────────────────────────────
// interface ApiEnvelope<T> {
//   success: boolean;
//   message?: string;
//   data: T;
// }
// interface SpringPagedResponse<T> {
//   content: T[];
//   page: number;
//   size: number;
//   totalElements: number;
//   totalPages: number;
//   last: boolean;
// }

// export async function fetchProducts(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
//   const p = new URLSearchParams();

//   Object.entries(filters).forEach(([k, v]) => {
//     if (v === undefined || v === "" || v === null) return;
//     if (k === "page") return;
//     p.set(k, String(v));
//   });

//   const requestedPage1Indexed = Number(filters.page) || 1;
//   p.set("page", String(Math.max(0, requestedPage1Indexed - 1)));

//   const res = await springApi.get<ApiEnvelope<SpringPagedResponse<Product>>>(
//     `/api/products?${p.toString()}`
//   );

//   const paged = res.data?.data;

//   if (!paged) {
//     return { data: [], total: 0, page: 1, perPage: 24, totalPages: 0 };
//   }

//   return {
//     data: paged.content ?? [],
//     total: paged.totalElements ?? 0,
//     page: (paged.page ?? 0) + 1,
//     perPage: paged.size ?? 24,
//     totalPages: paged.totalPages ?? 0,
//   };
// }

// export async function fetchProductBySlug(slug: string): Promise<Product | null> {
//   try {
//     const res = await springApi.get<ApiEnvelope<Product>>(`/api/products/${slug}`);
//     return res.data?.data ?? null;
//   } catch {
//     return null;
//   }
// }

// export async function fetchAllProductSlugs(): Promise<string[]> {
//   const res = await springApi.get<ApiEnvelope<string[]>>("/api/products/slugs");
//   return res.data?.data ?? [];
// }

// export async function fetchFeaturedProducts(): Promise<Product[]> {
//   const res = await springApi.get<ApiEnvelope<Product[]>>("/api/products/featured?limit=12");
//   return res.data?.data ?? [];
// }

// export async function fetchCategories(): Promise<string[]> {
//   const res = await springApi.get<ApiEnvelope<string[]>>("/api/products/categories");
//   return res.data?.data ?? [];
// }



import { springApi } from "./client";
import type { Product, ProductFilters, PaginatedResponse } from "@/lib/types/product.types";

// ── Internal shapes matching the backend exactly ────────────────────────────
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

export async function fetchProducts(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
  const p = new URLSearchParams();

  Object.entries(filters).forEach(([k, v]) => {
    if (v === undefined || v === "" || v === null) return;
    if (k === "page") return;
    p.set(k, String(v));
  });

  const requestedPage1Indexed = Number(filters.page) || 1;
  p.set("page", String(Math.max(0, requestedPage1Indexed - 1)));

  // ── TEMP DIAGNOSTIC LOGGING — remove once the 500 is root-caused ──────────
  console.log("[fetchProducts] NEXT_PUBLIC_API_URL raw env:", JSON.stringify(process.env.NEXT_PUBLIC_API_URL));
  console.log("[fetchProducts] springApi.defaults.baseURL:", JSON.stringify(springApi.defaults.baseURL));
  console.log("[fetchProducts] requesting path:", `/api/products?${p.toString()}`);

  try {
    const res = await springApi.get<ApiEnvelope<SpringPagedResponse<Product>>>(
      `/api/products?${p.toString()}`
    );

    console.log("[fetchProducts] response status:", res.status);

    const paged = res.data?.data;

    if (!paged) {
      console.warn("[fetchProducts] res.data.data was falsy — got:", JSON.stringify(res.data));
      return { data: [], total: 0, page: 1, perPage: 24, totalPages: 0 };
    }

    return {
      data: paged.content ?? [],
      total: paged.totalElements ?? 0,
      page: (paged.page ?? 0) + 1,
      perPage: paged.size ?? 24,
      totalPages: paged.totalPages ?? 0,
    };
  } catch (err: any) {
    console.error("[fetchProducts] THREW:", err?.message, "| status:", err?.status, "| name:", err?.name);
    throw err; // re-throw so we still see the 500 — this is just to log the cause before it propagates
  }
  // ── END TEMP DIAGNOSTIC LOGGING ────────────────────────────────────────────
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await springApi.get<ApiEnvelope<Product>>(`/api/products/${slug}`);
    return res.data?.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchAllProductSlugs(): Promise<string[]> {
  const res = await springApi.get<ApiEnvelope<string[]>>("/api/products/slugs");
  return res.data?.data ?? [];
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const res = await springApi.get<ApiEnvelope<Product[]>>("/api/products/featured?limit=12");
  return res.data?.data ?? [];
}

export async function fetchCategories(): Promise<string[]> {
  const res = await springApi.get<ApiEnvelope<string[]>>("/api/products/categories");
  return res.data?.data ?? [];
}