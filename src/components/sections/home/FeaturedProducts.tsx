"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types/product.types";
import { formatINR } from "@/lib/utils/formatCurrency";

// ─── FALLBACK DATA ────────────────────────────────────────────────────────────
const FALLBACK: Product[] = [
  {
    id: 1, name: "Premium Welcome Kit",
    description: "Thoughtful essentials for a great start",
    slug: "premium-welcome-kit",
    image: "/images/products/p1.jpg",
    images: ["/images/products/p1b.jpg", "/images/products/p1c.jpg"],
    category: "Employee Kits", categorySlug: "employee-kits",
    moq: 50, basePrice: 750, isFeatured: true, tags: ["bestseller"],
  },
  {
    id: 2, name: "Diwali Celebration Box",
    description: "Festive vibes, beautifully curated",
    slug: "diwali-celebration-box",
    image: "/images/products/p2.jpg", images: [],
    category: "Festive Hampers", categorySlug: "festive-hampers",
    moq: 50, basePrice: 899, isFeatured: true, tags: [],
  },
  {
    id: 3, name: "Executive Desk Set",
    description: "Elevate workspaces with style",
    slug: "executive-desk-set",
    image: "/images/products/p3.jpg", images: [],
    category: "Desk Essentials", categorySlug: "office-essentials",
    moq: 50, basePrice: 550, isFeatured: true, tags: [],
  },
  {
    id: 4, name: "Travel Essentials Kit",
    description: "Perfect companion for professionals",
    slug: "travel-essentials-kit",
    image: "/images/products/p4.jpg", images: [],
    category: "Travel Kits", categorySlug: "travel-kits",
    moq: 50, basePrice: 1200, isFeatured: true, tags: [],
  },
  {
    id: 5, name: "Luxury Gift Hamper",
    description: "Premium gifting for lasting impressions",
    slug: "luxury-gift-hamper",
    image: "/images/products/p5.jpg", images: [],
    category: "Premium Gifts", categorySlug: "premium",
    moq: 25, basePrice: 2500, isFeatured: true, tags: ["bestseller"],
  },
  {
    id: 6, name: "Eco-Friendly Kit",
    description: "Sustainable gifts for a better tomorrow",
    slug: "eco-friendly-kit",
    image: "/images/products/p6.jpg", images: [],
    category: "Eco-Friendly", categorySlug: "eco-friendly",
    moq: 50, basePrice: 650, isFeatured: true, tags: [],
  },
];

// ─── PRODUCT IMAGE CAROUSEL ───────────────────────────────────────────────────
// Builds full image list from product:
//   - productImages[] (from product_images table — has listingUrl)
//   - fallback to images[] + image (primary)
function getImageList(product: Product): string[] {
  // If backend returns full productImages with transformation URLs
  if (product.productImages && product.productImages.length > 0) {
    return product.productImages
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(img => img.listingUrl ?? img.imageUrl);
  }
  // Fallback: primary image + extra images array
  const all: string[] = [];
  if (product.image) all.push(product.image);
  if (product.images) all.push(...product.images.filter(Boolean));
  return [...new Set(all)]; // deduplicate
}

interface CarouselProps {
  images: string[];
  productName: string;
  productSlug: string;
}

function ImageCarousel({ images, productName, productSlug }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(i => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(i => (i + 1) % total);
  }, [total]);

  const goTo = useCallback((e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(idx);
  }, []);

  return (
    <Link href={`/products/${productSlug}`} className="block relative h-64 bg-gray-50 overflow-hidden">
      {/* Images */}
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-400 ${idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <Image
            src={src}
            alt={`${productName} — image ${idx + 1}`}
            fill
            className="object-contain p-4"
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            priority={idx === 0}
          />
        </div>
      ))}

      {/* Prev / Next arrows — only if more than 1 image */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10
              w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow
              flex items-center justify-center text-navy text-sm
              opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10
              w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow
              flex items-center justify-center text-navy text-sm
              opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      {/* Dot indicators — bottom center */}
      {total > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10
          flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => goTo(e, idx)}
              className={`rounded-full transition-all duration-200 ${idx === current
                ? "w-4 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              aria-label={`Image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter badge — top left corner */}
      {total > 1 && (
        <div className="absolute top-3 left-3 z-10 bg-black/40 text-white
          text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
          {current + 1} / {total}
        </div>
      )}
    </Link>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FeaturedProducts({ products }: { products: Product[] }) {
  const items = products.length > 0 ? products.slice(0, 6) : FALLBACK;

  return (
    <section className="section-py bg-white">
      <div className="container-site">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-label">OUR COLLECTION</span>
          <h2 className="section-title">Featured Collections</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => {
            const imageList = getImageList(product);

            return (
              <div key={product.id} className="card group flex flex-col">

                {/* ── Image Carousel ──────────────────────────────── */}
                <div className="relative flex-shrink-0">
                  {/* Featured + Bestseller badges */}
                  <div className="absolute top-3 left-16 z-10 flex flex-col gap-1 pointer-events-none">
                    {product.tags?.includes("bestseller") && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow"
                        style={{ background: "var(--orange)" }}>
                        Bestseller
                      </span>
                    )}
                  </div>
                  {/* MOQ badge */}
                  <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm
                    rounded-lg px-2 py-1 text-[10px] font-semibold text-navy shadow-sm pointer-events-none">
                    MOQ {product.moq}
                  </div>

                  <ImageCarousel
                    images={imageList}
                    productName={product.name}
                    productSlug={product.slug}
                  />
                </div>

                {/* ── Content ─────────────────────────────────────── */}
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-navy text-sm mb-1 leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="mb-3 flex items-baseline gap-1">
                    <span className="text-lg font-bold text-navy">
                      {formatINR(product.basePrice)}
                    </span>
                    <span className="text-xs text-gray-400">/unit (bulk)</span>
                  </div>

                  {/* Stock status indicator */}
                  {product.stockStatus && (
                    <div className="mb-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${product.stockStatus === "IN_STOCK"
                        ? "bg-green-100 text-green-700"
                        : product.stockStatus === "LOW_STOCK"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-600"
                        }`}>
                        {product.stockStatus === "IN_STOCK"
                          ? "● In Stock"
                          : product.stockStatus === "LOW_STOCK"
                            ? "● Low Stock"
                            : "● Out of Stock"}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Link href={`/products/${product.slug}`}
                      className="btn-sm btn-outline-navy flex-1 text-center">
                      View Details
                    </Link>
                    <Link href={`/bulk-orders?product=${product.slug}`}
                      className="btn-sm btn-gold flex-1 text-center">
                      Get Quote
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link href="/products" className="btn-outline-navy btn-lg">
            View All Products →
          </Link>
        </div>

      </div>
    </section>
  );
}