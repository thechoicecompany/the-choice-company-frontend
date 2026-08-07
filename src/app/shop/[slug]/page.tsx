// SHOP PRODUCT DETAIL — SSR
// Sample purchase page for a single product.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import ShopProductDetail from "@/components/shop/ShopProductDetail";
import { SAMPLE_PRODUCTS } from "@/lib/constants/sampleProducts";

export async function generateStaticParams() {
    return SAMPLE_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const product = SAMPLE_PRODUCTS.find(p => p.slug === slug);
    if (!product) return { title: "Product Not Found" };
    return {
        title: `${product.name} — Order Sample`,
        description: `Order 1–${product.maxSampleQty} sample units of ${product.name} to evaluate quality before bulk ordering. ₹${product.samplePrice}/unit.`,
    };
}

export default async function ShopProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = SAMPLE_PRODUCTS.find(p => p.slug === slug);
    if (!product) notFound();

    return (
        <>
            <PageHero
                title={product.name}
                subtitle="Order a sample to evaluate quality before your bulk order"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Sample Shop", href: "/shop" },
                    { label: product.name },
                ]}
            />
            <section className="section-py">
                <div className="container-site">
                    <ShopProductDetail product={product} />
                </div>
            </section>

            {/* Bulk CTA */}
            <section className="py-10 border-t border-gray-100 bg-white">
                <div className="container-site flex flex-col md:flex-row items-center justify-between gap-5">
                    <div>
                        <h3 className="font-bold text-navy text-base">Need {product.moq}+ units?</h3>
                        <p className="text-sm text-gray-500">
                            Bulk price: <strong className="text-teal">₹{product.bulkPrice}/unit</strong> · Save{" "}
                            {Math.round(((product.samplePrice - product.bulkPrice) / product.samplePrice) * 100)}% vs sample price
                        </p>
                    </div>
                    <Link href="/bulk-orders#inquiry-form" className="btn-teal">
                        📦 Get Bulk Quote (MOQ {product.moq} units) →
                    </Link>
                </div>
            </section>
        </>
    );
}
