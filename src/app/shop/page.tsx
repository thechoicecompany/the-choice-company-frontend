// app/shop/page.tsx
// SHOP PAGE — ISR 1hr, revalidated on-demand by admin CRUD writes
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import ShopGrid from "@/components/shop/ShopGrid";
import ShopBanner from "@/components/shop/ShopBanner";
import { fetchSampleProducts } from "@/lib/api/sampleProducts";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Sample Shop — Try Before You Bulk Order",
    description:
        "Order 1–5 sample units of our corporate gifts to evaluate quality before placing your bulk order. Fast delivery. Full quality assurance.",
    alternates: { canonical: "https://thechoicecompany.in/shop" },
};

export default async function ShopPage() {
    const products = await fetchSampleProducts();

    return (
        <>
            <PageHero
                title="Try Before You Bulk Order"
                subtitle="Order 1–5 sample units to evaluate quality, branding finish & packaging before committing to bulk"
                breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sample Shop" }]}
            />

            <ShopBanner />

            <section className="section-py" style={{ background: "var(--cream)" }}>
                <div className="container-site">
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        <div>
                            <span className="section-label">SAMPLE PRODUCTS</span>
                            <h2 className="section-title text-2xl">Order Samples</h2>
                        </div>
                        <Link href="/bulk-orders#inquiry-form"
                            className="btn-outline-navy text-sm">
                            📋 Skip to Bulk Order →
                        </Link>
                    </div>
                    <ShopGrid products={products} />
                </div>
            </section>

            <section className="py-12" style={{ background: "var(--navy)" }}>
                <div className="container-site text-center">
                    <h2 className="font-playfair text-2xl font-bold text-white mb-2">
                        Already know what you want?
                    </h2>
                    <p className="text-white/60 text-sm mb-6">
                        Skip samples and go straight to bulk — MOQ from 50 units, get a quote in 24 hours
                    </p>
                    <Link href="/bulk-orders#inquiry-form" className="btn-gold btn-lg">
                        📦 Place Bulk Order →
                    </Link>
                </div>
            </section>
        </>
    );
}