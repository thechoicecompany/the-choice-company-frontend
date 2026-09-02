// app/admin/sample-products/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { AdminSampleProduct } from "@/lib/types/sampleProduct.types";
import {
    fetchAdminSampleProducts, softDeleteSampleProduct, hardDeleteSampleProduct,
} from "@/lib/api/adminSampleProducts";
import { formatINR } from "@/lib/utils/formatCurrency";

export default function AdminSampleProductsPage() {
    const [products, setProducts] = useState<AdminSampleProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    async function load() {
        setLoading(true);
        try {
            const res = await fetchAdminSampleProducts(page, 20);
            setProducts(res.content ?? (res as any).data ?? []);
            setTotalPages(res.totalPages ?? 1);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load products");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [page]);

    async function handleToggleActive(p: AdminSampleProduct) {
        // Soft delete = deactivate; re-activation goes through the edit form's toggle.
        if (!confirm(p.isActive ? `Deactivate "${p.name}"?` : `Reactivate "${p.name}"?`)) return;
        try {
            if (p.isActive) {
                await softDeleteSampleProduct(p.id);
            } else {
                // reuse update endpoint to flip isActive back on
                const { updateSampleProduct } = await import("@/lib/api/adminSampleProducts");
                await updateSampleProduct(p.id, { isActive: true });
            }
            load();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Action failed");
        }
    }

    async function handleHardDelete(p: AdminSampleProduct) {
        if (!confirm(`Permanently delete "${p.name}"? This cannot be undone.`)) return;
        try {
            await hardDeleteSampleProduct(p.id);
            load();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Delete failed");
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Sample Shop Products</h1>
                    <p className="text-sm text-gray-500">Manage what appears in /shop — only active products are shown to visitors.</p>
                </div>
                <Link href="/admin/sample-products/new"
                    className="px-5 py-2.5 rounded-xl font-bold text-white text-sm"
                    style={{ background: "linear-gradient(135deg,#0D1B2A,#1A5C4A)" }}>
                    + Add Product
                </Link>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-4 text-sm">{error}</div>}

            <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                        <tr>
                            <th className="text-left px-4 py-3">Product</th>
                            <th className="text-left px-4 py-3">Category</th>
                            <th className="text-left px-4 py-3">Sample ₹</th>
                            <th className="text-left px-4 py-3">Bulk ₹ / MOQ</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-right px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading…</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-400">No products yet.</td></tr>
                        ) : products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-navy">{p.name}</p>
                                            <p className="text-xs text-gray-400">{p.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                                <td className="px-4 py-3 font-semibold text-navy">{formatINR(p.samplePrice)}</td>
                                <td className="px-4 py-3 text-gray-600">{formatINR(p.bulkPrice)} / {p.moq}u</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.isActive ? "bg-teal/10 text-teal" : "bg-gray-100 text-gray-400"
                                        }`}>
                                        {p.isActive ? "ACTIVE" : "INACTIVE"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                                    <Link href={`/admin/sample-products/${p.id}/edit`}
                                        className="text-xs font-semibold text-navy hover:underline">Edit</Link>
                                    <button onClick={() => handleToggleActive(p)}
                                        className="text-xs font-semibold text-amber-600 hover:underline">
                                        {p.isActive ? "Deactivate" : "Reactivate"}
                                    </button>
                                    <button onClick={() => handleHardDelete(p)}
                                        className="text-xs font-semibold text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button key={i} onClick={() => setPage(i)}
                            className={`w-8 h-8 rounded-lg text-xs font-semibold ${page === i ? "bg-navy text-white" : "bg-gray-100 text-gray-600"
                                }`}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}