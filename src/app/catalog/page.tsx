import type { Metadata } from "next";
import { springApi } from "@/lib/api/client";
import CatalogPreviewGrid from "@/components/catalog/CatalogPreviewGrid";
import CatalogRequestForm from "@/components/catalog/CatalogRequestForm";

export const metadata: Metadata = {
    title: "Our Catalogue",
    description:
        "Explore a preview of our corporate gifting work — then request the full catalogue tailored to your requirements.",
};

interface PreviewProduct {
    id: number;
    name: string;
    slug: string;
    category: string;
    image: string;
    basePrice: number;
}

async function getPreviewProducts(): Promise<PreviewProduct[]> {
    try {
        const res = await springApi.get("/api/products", {
            params: { featured: true, size: 8 },
        });
        return res.data?.data?.content ?? [];
    } catch (err) {
        console.error("[catalog] failed to load preview products:", err);
        return [];
    }
}

export default async function CatalogPage() {
    const previewProducts = await getPreviewProducts();

    return (
        <div className="bg-gray-50">
            <section className="bg-navy text-white">
                <div className="max-w-6xl mx-auto px-6 py-16 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                        Our Catalogue
                    </h1>
                    <p className="mt-3 text-white/70 max-w-xl mx-auto">
                        A glimpse of what we&apos;ve delivered for our clients — and what we can build for you.
                        Request the full catalogue and tell us what you&apos;re looking for; we&apos;ll take it from there.
                    </p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-14">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-navy">A preview of our work</h2>
                    <span className="text-sm text-gray-400">{previewProducts.length} featured items</span>
                </div>
                <CatalogPreviewGrid products={previewProducts} />
            </section>

            <section className="max-w-3xl mx-auto px-6 pb-20">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                    <h2 className="text-xl font-bold text-navy mb-1">Get the full catalogue</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Share a few details and your specific requirements — our team will review and get back to you
                        with the full catalogue and a tailored recommendation.
                    </p>
                    <CatalogRequestForm />
                </div>
            </section>
        </div>
    );
}