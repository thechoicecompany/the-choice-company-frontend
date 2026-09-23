import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero/PageHero";
import ShopGridAnimated from "@/components/shop/ShopGrid";
import ShopBanner from "@/components/shop/ShopBanner";
import ScrollRevealWrapper from "@/components/ui/ScrollRevealWrapper";
import { fetchSampleProducts } from "@/lib/api/sampleProducts";
import { heroPresets } from "@/components/ui/PageHero/heroPresets";

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
            <PageHero {...heroPresets.sampleShop} />

            <ScrollRevealWrapper variant="fadeUp" threshold={0.1}>
                <ShopBanner />
            </ScrollRevealWrapper>

            <section className="section-py" style={{ background: "var(--cream)" }}>
                <div className="container-site">
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        <div>
                            <span className="section-label">SAMPLE PRODUCTS</span>
                            <h2 className="section-title text-2xl mt-1">Order Samples</h2>
                        </div>
                        <Link href="/bulk-orders#inquiry-form" className="btn-outline-navy text-sm">
                            📋 Skip to Bulk Order →
                        </Link>
                    </div>

                    {/* Animated grid with TiltCard + stagger */}
                    <ShopGridAnimated products={products} />
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