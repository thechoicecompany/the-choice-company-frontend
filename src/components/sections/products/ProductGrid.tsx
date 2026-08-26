"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";
import QuickInquiryForm from "./QuickInquiryForm";
import type { Product } from "@/lib/types/product.types";

interface Props { products: Product[]; total: number; }

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "moq-asc", label: "MOQ: Low to High" },
  { value: "newest", label: "Newest First" },
];

export default function ProductGrid({ products, total }: Props) {
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="font-bold text-navy text-lg mb-2">No products found</h3>
        <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search terms</p>
        <a href="/products" className="btn-navy">Clear Filters</a>
      </div>
    );
  }

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <p className="text-sm text-gray-500">
          Showing <strong className="text-navy">{products.length}</strong> of <strong className="text-navy">{total}</strong> products
        </p>
        <select className="w-auto text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none"
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set("sort", e.target.value);
            window.location.href = url.toString();
          }}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuote={setQuoteProduct} />
        ))}
      </div>

      {/* Quick Inquiry Modal */}
      {quoteProduct && (
        <QuickInquiryForm
          productName={quoteProduct.name}
          productId={quoteProduct.id}
          onClose={() => setQuoteProduct(null)}
          isModal
        />
      )}
    </>
  );
}
