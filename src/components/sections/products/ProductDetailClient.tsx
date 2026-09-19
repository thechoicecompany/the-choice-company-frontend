"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import {
    House,
    CaretRight,
    Scales,
    Clock,
    Barcode,
    Palette,
    Sparkle,
    CheckCircle,
} from "@phosphor-icons/react";

import ProductGallery from "@/components/sections/products/ProductGallery";
import PricingTiers from "@/components/sections/products/PricingTiers";
import QuickInquiryForm from "@/components/forms/QuickInquiryForm";
import RelatedProducts from "@/components/sections/products/RelatedProducts";
import type { Product } from "@/lib/types/product.types";
gsap.registerPlugin(useGSAP);

interface Props {
    product: Product;
    images: string[];
}

const SPEC_MAP = [
    {
        key: "moq" as const,
        label: "Min. Order Qty",
        icon: Scales,
        format: (v: unknown) => `${v} units`,
    },
    {
        key: "leadTime" as const,
        label: "Lead Time",
        icon: Clock,
        format: (v: unknown) => String(v),
    },
    {
        key: "material" as const,
        label: "Material",
        icon: Barcode,
        format: (v: unknown) => String(v),
    },
    {
        key: "brandingOptions" as const,
        label: "Branding",
        icon: Palette,
        format: (v: unknown) =>
            Array.isArray(v) && v.length > 0 ? v.join(", ") : "Available on request",
    },
];

export default function ProductDetailClient({ product, images }: Props) {
    const pageRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Breadcrumb
            gsap.from(".breadcrumb-item", {
                opacity: 0,
                x: -8,
                stagger: 0.06,
                duration: 0.4,
                ease: "power2.out",
            });

            // Left column
            gsap.from(".col-left", {
                opacity: 0,
                x: -24,
                duration: 0.65,
                ease: "power3.out",
                delay: 0.1,
            });

            // Right column
            gsap.from(".col-right", {
                opacity: 0,
                x: 24,
                duration: 0.65,
                ease: "power3.out",
                delay: 0.18,
            });

            // Spec cards stagger
            gsap.from(".spec-card", {
                opacity: 0,
                y: 10,
                stagger: 0.06,
                duration: 0.4,
                ease: "power2.out",
                delay: 0.45,
            });
        },
        { scope: pageRef }
    );

    return (
        <div ref={pageRef} className="min-h-screen bg-[#fafaf8]">
            {/* ── Breadcrumb bar ─────────────────────────────────────────── */}
            <div className="border-b border-zinc-200/70 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-1.5 text-sm text-zinc-400">
                        <Link
                            href="/"
                            className="breadcrumb-item flex items-center gap-1 hover:text-zinc-700 transition-colors"
                        >
                            <House size={13} weight="fill" />
                            Home
                        </Link>
                        <CaretRight size={11} className="breadcrumb-item text-zinc-300" />
                        <Link
                            href="/products"
                            className="breadcrumb-item hover:text-zinc-700 transition-colors"
                        >
                            Products
                        </Link>
                        <CaretRight size={11} className="breadcrumb-item text-zinc-300" />
                        <span className="breadcrumb-item text-zinc-700 font-medium truncate max-w-[180px]">
                            {product.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* ── Main content ───────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-10 xl:gap-14 items-start">

                    {/* ── LEFT: Gallery + Specs ─────────────────────────────── */}
                    <div className="col-left space-y-8">
                        <ProductGallery images={images} productName={product.name} />

                        {/* Spec grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {SPEC_MAP.map(({ key, label, icon: Icon, format }) => {
                                const val = product[key];
                                if (val == null) return null;
                                return (
                                    <div
                                        key={key}
                                        className="spec-card rounded-2xl bg-white border border-zinc-200/80 px-4 py-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]"
                                    >
                                        <Icon
                                            size={18}
                                            weight="fill"
                                            className="text-amber-500 mb-2"
                                        />
                                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">
                                            {label}
                                        </p>
                                        <p className="text-sm font-semibold text-zinc-800 leading-snug">
                                            {format(val)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Full description — desktop only */}
                        <div className="hidden lg:block">
                            <ProductDescription product={product} />
                        </div>
                    </div>

                    {/* ── RIGHT: Identity + Pricing + Form ─────────────────── */}
                    <div className="col-right space-y-6">
                        {/* Category badge */}
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                                <Sparkle size={10} weight="fill" />
                                {product.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight leading-tight">
                            {product.name}
                        </h1>

                        {/* Short description */}
                        <p className="text-base text-zinc-500 leading-relaxed max-w-[65ch]">
                            {product.description}
                        </p>

                        {/* Trust pills */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                "Bulk Ready",
                                "Custom Branding",
                                "Pan-India Delivery",
                                "GST Invoice",
                            ].map((tag) => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 text-[11px] font-medium text-zinc-600 bg-white border border-zinc-200 px-2.5 py-1 rounded-full"
                                >
                                    <CheckCircle
                                        size={11}
                                        weight="fill"
                                        className="text-emerald-500"
                                    />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-zinc-100" />

                        {/* Pricing tiers */}
                        <PricingTiers tiers={product.pricingTiers ?? []} />

                        {/* Inquiry form */}
                        <QuickInquiryForm
                            productName={product.name}
                            productId={product.id}
                            moq={product.moq}
                        />
                    </div>
                </div>

                {/* Full description — mobile only */}
                <div className="lg:hidden mt-10">
                    <ProductDescription product={product} />
                </div>

                {/* Related products */}
                {product.relatedProducts && product.relatedProducts.length > 0 && (
                    <div className="mt-14">
                        <RelatedProducts products={product.relatedProducts} />
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Sub-component: full description block ────────────────────────────────── */
function ProductDescription({ product }: { product: Product }) {
    return (
        <div className="rounded-2xl bg-white border border-zinc-200/80 p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
            <h2 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-400 rounded-full inline-block" />
                About this product
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                {product.fullDescription}
            </p>
        </div>
    );
}