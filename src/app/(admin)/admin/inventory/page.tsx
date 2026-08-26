"use client";
import { useEffect, useState } from "react";
import { fetchAllInventory, updateInventory } from "@/lib/api/admin";
import AdminBadge from "@/components/admin/AdminBadge";
import InventoryActionModal from "@/components/admin/InventoryActionModal";
import type { InventoryResponse, InventoryAction, UpdateInventoryPayload } from "@/lib/types/admin.types";

type Filter = "all" | "low" | "out";

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>("all");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<InventoryResponse | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const data = await fetchAllInventory();
            setItems(data);
        } finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    const filtered = items.filter(item => {
        const matchSearch = !search.trim() ||
            item.productName.toLowerCase().includes(search.toLowerCase()) ||
            (item.sku ?? "").toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            filter === "all" ? true :
                filter === "low" ? item.isLowStock :
                    filter === "out" ? item.isOutOfStock : true;
        return matchSearch && matchFilter;
    });

    const lowCount = items.filter(i => i.isLowStock).length;
    const outCount = items.filter(i => i.isOutOfStock).length;

    async function handleAction(
        action: InventoryAction, qty: number, note: string, absolute?: number
    ) {
        if (!selected) return;
        const payload: UpdateInventoryPayload = { action, quantity: qty, note };
        if (action === "ADJUSTMENT" && absolute !== undefined) payload.absoluteStock = absolute;
        await updateInventory(selected.productId, payload);
        await load();
        setModalOpen(false);
    }

    return (
        <div className="space-y-5">

            {/* KPI strip */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Products", value: items.length, color: "bg-navy/10 text-navy", icon: "📦" },
                    { label: "Low Stock", value: lowCount, color: "bg-amber-50 text-amber-700", icon: "⚠️" },
                    { label: "Out of Stock", value: outCount, color: "bg-red-50 text-red-700", icon: "🚫" },
                ].map(k => (
                    <div key={k.label} className={`flex items-center gap-3 p-4 rounded-2xl border border-white/50 shadow-sm ${k.color} bg-white`}>
                        <span className="text-2xl">{k.icon}</span>
                        <div>
                            <p className="text-2xl font-bold">{k.value}</p>
                            <p className="text-xs font-medium opacity-70">{k.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters + search */}
            <div className="flex items-center gap-3 flex-wrap">
                {(["all", "low", "out"] as Filter[]).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${filter === f
                                ? "bg-navy text-white border-navy"
                                : "border-gray-200 text-gray-600 hover:border-navy hover:text-navy"
                            }`}>
                        {f === "all" ? "All Products" : f === "low" ? `Low Stock (${lowCount})` : `Out of Stock (${outCount})`}
                    </button>
                ))}
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by product or SKU…"
                    className="ml-auto px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 w-56" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                                <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                                <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reserved</th>
                                <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Available</th>
                                <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reorder At</th>
                                <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Restock</th>
                                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 9 }).map((_, j) => (
                                            <td key={j} className="px-4 py-4">
                                                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-16 text-gray-400 text-sm">
                                        No inventory records found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(item => (
                                    <tr key={item.id}
                                        className={`hover:bg-gray-50/50 transition-colors ${item.isOutOfStock ? "bg-red-50/30" : item.isLowStock ? "bg-amber-50/30" : ""
                                            }`}>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <img src={item.productImage} alt={item.productName}
                                                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-navy text-sm truncate max-w-[180px]">{item.productName}</p>
                                                    <p className="text-xs text-gray-400">{item.productCategory}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="text-xs font-mono text-gray-500">{item.sku ?? "—"}</span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className="font-bold text-navy">{item.stockQty}</span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className="text-purple-600 font-medium">{item.reservedQty}</span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className={`font-bold ${item.availableQty <= 0 ? "text-red-600" :
                                                    item.isLowStock ? "text-amber-600" : "text-green-600"
                                                }`}>{item.availableQty}</span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center text-sm text-gray-500">{item.reorderLevel}</td>
                                        <td className="px-4 py-3.5 text-center">
                                            <AdminBadge value={item.stockStatus} />
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-gray-400">
                                            {item.lastRestockedAt
                                                ? new Date(item.lastRestockedAt).toLocaleDateString("en-IN")
                                                : "Never"}
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button
                                                onClick={() => { setSelected(item); setModalOpen(true); }}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-teal/40 text-teal hover:bg-teal hover:text-white transition-all">
                                                Update Stock
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Inventory action modal */}
            <InventoryActionModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                inventory={selected}
                onSubmit={handleAction}
            />
        </div>
    );
}
