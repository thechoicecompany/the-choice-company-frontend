"use client";
import { useEffect, useState } from "react";
import { fetchDashboardStats } from "@/lib/api/admin";
import AdminStatCard from "@/components/admin/AdminStatCard";
import {
    InquiryStatusChart, InquiryTrendChart,
    CatalogueMonthlyChart, TopStatesChart,
} from "@/components/admin/DashboardCharts";
import type { DashboardStats } from "@/lib/types/admin.types";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardStats()
            .then(setStats)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Loading dashboard…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-red-700 text-sm">
            ⚠ Failed to load dashboard: {error}
        </div>
    );

    if (!stats) return null;

    return (
        <div className="space-y-6">

            {/* ── Inquiry KPIs ──────────────────────────────────────── */}
            <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Inquiries
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <AdminStatCard label="Total" value={stats.totalInquiries} icon="📋" color="navy" sub="All time" />
                    <AdminStatCard label="New" value={stats.newInquiries} icon="🆕" color="teal" sub="Unread" />
                    <AdminStatCard label="Today" value={stats.inquiriesToday} icon="📅" color="teal" sub="Last 24h" />
                    <AdminStatCard label="This Week" value={stats.inquiriesThisWeek} icon="📆" color="gold" sub="Last 7 days" />
                    <AdminStatCard label="This Month" value={stats.inquiriesThisMonth} icon="📊" color="purple" sub="Current month" />
                    <AdminStatCard label="Converted" value={stats.convertedInquiries} icon="✅" color="green" sub="Won deals" />
                </div>
            </div>

            {/* ── Inquiry Charts ────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InquiryStatusChart stats={stats} />
                <InquiryTrendChart stats={stats} />
            </div>

            {/* ── Catalogue KPIs ────────────────────────────────────── */}
            <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Catalogue Downloads
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <AdminStatCard label="Total Requests" value={stats.totalCatalogueRequests} icon="📑" color="navy" />
                    <AdminStatCard label="Today" value={stats.catalogueRequestsToday} icon="📥" color="teal" />
                    <AdminStatCard label="This Month" value={stats.catalogueRequestsThisMonth} icon="📈" color="gold" />
                </div>
            </div>

            {/* ── Catalogue + Top States ───────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CatalogueMonthlyChart stats={stats} />
                <TopStatesChart stats={stats} />
            </div>

            {/* ── Inventory KPIs ───────────────────────────────────── */}
            <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Inventory
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <AdminStatCard label="Total Products" value={stats.totalProducts} icon="📦" color="navy" />
                    <AdminStatCard label="Active Products" value={stats.activeProducts} icon="✅" color="green" />
                    <AdminStatCard label="Low Stock" value={stats.lowStockProducts} icon="⚠️" color="orange" sub="≤ reorder level" />
                    <AdminStatCard label="Out of Stock" value={stats.outOfStockProducts} icon="🚫" color="red" sub="Zero available" />
                </div>
            </div>

            {/* ── Top Categories ───────────────────────────────────── */}
            {stats.topCategoriesByInquiry?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-navy mb-1">Top Product Categories</h3>
                    <p className="text-xs text-gray-400 mb-5">By inquiry volume</p>
                    <div className="space-y-3">
                        {stats.topCategoriesByInquiry.slice(0, 5).map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="text-xs text-gray-500 w-4">{i + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                        <span className="text-sm font-bold text-navy">{item.count}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${item.percentage ?? 0}%`,
                                                background: `hsl(${200 - i * 30}, 60%, ${35 + i * 5}%)`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Demo Orders ──────────────────────────────────────── */}
            <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Sample Orders
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <AdminStatCard label="Total Demo Orders" value={stats.totalDemoOrders} icon="🛒" color="navy" />
                    <AdminStatCard label="Orders This Month" value={stats.demoOrdersThisMonth} icon="📦" color="teal" />
                </div>
            </div>

        </div>
    );
}
