"use client";
import { useEffect, useState } from "react";
import type { AdminProduct, CreateProductPayload } from "@/lib/types/admin.types";
import type { ImageSlot, UploadedImageRef } from "@/lib/types/product-image.types";
import ImageUploadZone, { uploadSlots } from "./ImageUploadZone";

interface Props {
    initial?: AdminProduct;
    onSubmit: (payload: CreateProductPayload) => Promise<void>;
    submitLabel?: string;
}

const CATEGORIES = [
    // Festive & Occasion-Based
    { label: "Diwali Gifts", slug: "diwali-gifts" },
    { label: "Holi Gifts", slug: "holi-gifts" },
    { label: "New Year Gifts", slug: "new-year-gifts" },
    { label: "Christmas Gifts", slug: "christmas-gifts" },
    { label: "Festive Hampers", slug: "festive-hampers" },

    // Product-Type Categories
    { label: "Gift Hampers", slug: "gift-hampers" },
    { label: "Bags", slug: "bags" },
    { label: "Laptop Bags", slug: "laptop-bags" },
    { label: "Backpacks", slug: "backpacks" },
    { label: "Trolley Bags", slug: "trolley-bags" },
    { label: "Drinkware", slug: "drinkware" },
    { label: "Desk Essentials", slug: "desk-essentials" },
    { label: "Office Essentials", slug: "office-essentials" },
    { label: "Stationery", slug: "stationery" },
    { label: "Apparel", slug: "apparel" },
    { label: "Travel Kits", slug: "travel-kits" },
    { label: "Electronics", slug: "electronics" },
    { label: "Sports", slug: "sports" },
    { label: "Wellness", slug: "wellness" },
    { label: "Eco-Friendly Gifts", slug: "eco-friendly-gifts" },
    { label: "Premium Gifts", slug: "premium-gifts" },
    { label: "Custom Merchandise", slug: "custom-merchandise" },

    // Corporate & Employee Categories
    { label: "Employee Welcome", slug: "employee-welcome" },
    { label: "Employee Kits", slug: "employee-kits" },
    { label: "Work Anniversary", slug: "work-anniversary" },
    { label: "Client Appreciation", slug: "client-appreciation" },
    { label: "Conference Kits", slug: "conference-kits" },
    { label: "Retirement Gifts", slug: "retirement-gifts" },
    { label: "Wedding Gifts", slug: "wedding-gifts" },
    { label: "Dealer Meet Gifts", slug: "dealer-meet-gifts" },
    { label: "Women's Day", slug: "womens-day" },
];

const BRANDING_OPTS = [
    "Screen Print", "Embroidery", "Laser Engrave",
    "Debossing", "UV Print", "Sticker Label", "Patch Label",
];

const NAME_MIN = 3, NAME_MAX = 200;
const DESC_MIN = 10, DESC_MAX = 500;
const PRICE_MIN = 1;
const MOQ_MIN = 1, MOQ_MAX = 100000;

function sanitizeSlug(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export default function ProductForm({ initial, onSubmit, submitLabel = "Save Product" }: Props) {
    const [name, setName] = useState(initial?.name ?? "");
    const [slug, setSlug] = useState(initial?.slug ?? "");
    const [category, setCategory] = useState(initial?.category ?? "");
    const [catSlug, setCatSlug] = useState(initial?.categorySlug ?? "");
    const [sku, setSku] = useState("");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [fullDesc, setFullDesc] = useState(initial?.fullDescription ?? "");
    const [price, setPrice] = useState(initial?.basePrice ?? 0);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [stockQty, setStockQty] = useState(0);
    const [reorderLvl, setReorderLvl] = useState(50);
    const [moq, setMoq] = useState(initial?.moq ?? 50);
    const [material, setMaterial] = useState(initial?.material ?? "");
    const [leadTime, setLeadTime] = useState(initial?.leadTime ?? "7-10 working days");
    const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
    const [isActive, setIsActive] = useState(initial?.isActive ?? true);
    const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
    const [branding, setBranding] = useState<string[]>(initial?.brandingOptions ?? []);
    const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
    const [metaDesc, setMetaDesc] = useState(initial?.metaDescription ?? "");

    const [imageSlots, setImageSlots] = useState<ImageSlot[]>([]);

    // Pre-populate image slots from existing product images (edit mode).
    // Slots with status "done" are skipped by uploadSlots() — never re-uploaded.
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
            dbImageId: img.id, // new line add
        }));

        setImageSlots(preloaded);
    }, [initial?.id]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [uploadPhase, setUploadPhase] = useState(false);

    function handleCategoryChange(catLabel: string) {
        const found = CATEGORIES.find(c => c.label === catLabel);
        setCategory(catLabel);
        setCatSlug(found?.slug ?? catLabel.toLowerCase().replace(/\s+/g, "-"));
    }

    function toggleBranding(opt: string) {
        setBranding(prev =>
            prev.includes(opt) ? prev.filter(b => b !== opt) : [...prev, opt]
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const trimmedName = name.trim();
        const trimmedDesc = description.trim();

        if (!trimmedName) { setError("Product name is required."); return; }
        if (trimmedName.length < NAME_MIN || trimmedName.length > NAME_MAX) {
            setError(`Product name must be between ${NAME_MIN} and ${NAME_MAX} characters (currently ${trimmedName.length}).`);
            return;
        }
        if (!category) { setError("Please select a category."); return; }
        if (!trimmedDesc) { setError("Description is required."); return; }
        if (trimmedDesc.length < DESC_MIN) {
            setError(`Description must be at least ${DESC_MIN} characters (currently ${trimmedDesc.length}).`);
            return;
        }
        if (trimmedDesc.length > DESC_MAX) {
            setError(`Description must be under ${DESC_MAX} characters (currently ${trimmedDesc.length}).`);
            return;
        }
        if (price < PRICE_MIN) { setError(`Price must be at least ₹${PRICE_MIN}.`); return; }
        if (moq < MOQ_MIN || moq > MOQ_MAX) {
            setError(`MOQ must be between ${MOQ_MIN} and ${MOQ_MAX}.`);
            return;
        }
        if (imageSlots.length === 0) {
            setError("Please add at least one product image.");
            return;
        }

        setLoading(true);

        let finalSlots: ImageSlot[];
        try {
            setUploadPhase(true);
            finalSlots = await uploadSlots(imageSlots, setImageSlots);
            setUploadPhase(false);
        } catch (err: unknown) {
            setUploadPhase(false);
            setLoading(false);
            setError(err instanceof Error ? err.message : "Image upload failed. Please try again.");
            return;
        }

        const failedSlots = finalSlots.filter(s => s.status === "error");
        if (failedSlots.length > 0) {
            setLoading(false);
            setError(`${failedSlots.length} image(s) failed to upload. Please remove them and try again.`);
            return;
        }

        const images: UploadedImageRef[] = finalSlots.map((s, i) => ({
            url: s.url!,
            publicId: s.publicId ?? "",
            sortOrder: i,
            isPrimary: i === 0,
        }));

        try {
            await onSubmit({
                name: trimmedName,
                slug: slug || undefined,
                category,
                categorySlug: catSlug,
                description: trimmedDesc,
                fullDescription: fullDesc || undefined,
                image: images[0]?.url ?? "",
                images: images.slice(1).map(i => i.url),
                moq,
                basePrice: price,
                material: material || undefined,
                leadTime: leadTime || undefined,
                brandingOptions: branding,
                isFeatured,
                tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
                metaTitle: metaTitle || undefined,
                metaDescription: metaDesc || undefined,
                ...(!initial && {
                    inventory: {
                        stockQty,
                        reorderLevel: reorderLvl,
                        sku: sku || undefined,
                    },
                }),
                productImages: images,
            } as CreateProductPayload);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save product");
        } finally {
            setLoading(false);
        }
    }

    const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all bg-gray-50 focus:bg-white";
    const labelCls = "block text-sm font-semibold text-gray-700 mb-1.5";
    const isSubmitting = loading;

    const nameLen = name.trim().length;
    const descLen = description.trim().length;
    const nameTooShort = nameLen > 0 && nameLen < NAME_MIN;
    const descTooShort = descLen > 0 && descLen < DESC_MIN;
    const descTooLong = descLen > DESC_MAX;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Section 1: Product Information ────────────────────────────────── */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-navy text-white text-xs flex items-center justify-center font-bold">1</span>
                    Product Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className={labelCls}>Product Name <span className="text-red-500">*</span></label>
                        <input value={name} onChange={e => setName(e.target.value)}
                            className={inputCls} placeholder="e.g. Premium Steel Thermos" required
                            maxLength={NAME_MAX} disabled={isSubmitting} />
                        <p className={`text-xs mt-1 ${nameTooShort ? "text-red-500" : "text-gray-400"}`}>
                            {nameLen}/{NAME_MAX} characters {nameTooShort && `(min ${NAME_MIN} required)`}
                        </p>
                    </div>
                    <div>
                        <label className={labelCls}>SKU</label>
                        <input value={sku} onChange={e => setSku(e.target.value)}
                            className={inputCls} placeholder="PROD-001" disabled={isSubmitting} />
                    </div>
                    <div>
                        <label className={labelCls}>Slug <span className="text-gray-400 font-normal">(auto if empty)</span></label>
                        <input value={slug} onChange={e => setSlug(sanitizeSlug(e.target.value))}
                            className={inputCls} placeholder="premium-steel-thermos" disabled={isSubmitting} />
                    </div>
                    <div>
                        <label className={labelCls}>Category <span className="text-red-500">*</span></label>
                        <select value={category} onChange={e => handleCategoryChange(e.target.value)}
                            className={inputCls} required disabled={isSubmitting}>
                            <option value="">Select category…</option>
                            {CATEGORIES.map(c => (
                                <option key={c.slug} value={c.label}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>MOQ (Min Order Qty)</label>
                        <input type="number" min={MOQ_MIN} max={MOQ_MAX} value={moq}
                            onChange={e => setMoq(Number(e.target.value))}
                            className={inputCls} disabled={isSubmitting} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelCls}>Short Description <span className="text-red-500">*</span></label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)}
                            rows={2} className={inputCls} required disabled={isSubmitting}
                            maxLength={DESC_MAX} placeholder="100–200 characters for product listing card" />
                        <p className={`text-xs mt-1 ${descTooShort || descTooLong ? "text-red-500" : "text-gray-400"}`}>
                            {descLen}/{DESC_MAX} characters {descTooShort && `(min ${DESC_MIN} required)`}
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelCls}>Full Description</label>
                        <textarea value={fullDesc} onChange={e => setFullDesc(e.target.value)}
                            rows={4} className={inputCls} disabled={isSubmitting}
                            placeholder="Detailed product description for product detail page" />
                    </div>
                </div>
            </section>

            {/* ── Section 2: Pricing & Stock ─────────────────────────────────────── */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-navy text-white text-xs flex items-center justify-center font-bold">2</span>
                    Pricing & Stock
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelCls}>Price (₹/unit) <span className="text-red-500">*</span></label>
                        <input type="number" min={PRICE_MIN} step={0.01} value={price}
                            onChange={e => setPrice(Number(e.target.value))}
                            className={inputCls} required disabled={isSubmitting} />
                        {price > 0 && price < PRICE_MIN && (
                            <p className="text-xs mt-1 text-red-500">Price must be at least ₹{PRICE_MIN}</p>
                        )}
                    </div>
                    <div>
                        <label className={labelCls}>Discount Price (₹) <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input type="number" min={0} step={0.01} value={discountPrice}
                            onChange={e => setDiscountPrice(Number(e.target.value))}
                            className={inputCls} disabled={isSubmitting} />
                    </div>
                    <div>
                        <label className={labelCls}>Stock Quantity</label>
                        <input type="number" min={0} value={stockQty}
                            onChange={e => setStockQty(Number(e.target.value))}
                            className={inputCls} disabled={isSubmitting} />
                    </div>
                    <div>
                        <label className={labelCls}>Reorder Level</label>
                        <input type="number" min={0} value={reorderLvl}
                            onChange={e => setReorderLvl(Number(e.target.value))}
                            className={inputCls} disabled={isSubmitting} />
                    </div>
                </div>
            </section>

            {/* ── Section 3: Product Images ──────────────────────────────────────── */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-navy text-white text-xs flex items-center justify-center font-bold">3</span>
                    Product Images
                    <span className="text-xs font-normal text-gray-400">
                        — stored in Cloudinary · up to 8 images · first = primary
                    </span>
                </h3>

                {uploadPhase && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        <p className="text-blue-700 text-sm font-medium">
                            Uploading images to Cloudinary… please wait
                        </p>
                    </div>
                )}

                {initial && imageSlots.length > 0 && imageSlots.every(s => s.status === "done") && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        Existing images loaded. Remove and re-add any image to replace it. Unchanged images are not re-uploaded.
                    </div>
                )}

                <ImageUploadZone
                    slots={imageSlots}
                    onChange={setImageSlots}
                    maxImages={8}
                    disabled={isSubmitting}
                    productId={initial?.id}
                />
            </section>

            {/* ── Section 4: Specs & Branding ───────────────────────────────────── */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-navy text-white text-xs flex items-center justify-center font-bold">4</span>
                    Specs & Branding
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Material</label>
                        <input value={material} onChange={e => setMaterial(e.target.value)}
                            className={inputCls} placeholder="Stainless Steel 304" disabled={isSubmitting} />
                    </div>
                    <div>
                        <label className={labelCls}>Lead Time</label>
                        <input value={leadTime} onChange={e => setLeadTime(e.target.value)}
                            className={inputCls} placeholder="7-10 working days" disabled={isSubmitting} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelCls}>Branding Options</label>
                        <div className="flex flex-wrap gap-2">
                            {BRANDING_OPTS.map(opt => (
                                <button key={opt} type="button" onClick={() => toggleBranding(opt)}
                                    disabled={isSubmitting}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${branding.includes(opt)
                                        ? "bg-navy text-white border-navy"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-navy"
                                        }`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelCls}>Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
                        <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                            className={inputCls} placeholder="bestseller, eco-friendly, premium"
                            disabled={isSubmitting} />
                    </div>
                </div>
            </section>

            {/* ── Section 5: Settings ───────────────────────────────────────────── */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-navy text-white text-xs flex items-center justify-center font-bold">5</span>
                    Settings
                </h3>
                <div className="flex flex-wrap gap-6">
                    {([
                        { label: "Active (visible on website)", value: isActive, set: setIsActive },
                        { label: "Featured on home page", value: isFeatured, set: setIsFeatured },
                    ] as const).map(({ label, value, set }) => (
                        <label key={label} className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => !isSubmitting && (set as (p: boolean) => void)(!value)}
                                className={`w-11 h-6 rounded-full transition-colors relative ${value ? "bg-navy" : "bg-gray-300"
                                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : ""}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* ── Section 6: SEO ────────────────────────────────────────────────── */}
            <section>
                <h3 className="font-bold text-navy text-base mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-navy text-white text-xs flex items-center justify-center font-bold">6</span>
                    SEO <span className="text-xs font-normal text-gray-400">(optional)</span>
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className={labelCls}>Meta Title <span className="text-gray-400 font-normal">(uses product name if empty)</span></label>
                        <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)}
                            className={inputCls} maxLength={200} disabled={isSubmitting} />
                    </div>
                    <div>
                        <label className={labelCls}>Meta Description</label>
                        <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)}
                            rows={2} className={inputCls} maxLength={500} disabled={isSubmitting} />
                    </div>
                </div>
            </section>

            {/* ── Error ─────────────────────────────────────────────────────────── */}
            {error && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
                    <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* ── Submit row ────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                    {imageSlots.length > 0
                        ? `${imageSlots.length} image${imageSlots.length !== 1 ? "s" : ""} ready — first image will be primary`
                        : "No images added yet"}
                </p>
                <div className="flex items-center gap-3">
                    {isSubmitting && (
                        <p className="text-xs text-gray-500 font-medium">
                            {uploadPhase ? "Uploading images…" : "Saving product…"}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed min-w-[160px]"
                        style={{ background: "linear-gradient(135deg,#0D1B2A,#1A5C4A)" }}>
                        {isSubmitting
                            ? uploadPhase ? "Uploading…" : "Saving…"
                            : submitLabel}
                    </button>
                </div>
            </div>

        </form>
    );
}


