"use client";
import { useEffect, useState } from "react";
import { fetchCatalogueRequests } from "@/lib/api/admin";
import type { CatalogueRequest } from "@/lib/types/admin.types";

const SOURCE_COLORS: Record<string, string> = {
    exit_popup: "bg-blue-100 text-blue-700",
    contact_page: "bg-purple-100 text-purple-700",
    blog: "bg-green-100 text-green-700",
    footer: "bg-gray-100 text-gray-600",
    direct: "bg-orange-100 text-orange-700",
};

export default function CataloguePage() {
    const [requests, setRequests] = useState<CatalogueRequest[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const PAGE_SIZE = 25;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    async function load(p = 0) {
        setLoading(true);
        try {
            const res = await fetchCatalogueRequests(p, PAGE_SIZE);
            setRequests(res.content);
            setTotal(res.totalElements);
            setPage(p);
        } finally { setLoading(false); }
    }

    useEffect(() => { load(0); }, []);

    const filtered = search.trim()
        ? requests.filter(r =>
            r.email.toLowerCase().includes(search.toLowerCase()) ||
            (r.companyName ?? "").toLowerCase().includes(search.toLowerCase())
        )
        : requests;

    // Source breakdown
    const sourceCounts = requests.reduce<Record<string, number>>((acc, r) => {
        acc[r.source] = (acc[r.source] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <div className="space-y-5">

            {/* Source breakdown */}
            {Object.keys(sourceCounts).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {Object.entries(sourceCounts).map(([source, count]) => (
                        <div key={source}
                            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                            <p className="text-2xl font-bold text-navy">{count}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{source.replace("_", " ")}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Search + count */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm text-gray-400">{total} total catalogue requests</p>
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by email or company…"
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Page URL</th>
                                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                                <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Sent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 8 }).map((_, j) => (
                                            <td key={j} className="px-4 py-4">
                                                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16 text-gray-400 text-sm">
                                        {search ? "No results match your search." : "No catalogue requests yet."}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((req, idx) => (
                                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <span className="text-xs text-gray-400 font-mono">
                                                {page * PAGE_SIZE + idx + 1}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <a href={`mailto:${req.email}`}
                                                className="text-sm text-navy font-medium hover:underline truncate block max-w-[200px]">
                                                {req.email}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="text-sm text-gray-700">{req.companyName ?? "—"}</span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {req.phone ? (
                                                <a href={`tel:${req.phone}`}
                                                    className="text-sm text-gray-600 hover:text-navy transition-colors">
                                                    {req.phone}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${SOURCE_COLORS[req.source] ?? "bg-gray-100 text-gray-600"
                                                }`}>
                                                {req.source.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {req.pageUrl ? (
                                                <span className="text-xs text-gray-400 truncate block max-w-[160px]" title={req.pageUrl}>
                                                    {req.pageUrl}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="text-xs text-gray-500">
                                                {new Date(req.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric"
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${req.emailSent
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-400"
                                                }`}>
                                                {req.emailSent ? "✓" : "—"}
                                            </span>
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
                            <span className="px-3 py-1.5 text-xs text-gray-600">{page + 1}/{totalPages}</span>
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
