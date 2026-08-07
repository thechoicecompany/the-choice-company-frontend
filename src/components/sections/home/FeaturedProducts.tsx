import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types/product.types";

const FALLBACK = [
  { id:1, name:"Premium Welcome Kit",    description:"Thoughtful essentials for a great start", slug:"premium-welcome-kit",    image:"/images/products/p1.jpg", category:"Employee Kits", categorySlug:"employee-kits", moq:50, basePrice:750, isFeatured:true, tags:[] },
  { id:2, name:"Diwali Celebration Box", description:"Festive vibes, beautifully curated",       slug:"diwali-celebration-box", image:"/images/products/p2.jpg", category:"Festive Hampers", categorySlug:"festive-hampers", moq:50, basePrice:899, isFeatured:true, tags:[] },
  { id:3, name:"Executive Desk Set",     description:"Elevate workspaces with style",            slug:"executive-desk-set",     image:"/images/products/p3.jpg", category:"Desk Essentials", categorySlug:"office-essentials", moq:50, basePrice:550, isFeatured:true, tags:[] },
  { id:4, name:"Travel Essentials Kit",  description:"Perfect companion for professionals",      slug:"travel-essentials-kit",  image:"/images/products/p4.jpg", category:"Travel Kits", categorySlug:"travel-kits", moq:50, basePrice:1200, isFeatured:true, tags:[] },
  { id:5, name:"Luxury Gift Hamper",     description:"Premium gifting for lasting impressions",  slug:"luxury-gift-hamper",     image:"/images/products/p5.jpg", category:"Premium Gifts", categorySlug:"premium", moq:25, basePrice:2500, isFeatured:true, tags:[] },
  { id:6, name:"Eco-Friendly Kit",       description:"Sustainable gifts for a better tomorrow",  slug:"eco-friendly-kit",       image:"/images/products/p6.jpg", category:"Eco-Friendly", categorySlug:"eco-friendly", moq:50, basePrice:650, isFeatured:true, tags:[] },
];

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const items = products.length > 0 ? products.slice(0, 6) : FALLBACK;
  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <div className="text-center mb-12">
          <span className="section-label">OUR COLLECTION</span>
          <h2 className="section-title">Featured Collections</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => (
            <div key={product.id} className="card group">
              <div className="relative h-52 bg-gray-50 overflow-hidden">
                <Image src={product.image} alt={product.name} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                <span className="badge-gold absolute top-3 left-3 text-[11px]">{product.category}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-navy mb-1 text-base">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{product.description}</p>
                <div className="flex gap-2">
                  <Link href={`/products/${product.slug}`} className="btn-sm btn-outline-navy flex-1 text-center">View Details</Link>
                  <Link href={`/bulk-orders?product=${product.slug}`} className="btn-sm btn-gold flex-1 text-center">Get Quote</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/products" className="btn-outline-navy btn-lg">View All Products →</Link>
        </div>
      </div>
    </section>
  );
}
