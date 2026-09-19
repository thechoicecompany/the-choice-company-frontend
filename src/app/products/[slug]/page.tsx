import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SchemaMarkup from "@/components/ui/SchemaMarkup";
import { fetchProductBySlug, fetchAllProductSlugs } from "@/lib/api/products";
import type { Product } from "@/lib/types/product.types";
import ProductDetailClient from "@/components/sections/products/ProductDetailClient";

export const revalidate = 1800;

function getImageList(product: Product): string[] {
  if (product.productImages && product.productImages.length > 0) {
    return product.productImages
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => img.detailUrl ?? img.imageUrl);
  }
  const all: string[] = [];
  if (product.image) all.push(product.image);
  if (product.images) all.push(...product.images.filter(Boolean));
  return [...new Set(all)];
}

export async function generateStaticParams() {
  return (await fetchAllProductSlugs().catch(() => [])).map((s) => ({ slug: s }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await fetchProductBySlug(slug).catch(() => null);
  return p
    ? { title: p.name, description: p.description }
    : { title: "Product Not Found" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  const images = getImageList(product);

  return (
    <>
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: images[0],
        }}
      />
      <ProductDetailClient product={product} images={images} />
    </>
  );
}



