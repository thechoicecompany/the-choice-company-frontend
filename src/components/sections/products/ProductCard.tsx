// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";
// import type { Product } from "@/lib/types/product.types";

// interface Props { product: Product; onQuote?: (product: Product) => void; }

// export default function ProductCard({ product, onQuote }: Props) {
//   const [imgError, setImgError] = useState(false);

//   return (
//     <div className="card group flex flex-col h-full">
//       {/* Image */}
//       <div className="relative h-48 bg-gray-50 overflow-hidden flex-shrink-0">
//         {!imgError ? (
//           <Image src={product.image} alt={product.name} fill
//             className="object-cover group-hover:scale-105 transition-transform duration-500"
//             sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
//             onError={() => setImgError(true)} />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-5xl">🎁</div>
//         )}
//         <span className="badge-gold absolute top-3 left-3 text-[10px]">{product.category}</span>
//         {product.isFeatured && (
//           <span className="badge absolute top-3 right-3 text-[10px] bg-orange text-white">Featured</span>
//         )}
//       </div>

//       {/* Content */}
//       <div className="p-4 flex flex-col flex-1">
//         <h3 className="font-bold text-navy text-sm mb-1 leading-snug line-clamp-2">{product.name}</h3>
//         <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{product.description}</p>

//         {/* MOQ + Price */}
//         <div className="flex items-center justify-between mb-3">
//           <span className="text-xs text-gray-400 font-medium">MOQ: {product.moq} units</span>
//           <span className="text-sm font-bold text-navy">
//             From ₹{product.basePrice.toLocaleString("en-IN")}
//           </span>
//         </div>

//         {/* Tags */}
//         {product.tags && product.tags.length > 0 && (
//           <div className="flex flex-wrap gap-1 mb-3">
//             {product.tags.slice(0, 2).map((tag) => (
//               <span key={tag} className="badge-gray text-[10px]">{tag}</span>
//             ))}
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex gap-2 mt-auto">
//           <Link href={`/products/${product.slug}`}
//             className="btn-sm btn-outline-navy flex-1 text-center">
//             View Details
//           </Link>
//           <button onClick={() => onQuote?.(product)}
//             className="btn-sm btn-gold flex-1">
//             Get Quote
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import Link from "next/link";
import type { Product } from "@/lib/types/product.types";
import ImageCarousel from "@/components/shared/ImageCarousel"; // move carousel here

function getImageList(product: Product): string[] {
  if (product.productImages && product.productImages.length > 0) {
    return product.productImages
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(img => img.listingUrl ?? img.imageUrl);
  }
  const all: string[] = [];
  if (product.image) all.push(product.image);
  if (product.images) all.push(...product.images.filter(Boolean));
  return [...new Set(all)];
}

interface Props { product: Product; onQuote?: (product: Product) => void; }

export default function ProductCard({ product, onQuote }: Props) {
  const imageList = getImageList(product);

  return (
    <div className="card group flex flex-col h-full">
      {/* Image Carousel */}
      <div className="relative flex-shrink-0">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
          <span className="badge-gold text-[10px]">{product.category}</span>
          {product.isFeatured && (
            <span className="badge text-[10px] bg-orange text-white">Featured</span>
          )}
        </div>
        <ImageCarousel
          images={imageList}
          productName={product.name}
          productSlug={product.slug}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-navy text-sm mb-1 leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400 font-medium">MOQ: {product.moq} units</span>
          <span className="text-sm font-bold text-navy">
            From ₹{product.basePrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="badge-gray text-[10px]">{tag}</span>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <Link href={`/products/${product.slug}`} className="btn-sm btn-outline-navy flex-1 text-center">
            View Details
          </Link>
          <button onClick={() => onQuote?.(product)} className="btn-sm btn-gold flex-1">
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
}