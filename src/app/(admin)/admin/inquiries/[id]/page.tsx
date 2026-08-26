"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchInquiry, updateInquiryStatus, addInquiryNote } from "@/lib/api/admin";
import AdminBadge from "@/components/admin/AdminBadge";
import type { Inquiry, InquiryStatus } from "@/lib/types/admin.types";

const STATUSES: InquiryStatus[] = [
    "NEW", "ACKNOWLEDGED", "QUOTE_SENT", "FOLLOW_UP", "CONVERTED", "CLOSED"
];

const STATUS_COLORS: Record<InquiryStatus, string> = {
    NEW: "border-blue-400 text-blue-700",
    ACKNOWLEDGED: "border-yellow-400 text-yellow-700",
    QUOTE_SENT: "border-purple-400 text-purple-700",
    FOLLOW_UP: "border-orange-400 text-orange-700",
    CONVERTED: "border-green-400 text-green-700",
    CLOSED: "border-gray-400 text-gray-600",
};

export default function InquiryDetailPage() {
    const params = useParams();
    const id = Number(params.id);

    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newStatus, setNewStatus] = useState<InquiryStatus | "">("");
    const [noteText, setNoteText] = useState("");
    const [saving, setSaving] = useState(false);
    const [noteErr, setNoteErr] = useState("");

    useEffect(() => {
        fetchInquiry(id)
            .then(data => { setInquiry(data); setNewStatus(data.status); })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleStatusUpdate() {
        if (!inquiry || !newStatus) return;
        setSaving(true);
        try {
            const updated = await updateInquiryStatus(id, newStatus as InquiryStatus);
            setInquiry(updated);
        } catch (e: any) {
            setNoteErr(e.message);
        } finally { setSaving(false); }
    }

    async function handleAddNote(e: React.FormEvent) {
        e.preventDefault();
        if (!noteText.trim()) return;
        setSaving(true);
        setNoteErr("");
        try {
            const updated = await addInquiryNote(id, noteText.trim());
            setInquiry(updated);
            setNoteText("");
        } catch (e: any) {
            setNoteErr(e.message);
        } finally { setSaving(false); }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-4 border-navy border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (error || !inquiry) return (
        <div className="p-6 bg-red-50 rounded-2xl text-red-700 text-sm">⚠ {error}</div>
    );

    const infoRows: [string, string][] = [
        ["Company", inquiry.companyName],
        ["Contact Person", inquiry.contactPerson],
        ["Designation", inquiry.designation ?? "—"],
        ["Email", inquiry.email],
        ["Mobile", inquiry.mobile],
        ["City / State", `${inquiry.city}, ${inquiry.state}`],
        ["Product Category", inquiry.productCategory],
        ["Quantity Required", `${Number(inquiry.quantityRequired).toLocaleString("en-IN")} units`],
        ["Budget Range", inquiry.budgetRange],
        ["Delivery Location", inquiry.deliveryLocation],
        ["Branding Required", inquiry.brandingRequired ? "Yes" : "No"],
        ["Source", inquiry.source.replace("_", " ")],
        ["Assigned To", inquiry.assignedToName ?? "Unassigned"],
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-5">

            {/* Back */}
            <Link href="/admin/inquiries"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy transition-colors">
                ← Back to Inquiries
            </Link>

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm font-bold text-navy bg-navy/5 px-3 py-1 rounded-lg">
                                {inquiry.refNumber}
                            </span>
                            <AdminBadge value={inquiry.status} />
                        </div>
                        <h2 className="text-xl font-bold text-navy">{inquiry.companyName}</h2>
                        <p className="text-sm text-gray-500">{inquiry.contactPerson} · {inquiry.mobile}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Submitted</p>
                        <p className="text-sm font-semibold text-navy">
                            {new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric", month: "long", year: "numeric"
                            })}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(inquiry.createdAt).toLocaleTimeString("en-IN")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Inquiry details */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-navy">Inquiry Details</h3>
                        </div>
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-50">
                                {infoRows.map(([label, value]) => (
                                    <tr key={label}>
                                        <td className="px-5 py-3 text-gray-500 font-medium w-44 bg-gray-50/50">{label}</td>
                                        <td className="px-5 py-3 text-navy font-semibold">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Additional notes */}
                    {inquiry.additionalNotes && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="font-bold text-navy mb-3">Additional Notes from Client</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{inquiry.additionalNotes}</p>
                        </div>
                    )}

                    {/* Logo */}
                    {inquiry.logoUrl && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="font-bold text-navy mb-3">Uploaded Logo</h3>
                            <img src={inquiry.logoUrl} alt="Company logo"
                                className="h-20 object-contain rounded-xl border border-gray-200 p-2 bg-gray-50" />
                        </div>
                    )}
                </div>

                {/* Right panel — status + notes */}
                <div className="space-y-5">

                    {/* Status update */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="font-bold text-navy mb-4">Update Status</h3>
                        <div className="space-y-2 mb-4">
                            {STATUSES.map(s => (
                                <button key={s} onClick={() => setNewStatus(s)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${newStatus === s
                                            ? `${STATUS_COLORS[s]} border-2 bg-white font-bold`
                                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                                        }`}>
                                    {s.replace(/_/g, " ")}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleStatusUpdate}
                            disabled={saving || newStatus === inquiry.status}
                            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                            style={{ background: "linear-gradient(135deg,#0D1B2A,#1A5C4A)" }}>
                            {saving ? "Saving…" : "Update Status"}
                        </button>
                    </div>

                    {/* Add note */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="font-bold text-navy mb-4">Add Follow-up Note</h3>
                        <form onSubmit={handleAddNote} className="space-y-3">
                            <textarea
                                value={noteText} onChange={e => setNoteText(e.target.value)}
                                rows={3} placeholder="e.g. Called client — they need delivery by Diwali…"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
                                required
                            />
                            {noteErr && <p className="text-red-600 text-xs">{noteErr}</p>}
                            <button type="submit" disabled={saving || !noteText.trim()}
                                className="w-full py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all"
                                style={{ background: "#1A5C4A" }}>
                                {saving ? "Adding…" : "Add Note"}
                            </button>
                        </form>

                        {/* Quick actions */}
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Contact</p>
                            <a href={`tel:${inquiry.mobile}`}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-navy transition-colors">
                                📞 {inquiry.mobile}
                            </a>
                            <a href={`mailto:${inquiry.email}`}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-navy transition-colors">
                                ✉️ {inquiry.email}
                            </a>
                            <a href={`https://wa.me/91${inquiry.mobile}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 transition-colors">
                                💬 WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
