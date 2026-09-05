"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils/formatCurrency";
import { fetchAdminDemoOrders } from "@/lib/api/admin/demoOrders";
import type { DemoOrderSummaryDto } from "@/lib/types/admin.types";

// ── Status config ─────────────────────────────────────────────────────────────
// ✅ matches backend OrderStatus enum exactly
type OrderStatus =
    | "PAYMENT_PENDING" | "PAID" | "PROCESSING"
    | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
    PAYMENT_PENDING: { label: "Awaiting Payment", color: "bg-yellow-100 text-yellow-700" },
    PAID: { label: "Paid", color: "bg-blue-100 text-blue-700" },
    PROCESSING: { label: "Processing", color: "bg-purple-100 text-purple-700" },
    SHIPPED: { label: "Shipped", color: "bg-orange-100 text-orange-700" },
    DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700" },
    REFUNDED: { label: "Refunded", color: "bg-pink-100 text-pink-700" },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<DemoOrderSummaryDto[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const pg = await fetchAdminDemoOrders(
                page, 20,
                statusFilter || undefined,
                search || undefined
            );
            setOrders(pg.content);
            setTotalPages(pg.totalPages);
            setTotalElements(pg.totalElements);
        } catch {
            setError("Failed to load orders. Check your connection.");
        } finally {
            setLoading(false);
        }
    }, [page, search, statusFilter]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleSearch = () => {
        setPage(0);
        setSearch(searchInput);
    };

    const clearFilters = () => {
        setSearchInput("");
        setSearch("");
        setStatusFilter("");
        setPage(0);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Sample Orders</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {totalElements} total orders
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Search</label>
                    <div className="flex gap-2">
                        <input
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSearch()}
                            placeholder="Name, email, or order ID…"
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-navy text-white text-sm rounded-lg font-medium hover:bg-navy/90 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="min-w-[180px]">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                    >
                        <option value="">All Statuses</option>
                        {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>

                {(search || statusFilter) && (
                    <button
                        onClick={clearFilters}
                        className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-red-500">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <div className="text-4xl mb-3">📦</div>
                        <p className="font-medium">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    {["Order ID", "Customer", "Status", "Date", ""].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map(order => {
                                    const sc = STATUS_CONFIG[order.status as OrderStatus]
                                        ?? { label: order.status, color: "bg-gray-100 text-gray-600" };
                                    return (
                                        <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs font-semibold text-navy">
                                                    {order.orderId}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900 whitespace-nowrap">{order.customerName}</p>
                                                <p className="text-xs text-gray-400">{order.customerEmail}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${sc.color}`}>
                                                    {sc.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit", month: "short", year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/orders/${order.orderId}`}
                                                    className="text-xs font-medium text-navy hover:underline whitespace-nowrap"
                                                >
                                                    View →
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <span>Page {page + 1} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 0}
                            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Prev
                        </button>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages - 1}
                            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}