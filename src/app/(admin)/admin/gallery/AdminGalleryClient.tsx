"use client";
import { useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/api/gallery";
import {
    adminFetchGalleryItems,
    adminCreateGalleryItem,
    adminDeleteGalleryItem,
    adminToggleGalleryItem,
} from "@/lib/api/admin/adminGallery";

const CATEGORIES = ["festive", "employee-kits", "hampers", "corporate", "tech-electronics", "bags-travel", "events", "packaging"];
const THUMB_ACCEPT = "image/jpeg,image/png,image/webp";
const PDF_ACCEPT = "application/pdf";

export default function AdminGalleryClient() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state — TWO separate files now, not one
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [pdf, setPdf] = useState<File | null>(null);
    const [projectName, setProjectName] = useState("");
    const [caption, setCaption] = useState("");
    const [category, setCategory] = useState("products");
    const [clientIndustry, setClientIndustry] = useState("");
    const [quantity, setQuantity] = useState("");
    const [sortOrder, setSortOrder] = useState("0");

    const thumbInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        adminFetchGalleryItems()
            .then(setItems)
            .catch(() => setError("Failed to load gallery items"))
            .finally(() => setLoading(false));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!thumbnail) { setError("Please select a thumbnail image"); return; }
        if (!pdf) { setError("Please select a catalogue PDF"); return; }
        if (!projectName.trim()) { setError("Project name is required"); return; }

        setError(null);
        setUploading(true);

        const form = new FormData();
        form.append("thumbnail", thumbnail);
        form.append("pdf", pdf);
        form.append("projectName", projectName.trim());
        form.append("caption", caption.trim());
        form.append("category", category);
        form.append("clientIndustry", clientIndustry.trim());
        form.append("quantity", quantity);
        form.append("sortOrder", sortOrder);

        try {
            const created = await adminCreateGalleryItem(form);
            setItems((prev) => [created, ...prev]);
            setThumbnail(null); setPdf(null); setProjectName(""); setCaption("");
            setClientIndustry(""); setQuantity(""); setSortOrder("0");
            if (thumbInputRef.current) thumbInputRef.current.value = "";
            if (pdfInputRef.current) pdfInputRef.current.value = "";
        } catch {
            setError("Upload failed. Check file size/type and try again.");
        } finally {
            setUploading(false);
        }
    }

    async function handleToggle(id: number) {
        try {
            const updated = await adminToggleGalleryItem(id);
            setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        } catch {
            setError("Failed to toggle item");
        }
    }

    async function handleDelete(id: number, projectName: string) {
        if (!confirm(`Delete "${projectName}"? This cannot be undone.`)) return;
        try {
            await adminDeleteGalleryItem(id);
            setItems((prev) => prev.filter((i) => i.id !== id));
        } catch {
            setError("Failed to delete item");
        }
    }

    return (
        <div className="container-site section-py space-y-10">
            <h1 className="text-2xl font-bold text-navy">Gallery Management</h1>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                <h2 className="text-base font-semibold text-navy">Upload New Catalog Item</h2>
                <p className="text-xs text-gray-400 -mt-4">
                    Visitors see only the thumbnail on the gallery grid. The PDF is only revealed after they submit their contact details.
                </p>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* TWO file pickers — this is the actual fix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            onClick={() => thumbInputRef.current?.click()}
                            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors border-gray-200 hover:border-navy/40"
                        >
                            {thumbnail ? (
                                <p className="text-sm font-medium text-navy">
                                    🖼 {thumbnail.name} ({(thumbnail.size / 1024).toFixed(0)} KB)
                                </p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-gray-600">Thumbnail image *</p>
                                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP</p>
                                </>
                            )}
                            <input
                                ref={thumbInputRef} type="file" accept={THUMB_ACCEPT} className="hidden"
                                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                            />
                        </div>

                        <div
                            onClick={() => pdfInputRef.current?.click()}
                            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors border-gray-200 hover:border-navy/40"
                        >
                            {pdf ? (
                                <p className="text-sm font-medium text-navy">
                                    📄 {pdf.name} ({(pdf.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-gray-600">Catalog PDF *</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF only, gated behind contact form</p>
                                </>
                            )}
                            <input
                                ref={pdfInputRef} type="file" accept={PDF_ACCEPT} className="hidden"
                                onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Project Name *</label>
                            <input
                                type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Diwali Gift Hampers"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                            <select
                                value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
                            >
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Caption</label>
                            <input
                                type="text" value={caption} onChange={(e) => setCaption(e.target.value)}
                                placeholder="Brief description of the project"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Client Industry</label>
                            <input
                                type="text" value={clientIndustry} onChange={(e) => setClientIndustry(e.target.value)}
                                placeholder="FMCG, Banking, IT…"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                                <input
                                    type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="500"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
                                <input
                                    type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                                    placeholder="0"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit" disabled={uploading}
                        className="btn-navy px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                        {uploading ? "Uploading…" : "Upload Item"}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-navy">
                        All Items <span className="text-gray-400 font-normal text-sm">({items.length})</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
                ) : items.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">No items yet — upload one above.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3 text-left">Thumbnail</th>
                                    <th className="px-4 py-3 text-left">Project</th>
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-left">Type</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden">
                                                {item.thumbnailUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={item.thumbnailUrl}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xl">📁</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-navy">{item.projectName}</p>
                                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{item.caption}</p>
                                        </td>
                                        <td className="px-4 py-3 capitalize text-gray-600">{item.category}</td>
                                        <td className="px-4 py-3 capitalize text-gray-600">{item.fileType}</td>
                                        <td className="px-4 py-3">
                                            <span className={`badge text-[10px] ${(item as any).isActive ? "badge-navy" : "badge-gray"}`}>
                                                {(item as any).isActive ? "Active" : "Hidden"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleToggle(item.id)} className="text-xs text-gray-500 hover:text-navy underline">
                                                    {(item as any).isActive ? "Hide" : "Show"}
                                                </button>
                                                <span className="text-gray-200">|</span>
                                                <button onClick={() => handleDelete(item.id, item.projectName)} className="text-xs text-red-400 hover:text-red-600 underline">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}