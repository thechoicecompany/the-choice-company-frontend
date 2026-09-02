import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ProductFilters from "@/components/sections/products/ProductFilters";
import ProductGrid from "@/components/sections/products/ProductGrid";
import { fetchProducts } from "@/lib/api/products";

export const revalidate = 3600;

interface Props {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ budget?: string; occasion?: string; sort?: string; page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category } = await params;
    const label = category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return {
        title: `${label} — Corporate Gifts`,
        description: `Browse ${label} corporate gifts with custom branding. MOQ from 50 units.`,
        alternates: { canonical: `https://thechoicecompany.in/products/category/${category}` },
    };
}

export default async function ProductCategoryPage({ params, searchParams }: Props) {
    const { category } = await params;
    const p = await searchParams;

    const { data: products, total } = await fetchProducts({
        category,
        budget: p.budget,
        occasion: p.occasion,
        sort: p.sort || "popular",
        page: Number(p.page) || 1,
    }).catch(() => ({ data: [], total: 0, page: 1, perPage: 24, totalPages: 0 }));

    const label = category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    return (
        <>
            <PageHero
                title={label}
                subtitle="Premium corporate gifts with custom branding"
                breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label }]}
            />
            <section className="section-py">
                <div className="container-site">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <aside className="w-full lg:w-64 flex-shrink-0">
                            <ProductFilters activeFilters={{ category, ...p }} />
                        </aside>
                        <div className="flex-1 min-w-0">
                            <ProductGrid products={products} total={total} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}