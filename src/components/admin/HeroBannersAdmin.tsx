"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useHeroBanners } from "@/lib/hooks/useHeroBanners";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import type { HeroBanner, BannerFormValues } from "@/lib/types/heroBanner.types";

export default function HeroBannersAdmin() {
    const {
        banners, loading, error,
        formValues, editingId, saving, formOpen, imagePreview,
        draggingIndex,
        load, openCreateForm, openEditForm, closeForm, updateField,
        handleImageSelected, save, remove, toggle,
        onDragStart, onDragOver, onDrop, onDragEnd,
    } = useHeroBanners();

    const { hasRole } = useAdminAuth();
    const canDelete = hasRole("SUPER_ADMIN", "CONTENT_MANAGER");

    useEffect(() => { load(); }, [load]);

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy font-playfair">Hero Banners</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Swap the homepage banners for festivals or promotions — up to 3 active at a time.
                    </p>
                </div>
                {!formOpen && banners.length > 0 && (
                    <button onClick={() => openCreateForm(banners.length)} className="btn-navy shrink-0">
                        + New Banner
                    </button>
                )}
            </div>

            {error && !formOpen && (
                <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className={`grid grid-cols-1 gap-6 ${formOpen ? "lg:grid-cols-[1fr_420px]" : ""}`}>
                {/* Banner list */}
                {loading ? (
                    <div className="space-y-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : banners.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
                        <p className="text-sm font-semibold text-gray-500 mb-1">No banners yet</p>
                        <p className="text-xs text-gray-400 mb-5 max-w-xs">
                            Create your first banner to show it in the homepage carousel.
                        </p>
                        <button onClick={() => openCreateForm(0)} className="btn-navy">+ New Banner</button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-xs text-gray-400">
                            Drag to reorder — first card shows first on the homepage.
                        </p>
                        {banners.map((banner, index) => (
                            <BannerRow
                                key={banner.id}
                                banner={banner}
                                isDragging={draggingIndex === index}
                                isEditing={editingId === banner.id}
                                canDelete={canDelete}
                                onDragStart={() => onDragStart(index)}
                                onDragOver={(e) => onDragOver(e, index)}
                                onDrop={onDrop}
                                onDragEnd={onDragEnd}
                                onEdit={() => openEditForm(banner)}
                                onToggle={() => toggle(banner.id)}
                                onDelete={() => {
                                    if (confirm(`Delete "${banner.headlineTop} ${banner.headlineBottom}"? This can't be undone.`)) {
                                        remove(banner.id);
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Form panel */}
                {formOpen && (
                    <BannerFormPanel
                        values={formValues}
                        editingId={editingId}
                        saving={saving}
                        imagePreview={imagePreview}
                        error={error}
                        onFieldChange={updateField}
                        onImageSelected={handleImageSelected}
                        onSave={save}
                        onCancel={closeForm}
                    />
                )}
            </div>
        </div>
    );
}

// ── BannerRow ─────────────────────────────────────────────────────────────────

function BannerRow({
    banner, isDragging, isEditing, canDelete,
    onDragStart, onDragOver, onDrop, onDragEnd,
    onEdit, onToggle, onDelete,
}: {
    banner: HeroBanner;
    isDragging: boolean;
    isEditing: boolean;
    canDelete: boolean;
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: () => void;
    onDragEnd: () => void;
    onEdit: () => void;
    onToggle: () => void;
    onDelete: () => void;
}) {
    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-4 bg-white rounded-xl border p-3 transition-shadow
                ${isDragging ? "opacity-50 shadow-lg" : "shadow-sm"}
                ${isEditing ? "ring-2 ring-navy" : ""}`}
        >
            {/* Drag handle */}
            <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                    <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
                </svg>
            </div>

            {/* Thumbnail — 3:1 crop to match poster ratio */}
            <div className="relative w-36 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <Image
                    src={banner.imageUrl}
                    alt={banner.headlineTop}
                    fill
                    className="object-cover object-center"
                    sizes="144px"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide truncate">
                    {banner.tag}
                </p>
                <p className="text-sm font-bold text-navy truncate">
                    {banner.headlineTop} {banner.headlineBottom}
                </p>
                <p className="text-xs text-gray-400 truncate">
                    Links to:{" "}
                    {banner.ctaLink
                        ? <span className="text-navy">{banner.ctaLink}</span>
                        : <span className="italic">no link</span>
                    }
                </p>
            </div>

            {/* Active toggle */}
            <button
                onClick={onToggle}
                className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors
                    ${banner.active
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
            >
                {banner.active ? "Active" : "Inactive"}
            </button>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
                <button
                    onClick={onEdit}
                    className="text-xs font-semibold text-navy hover:underline px-2"
                >
                    Edit
                </button>
                {canDelete && (
                    <button
                        onClick={onDelete}
                        className="text-xs font-semibold text-red-500 hover:underline px-2"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

// ── BannerFormPanel ───────────────────────────────────────────────────────────

function BannerFormPanel({
    values, editingId, saving, imagePreview, error,
    onFieldChange, onImageSelected, onSave, onCancel,
}: {
    values: BannerFormValues;
    editingId: number | null;
    saving: boolean;
    imagePreview: string;
    error: string;
    onFieldChange: <K extends keyof BannerFormValues>(key: K, value: BannerFormValues[K]) => void;
    onImageSelected: (file: File) => void;
    onSave: () => void;
    onCancel: () => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const field =
        <K extends keyof BannerFormValues>(key: K) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const target = e.target as HTMLInputElement;
                const value = target.type === "checkbox"
                    ? (target.checked as BannerFormValues[K])
                    : (target.value as BannerFormValues[K]);
                onFieldChange(key, value);
            };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImageSelected(file);
    };

    return (
        <div className="bg-white rounded-2xl border shadow-sm p-6 h-fit sticky top-6">
            <h2 className="text-lg font-bold text-navy font-playfair mb-5">
                {editingId ? "Edit Banner" : "New Banner"}
            </h2>

            {error && (
                <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <div className="space-y-4">
                {/* Image upload — aspect-[3/1] matches the 1200×400 poster exactly */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Banner Image <span className="text-red-400">*</span>
                    </label>
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                        className="relative w-full aspect-[3/1] rounded-xl border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors group"
                    >
                        {imagePreview ? (
                            <>
                                <Image
                                    src={imagePreview}
                                    alt="Banner preview"
                                    fill
                                    className="object-cover object-center"
                                    sizes="420px"
                                    unoptimized={imagePreview.startsWith("blob:")}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">Change image</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-1.5 px-4 text-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <span className="text-sm font-medium">Click to upload image</span>
                                {/* ↓ Updated to reflect the fixed 1200×400 size */}
                                <span className="text-xs">JPEG · PNG · WebP · max 5 MB · 1200 × 400 px</span>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                <Field label="Eyebrow Tag" required>
                    <input
                        value={values.tag}
                        onChange={field("tag")}
                        maxLength={120}
                        className="admin-input"
                        placeholder="e.g. DIWALI 2025 · FESTIVE GIFTING"
                    />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                    <Field label="Headline — line 1" required>
                        <input
                            value={values.headlineTop}
                            onChange={field("headlineTop")}
                            maxLength={200}
                            className="admin-input"
                            placeholder="Make Every"
                        />
                    </Field>
                    <Field label="Headline — line 2 (gold)" required>
                        <input
                            value={values.headlineBottom}
                            onChange={field("headlineBottom")}
                            maxLength={200}
                            className="admin-input"
                            placeholder="Festival Special"
                        />
                    </Field>
                </div>

                <Field label="Sub-copy" required>
                    <textarea
                        value={values.body}
                        onChange={field("body")}
                        maxLength={400}
                        rows={3}
                        className="admin-input resize-none"
                        placeholder="Short description shown beneath the headline…"
                    />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                    <Field label="CTA / Redirect Link" hint="Where the poster links to when clicked.">
                        <input
                            value={values.ctaLink}
                            onChange={field("ctaLink")}
                            maxLength={300}
                            className="admin-input"
                            placeholder="/our-products, /gallery, /contact"
                        />
                    </Field>
                    <Field label="Display Order">
                        <input
                            type="number"
                            min={0}
                            value={values.displayOrder}
                            onChange={field("displayOrder")}
                            className="admin-input"
                        />
                    </Field>
                </div>

                <Field label="Status">
                    <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={values.active}
                            onChange={field("active")}
                            className="w-4 h-4 accent-navy"
                        />
                        <span className="text-sm text-gray-700">Active (visible on site)</span>
                    </label>
                </Field>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="btn-navy flex-1 disabled:opacity-60"
                >
                    {saving ? "Saving…" : editingId ? "Save Changes" : "Create Banner"}
                </button>
                <button
                    onClick={onCancel}
                    disabled={saving}
                    className="btn-outline-navy px-5 disabled:opacity-60"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ── Field helper ──────────────────────────────────────────────────────────────

function Field({
    label, required, hint, children,
}: {
    label: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {hint && <p className="text-[11px] text-gray-400 mb-1.5">{hint}</p>}
            {children}
        </div>
    );
}