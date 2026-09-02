"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchInquiries } from "@/lib/api/admin";
import AdminBadge from "@/components/admin/AdminBadge";
import type { Inquiry, InquiryStatus } from "@/lib/types/admin.types";

const STATUSES: InquiryStatus[] = [
    "NEW", "ACKNOWLEDGED", "QUOTE_SENT", "FOLLOW_UP", "CONVERTED", "CLOSED"
];

// Fixed marker set by CatalogRequestForm — lets us filter catalog-page
// leads out of the general inquiry pool using the existing Category filter,
// with zero backend changes.
const CATALOG_REQUEST_CATEGORY = "Catalog Request";

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<InquiryStatus | "">("");
    const [state, setState] = useState("");
    const [category, setCategory] = useState("");

    const PAGE_SIZE = 20;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    async function load(p = 0) {
        setLoading(true);
        try {
            const res = await fetchInquiries({
                page: p, size: PAGE_SIZE,
                status: status || undefined,
                state: state || undefined,
                category: category || undefined,
            });
            setInquiries(res.content);
            setTotal(res.totalElements);
            setPage(p);
        } catch (e: any) {
            console.error(e);
        } finally { setLoading(false); }
    }

    useEffect(() => { load(0); }, [status, state, category]);

    function fmtDate(s: string) {
        return new Date(s).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
    }

    const isCatalogFilterActive = category === CATALOG_REQUEST_CATEGORY;

    return (
        <div className="space-y-5">

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-wrap gap-3">
                    {/* Status filter */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as InquiryStatus | "")}
                            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20">
                            <option value="">All Statuses</option>
                            {STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                        </select>
                    </div>

                    {/* State filter */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">State</label>
                        <input value={state} onChange={e => setState(e.target.value)}
                            placeholder="e.g. Karnataka"
                            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 w-40" />
                    </div>

                    {/* Category filter */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Category</label>
                        <input value={category} onChange={e => setCategory(e.target.value)}
                            placeholder="e.g. Employee Kits"
                            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 w-48" />
                    </div>

                    {/* Quick filter — Catalog Requests */}
                    <div className="self-end">
                        <label className="block text-xs font-semibold text-transparent mb-1.5 select-none">.</label>
                        <button
                            onClick={() => setCategory(isCatalogFilterActive ? "" : CATALOG_REQUEST_CATEGORY)}
                            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap ${isCatalogFilterActive
                                ? "bg-navy text-white border-navy"
                                : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                }`}
                        >
                            Catalog Requests
                        </button>
                    </div>

                    {/* Clear */}
                    {(status || state || category) && (
                        <div className="self-end">
                            <button onClick={() => { setStatus(""); setState(""); setCategory(""); }}
                                className="px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200">
                                Clear Filters
                            </button>
                        </div>
                    )}

                    <div className="self-end ml-auto">
                        <p className="text-xs text-gray-400">{total} total inquiries</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ref #</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 9 }).map((_, j) => (
                                            <td key={j} className="px-4 py-4">
                                                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : inquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-16 text-gray-400 text-sm">
                                        No inquiries found for the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                inquiries.map(inq => (
                                    <tr key={inq.id}
                                        className={`hover:bg-gray-50/50 transition-colors ${inq.status === "NEW" ? "bg-blue-50/20" : ""}`}>
                                        <td className="px-5 py-3.5">
                                            <span className="font-mono text-xs font-semibold text-navy bg-navy/5 px-2 py-1 rounded-lg">
                                                {inq.refNumber}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className="font-semibold text-navy text-sm truncate max-w-[140px]">{inq.companyName}</p>
                                            <p className="text-xs text-gray-400">{inq.city}, {inq.state}</p>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className="text-sm text-gray-700 truncate max-w-[120px]">{inq.contactPerson}</p>
                                            <p className="text-xs text-gray-400">{inq.mobile}</p>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {inq.productCategory === CATALOG_REQUEST_CATEGORY ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                                    📋 Catalog Request
                                                </span>
                                            ) : (
                                                <p className="text-xs text-gray-600 truncate max-w-[140px]">{inq.productCategory}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="font-semibold text-sm text-navy">
                                                {Number(inq.quantityRequired).toLocaleString("en-IN")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-sm text-gray-600">{inq.budgetRange}</td>
                                        <td className="px-4 py-3.5">
                                            <AdminBadge value={inq.status} />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className="text-xs text-gray-500">{fmtDate(inq.createdAt)}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <Link href={`/admin/inquiries/${inq.id}`}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-navy/20 text-navy hover:bg-navy hover:text-white transition-all">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500">
                            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => load(page - 1)} disabled={page === 0}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-40 hover:bg-gray-100">
                                ← Prev
                            </button>
                            <span className="px-3 py-1.5 text-xs font-semibold text-gray-600">
                                {page + 1} / {totalPages}
                            </span>
                            <button onClick={() => load(page + 1)} disabled={page >= totalPages - 1}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-40 hover:bg-gray-100">
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}