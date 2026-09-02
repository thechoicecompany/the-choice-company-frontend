"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchAdminProducts,
  softDeleteProduct,
} from "@/lib/api/admin";
import type { AdminProduct } from "@/lib/types/admin.types";

export default function ProductsListPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadProducts(p: number) {
    setLoading(true);
    setError("");
    try {
      const res = await fetchAdminProducts(p, 20);
      setProducts(res.content);
      setTotalPages(res.totalPages);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This can be undone by an admin later (soft delete).`)) return;
    setDeletingId(id);
    try {
      await softDeleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-7 h-7 border-4 border-navy border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="p-6 bg-red-50 rounded-2xl text-red-700 text-sm">Error: {error}</div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">Products</h1>
          <p className="text-sm text-gray-500">{products.length} product(s) on this page</p>
        </div>
        <Link href="/admin/products/new"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg,#0D1B2A,#1A5C4A)" }}>
          + New Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">MOQ</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  No products yet. Click "New Product" to add one.
                </td>
              </tr>
            )}
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-navy">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3 font-medium">Rs.{p.basePrice}</td>
                <td className="px-4 py-3 text-gray-600">{p.moq}</td>
                <td className="px-4 py-3">
                  {p.inventory ? (
                    <span className={p.inventory.availableQty <= 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                      {p.inventory.availableQty}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${p.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${p.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                      Edit
                    </Link>
                    <Link href={`/admin/products/${p.id}/pricing`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gold/40 text-amber-700 hover:bg-gold hover:text-white transition-all">
                      Pricing
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={deletingId === p.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                      {deletingId === p.id ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 disabled:opacity-40">
            Prev
          </button>
          <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 disabled:opacity-40">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

