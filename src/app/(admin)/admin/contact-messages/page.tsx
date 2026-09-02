"use client";
import { useEffect, useState, useCallback } from "react";
import {
    fetchContactMessages,
    updateContactMessageStatus,
} from "@/lib/api/admin"; // matches your actual lib/admin.ts
import type { ContactMessage, ContactStatus, PagedResponse } from "@/lib/types/admin.types";

const STATUS_STYLES: Record<ContactStatus, string> = {
    NEW: "bg-gold/10 text-gold border-gold/30",
    READ: "bg-blue-50 text-blue-700 border-blue-200",
    REPLIED: "bg-green-50 text-green-700 border-green-200",
    CLOSED: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function ContactMessagesAdminPage() {
    const [data, setData] = useState<PagedResponse<ContactMessage> | null>(null);
    const [page, setPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState<ContactStatus | "">("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState<ContactMessage | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchContactMessages({
                page,
                size: 20,
                ...(statusFilter ? { status: statusFilter } : {}),
            });
            setData(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load messages");
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter]);

    useEffect(() => { load(); }, [load]);

    const updateStatus = async (id: number, status: ContactStatus) => {
        try {
            const updated = await updateContactMessageStatus(id, status);
            await load();
            if (selected?.id === id) setSelected(updated);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to update status");
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-navy">Contact Messages</h1>
                <select
                    value={statusFilter}
                    onChange={e => { setPage(0); setStatusFilter(e.target.value as ContactStatus | ""); }}
                    className="border rounded-lg px-3 py-2 text-sm"
                >
                    <option value="">All statuses</option>
                    <option value="NEW">New</option>
                    <option value="READ">Read</option>
                    <option value="REPLIED">Replied</option>
                    <option value="CLOSED">Closed</option>
                </select>
            </div>

            {loading && <p className="text-gray-500 text-sm">Loading…</p>}
            {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            {data && !loading && (
                <>
                    <div className="border rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Received</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.content.map(m => (
                                    <tr
                                        key={m.id}
                                        onClick={() => { setSelected(m); if (m.status === "NEW") updateStatus(m.id, "READ"); }}
                                        className="border-t hover:bg-gray-50 cursor-pointer"
                                    >
                                        <td className="px-4 py-3 font-medium text-navy">{m.name}</td>
                                        <td className="px-4 py-3">{m.subject}</td>
                                        <td className="px-4 py-3 text-gray-500">{m.email}</td>
                                        <td className="px-4 py-3 text-gray-500">{new Date(m.createdAt).toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLES[m.status]}`}>
                                                {m.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {data.content.length === 0 && (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No messages found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                        <span>{data.totalElements} total</span>
                        <div className="flex gap-2">
                            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded-lg disabled:opacity-40">Prev</button>
                            <span>Page {page + 1} of {Math.max(data.totalPages, 1)}</span>
                            <button disabled={page + 1 >= data.totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded-lg disabled:opacity-40">Next</button>
                        </div>
                    </div>
                </>
            )}

            {/* Detail drawer */}
            {selected && (
                <div className="fixed inset-0 bg-black/30 flex justify-end z-50" onClick={() => setSelected(null)}>
                    <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelected(null)} className="text-gray-400 text-sm mb-4">✕ Close</button>
                        <h2 className="text-lg font-bold text-navy mb-1">{selected.subject}</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {selected.name} {selected.company ? `· ${selected.company}` : ""}
                        </p>
                        <div className="space-y-2 text-sm mb-4">
                            <p><span className="text-gray-500">Email:</span> <a href={`mailto:${selected.email}`} className="text-gold">{selected.email}</a></p>
                            {selected.phone && <p><span className="text-gray-500">Phone:</span> {selected.phone}</p>}
                            <p><span className="text-gray-500">Received:</span> {new Date(selected.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-sm text-navy whitespace-pre-wrap mb-6">
                            {selected.message}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {(["NEW", "READ", "REPLIED", "CLOSED"] as ContactStatus[]).map(s => (
                                <button
                                    key={s}
                                    onClick={() => updateStatus(selected.id, s)}
                                    className={`text-xs px-3 py-1.5 rounded-full border ${selected.status === s ? "bg-navy text-white border-navy" : "border-gray-300 text-gray-600"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}