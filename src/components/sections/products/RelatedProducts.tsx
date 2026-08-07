import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types/product.types";

export default function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <div>
      <h2 className="font-playfair text-2xl font-bold text-navy mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.slice(0, 4).map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`} className="card group block">
            <div className="relative h-40 bg-gray-50 overflow-hidden">
              <Image src={p.image} alt={p.name} fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="25vw" />
            </div>
            <div className="p-3">
              <p className="text-xs font-bold text-navy line-clamp-2 group-hover:text-gold transition-colors">{p.name}</p>
              <p className="text-xs text-gray-400 mt-1">From ₹{p.basePrice.toLocaleString("en-IN")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
