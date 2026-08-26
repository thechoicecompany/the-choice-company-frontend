"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useProductFilter() {
  const router = useRouter();
  const params = useSearchParams();

  const filters = {
    category: params.get("category") ?? "",
    budget: params.get("budget") ?? "",
    occasion: params.get("occasion") ?? "",
    sort: params.get("sort") ?? "popular",
    page: params.get("page") ?? "1",
    moq: params.get("moq") ?? "",
  };

  const setFilter = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete("page"); // reset page on filter change
    router.push(`/products?${p.toString()}`);
  }, [params, router]);

  const clearFilters = useCallback(() => router.push("/products"), [router]);

  const hasActiveFilters = ["category", "budget", "occasion", "moq"].some((k) => params.has(k));

  return { filters, setFilter, clearFilters, hasActiveFilters };
}
