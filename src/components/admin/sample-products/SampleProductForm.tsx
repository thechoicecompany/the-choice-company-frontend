"use client";
import { useEffect, useState } from "react";
import type { AdminSampleProduct, CreateSampleProductPayload } from "@/lib/types/sampleProduct.types";
import type { ImageSlot, UploadedImageRef } from "@/lib/types/product-image.types";
import ImageUploadZone, { uploadSlots } from "@/components/admin/ImageUploadZone";

interface Props {
    initial?: AdminSampleProduct;
    onSubmit: (payload: CreateSampleProductPayload) => Promise<void>;
    submitLabel?: string;
}

const CATEGORIES = [
    "Drinkware", "Bags", "Eco-Friendly", "Desk Essentials", "Festive Hampers",
    "Employee Kits", "Electronics", "Stationery",
];
const BRANDING_OPTS = [
    "Screen Print", "Embroidery", "Laser Engrave", "Debossing", "UV Print", "Sticker Label", "Patch Label",
];

// Mirrors CreateSampleProductRequest.java validation exactly.
const NAME_MIN = 3, NAME_MAX = 200;
const DESC_MIN = 10, DESC_MAX = 500;
const PRICE_MIN = 1;
const MOQ_MIN = 1, MOQ_MAX = 100000;
const MAX_SAMPLE_QTY_MIN = 1, MAX_SAMPLE_QTY_MAX = 20;
const SHIPPING_DAYS_MIN = 1, SHIPPING_DAYS_MAX = 60;

function sanitizeSlug(input: string): string {
    return input.trim().toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function SampleProductForm({ initial, onSubmit, submitLabel = "Save Product" }: Props) {
    const [name, setName] = useState(initial?.name ?? "");
    const [slug, setSlug] = useState(initial?.slug ?? "");
    const [category, setCategory] = useState(initial?.category ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [samplePrice, setSamplePrice] = useState(initial?.samplePrice ?? 0);
    const [bulkPrice, setBulkPrice] = useState(initial?.bulkPrice ?? 0);
    const [maxSampleQty, setMaxSampleQty] = useState(initial?.maxSampleQty ?? 5);
    const [moq, setMoq] = useState(initial?.moq ?? 50);
    const [shippingDays, setShippingDays] = useState(initial?.shippingDays ?? 5);
    const [material, setMaterial] = useState(initial?.material ?? "");
    const [dimensions, setDimensions] = useState(initial?.dimensions ?? "");
    const [weight, setWeight] = useState(initial?.weight ?? "");
    const [branding, setBranding] = useState<string[]>(initial?.brandingOptions ?? []);
    const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
    const [isActive, setIsActive] = useState(initial?.isActive ?? true);
    const [isBestseller, setIsBestseller] = useState(initial?.isBestseller ?? false);
    const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
    const [metaDesc, setMetaDesc] = useState(initial?.metaDescription ?? "");

    const [imageSlots, setImageSlots] = useState<ImageSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [uploadPhase, setUploadPhase] = useState(false);

    // Pre-populate images in edit mode — "done" slots are skipped by uploadSlots().
    useEffect(() => {
        if (!initial?.productImages || initial.productImages.length === 0) return;
        const preloaded: ImageSlot[] = initial.productImages.map(img => ({
            uid: img.id.toString(),
            file: new File([], img.imageUrl.split("/").pop() ?? "image", { type: "image/jpeg" }),
            preview: img.imageUrl,
            status: "done" as const,
            progress: 100,
            url: img.imageUrl,
            publicId: img.publicId,
            dbImageId: img.id,
        }));
        setImageSlots(preloaded);
    }, [initial?.id]);

    function toggleBranding(opt: string) {
        setBranding(prev => prev.includes(opt) ? prev.filter(b => b !== opt) : [...prev, opt]);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const trimmedName = name.trim();
        const trimmedDesc = description.trim();

        if (!trimmedName || trimmedName.length < NAME_MIN || trimmedName.length > NAME_MAX) {
            setError(`Product name must be between ${NAME_MIN} and ${NAME_MAX} characters.`); return;
        }
        if (!category) { setError("Please select a category."); return; }
        if (!trimmedDesc || trimmedDesc.length < DESC_MIN || trimmedDesc.length > DESC_MAX) {
            setError(`Description must be between ${DESC_MIN} and ${DESC_MAX} characters.`); return;
        }
        if (samplePrice < PRICE_MIN) { setError(`Sample price must be at least ₹${PRICE_MIN}.`); return; }
        if (bulkPrice < PRICE_MIN) { setError(`Bulk price must be at least ₹${PRICE_MIN}.`); return; }
        if (bulkPrice >= samplePrice) {
            setError("Bulk price should be lower than sample price (that's the incentive to buy in bulk)."); return;
        }
        if (moq < MOQ_MIN || moq > MOQ_MAX) { setError(`MOQ must be between ${MOQ_MIN} and ${MOQ_MAX}.`); return; }
        if (maxSampleQty < MAX_SAMPLE_QTY_MIN || maxSampleQty > MAX_SAMPLE_QTY_MAX) {
            setError(`Max sample qty must be between ${MAX_SAMPLE_QTY_MIN} and ${MAX_SAMPLE_QTY_MAX}.`); return;
        }
        if (shippingDays < SHIPPING_DAYS_MIN || shippingDays > SHIPPING_DAYS_MAX) {
            setError(`Shipping days must be between ${SHIPPING_DAYS_MIN} and ${SHIPPING_DAYS_MAX}.`); return;
        }
        if (imageSlots.length === 0) { setError("Please add at least one product image."); return; }

        setLoading(true);

        let finalSlots: ImageSlot[];
        try {
            setUploadPhase(true);
            finalSlots = await uploadSlots(imageSlots, setImageSlots);
            setUploadPhase(false);
        } catch (err: unknown) {
            setUploadPhase(false); setLoading(false);
            setError(err instanceof Error ? err.message : "Image upload failed. Please try again.");
            return;
        }

        const failedSlots = finalSlots.filter(s => s.status === "error");
        if (failedSlots.length > 0) {
            setLoading(false);
            setError(`${failedSlots.length} image(s) failed to upload. Remove and retry.`);
            return;
        }

        // Only include newly-uploaded images (skip ones already saved in edit mode)
        const newImages: UploadedImageRef[] = finalSlots
            .filter(s => !s.dbImageId)
            .map((s, i) => ({ url: s.url!, publicId: s.publicId ?? "", sortOrder: i, isPrimary: i === 0 && !initial }));

        try {
            await onSubmit({
                name: trimmedName,
                slug: slug || undefined,
                category,
                categorySlug: category.toLowerCase().replace(/\s+/g, "-"),
                description: trimmedDesc,
                image: finalSlots[0]?.url ?? "",
                images: finalSlots.slice(1).map(s => s.url!),
                samplePrice, bulkPrice, maxSampleQty, moq, shippingDays,
                material: material || undefined,
                dimensions: dimensions || undefined,
                weight: weight || undefined,
                brandingOptions: branding,
                tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
                isActive, isBestseller,
                metaTitle: metaTitle || undefined,
                metaDescription: metaDesc || undefined,
                productImages: newImages,
            });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save product");
        } finally {
            setLoading(false);
        }
    }

    const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all bg-gray-50 focus:bg-white";
    const labelCls = "block text-sm font-semibold text-gray-700 mb-1.5";
    const isSubmitting = loading;
    const savePct = samplePrice > 0 && bulkPrice > 0 && bulkPrice < samplePrice
        ? Math.round(((samplePrice - bulkPrice) / samplePrice) * 100) : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* 1. Basics */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100">
                    1. Product Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className={labelCls}>Product Name <span className="text-red-500">*</span></label>
                        <input value={name} onChange={e => setName(e.target.value)}
                            className={inputCls} maxLength={NAME_MAX} disabled={isSubmitting} required
                            placeholder="e.g. Premium Steel Water Bottle" />
                    </div>
                    <div>
                        <label className={labelCls}>Slug <span className="text-gray-400 font-normal">(auto if empty)</span></label>
                        <input value={slug} onChange={e => setSlug(sanitizeSlug(e.target.value))}
                            className={inputCls} disabled={isSubmitting} placeholder="premium-steel-water-bottle" />
                    </div>
                    <div>
                        <label className={labelCls}>Category <span className="text-red-500">*</span></label>
                        <select value={category} onChange={e => setCategory(e.target.value)}
                            className={inputCls} required disabled={isSubmitting}>
                            <option value="">Select category…</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelCls}>Description <span className="text-red-500">*</span></label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)}
                            rows={3} className={inputCls} required disabled={isSubmitting}
                            maxLength={DESC_MAX} placeholder="Shown on the shop grid card and product page" />
                        <p className="text-xs text-gray-400 mt-1">{description.trim().length}/{DESC_MAX} chars (min {DESC_MIN})</p>
                    </div>
                </div>
            </section>

            {/* 2. Sample vs Bulk Pricing */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100">
                    2. Sample & Bulk Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelCls}>Sample Price (₹/unit) <span className="text-red-500">*</span></label>
                        <input type="number" min={PRICE_MIN} step={0.01} value={samplePrice}
                            onChange={e => setSamplePrice(Number(e.target.value))}
                            className={inputCls} required disabled={isSubmitting} />
                    </div>
                    <div>
                        <label className={labelCls}>Bulk Price (₹/unit) <span className="text-red-500">*</span></label>
                        <input type="number" min={PRICE_MIN} step={0.01} value={bulkPrice}
                            onChange={e => setBulkPrice(Number(e.target.value))}
                            className={inputCls} required disabled={isSubmitting} />
                    </div>
                    <div>
                        <label className={labelCls}>Bulk MOQ (units) <span className="text-red-500">*</span></label>
                        <input type="number" min={MOQ_MIN} max={MOQ_MAX} value={moq}
                            onChange={e => setMoq(Number(e.target.value))}
                            className={inputCls} disabled={isSubmitting} />
                    </div>
                    <div>
                        <label className={labelCls}>Max Sample Qty (per order)</label>
                        <input type="number" min={MAX_SAMPLE_QTY_MIN} max={MAX_SAMPLE_QTY_MAX} value={maxSampleQty}
                            onChange={e => setMaxSampleQty(Number(e.target.value))}
                            className={inputCls} disabled={isSubmitting} />
                    </div>
                    <div>
                        <label className={labelCls}>Shipping Days</label>
                        <input type="number" min={SHIPPING_DAYS_MIN} max={SHIPPING_DAYS_MAX} value={shippingDays}
                            onChange={e => setShippingDays(Number(e.target.value))}
                            className={inputCls} disabled={isSubmitting} />
                    </div>
                </div>
                {savePct !== null && (
                    <p className="text-xs text-teal font-medium mt-2">
                        Customers save {savePct}% ordering bulk vs sample — this is shown on the storefront.
                    </p>
                )}
            </section>

            {/* 3. Images */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100">
                    3. Product Images <span className="text-xs font-normal text-gray-400">— up to 8, first = primary</span>
                </h3>
                {uploadPhase && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-blue-700 text-sm font-medium">Uploading images…</p>
                    </div>
                )}
                <ImageUploadZone slots={imageSlots} onChange={setImageSlots} maxImages={8} disabled={isSubmitting} />
            </section>

            {/* 4. Specs & Branding */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100">
                    4. Specs & Branding
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelCls}>Material</label>
                        <input value={material} onChange={e => setMaterial(e.target.value)}
                            className={inputCls} disabled={isSubmitting} placeholder="Stainless Steel 304" />
                    </div>
                    <div>
                        <label className={labelCls}>Dimensions</label>
                        <input value={dimensions} onChange={e => setDimensions(e.target.value)}
                            className={inputCls} disabled={isSubmitting} placeholder="26 x 7 cm" />
                    </div>
                    <div>
                        <label className={labelCls}>Weight</label>
                        <input value={weight} onChange={e => setWeight(e.target.value)}
                            className={inputCls} disabled={isSubmitting} placeholder="320g" />
                    </div>
                    <div className="md:col-span-3">
                        <label className={labelCls}>Branding Options</label>
                        <div className="flex flex-wrap gap-2">
                            {BRANDING_OPTS.map(opt => (
                                <button key={opt} type="button" onClick={() => toggleBranding(opt)}
                                    disabled={isSubmitting}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${branding.includes(opt) ? "bg-navy text-white border-navy" : "bg-white text-gray-600 border-gray-200"
                                        }`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <label className={labelCls}>Tags <span className="text-gray-400 font-normal">(comma separated — "bestseller" shows a badge)</span></label>
                        <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                            className={inputCls} disabled={isSubmitting} placeholder="bestseller, eco-friendly" />
                    </div>
                </div>
            </section>

            {/* 5. Settings */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100">5. Settings</h3>
                <div className="flex flex-wrap gap-6">
                    {([
                        { label: "Active (visible in /shop)", value: isActive, set: setIsActive },
                        { label: "Bestseller badge", value: isBestseller, set: setIsBestseller },
                    ] as const).map(({ label, value, set }) => (
                        <label key={label} className="flex items-center gap-3 cursor-pointer">
                            <div onClick={() => !isSubmitting && (set as (p: boolean) => void)(!value)}
                                className={`w-11 h-6 rounded-full relative ${value ? "bg-navy" : "bg-gray-300"}`}>
                                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : ""}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* 6. SEO */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100">
                    6. SEO <span className="text-xs font-normal text-gray-400">(optional)</span>
                </h3>
                <div className="space-y-3">
                    <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)}
                        className={inputCls} maxLength={200} disabled={isSubmitting} placeholder="Meta title (uses product name if empty)" />
                    <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)}
                        rows={2} className={inputCls} maxLength={500} disabled={isSubmitting} placeholder="Meta description" />
                </div>
            </section>

            {error && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-700 text-sm">{error}</div>
            )}

            <div className="flex justify-end pt-2 border-t border-gray-100">
                <button type="submit" disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60 min-w-[160px]"
                    style={{ background: "linear-gradient(135deg,#0D1B2A,#1A5C4A)" }}>
                    {isSubmitting ? (uploadPhase ? "Uploading…" : "Saving…") : submitLabel}
                </button>
            </div>
        </form>
    );
}