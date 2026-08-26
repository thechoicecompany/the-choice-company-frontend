"use client";
import { useState } from "react";
import Image from "next/image";

interface Props { images: string[]; productName: string; }

export default function ProductGallery({ images, productName }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const safeImages = images.length > 0 ? images : ["/images/products/placeholder.jpg"];
  const active = safeImages[activeIdx];

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 cursor-zoom-in"
          onClick={() => setLightbox(true)}>
          <Image src={active} alt={productName} fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width:1024px) 100vw, 50vw" priority />
          <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:bg-white shadow text-sm">
            ⛶
          </button>
        </div>

        {/* Thumbnails */}
        {safeImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {safeImages.map((img, i) => (
              <button key={i} onClick={() => setActiveIdx(i)}
                className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === activeIdx ? "border-gold shadow-sm" : "border-gray-200 opacity-60 hover:opacity-100"
                  }`}>
                <Image src={img} alt={`${productName} view ${i + 1}`} fill
                  className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[600] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}>
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full" onClick={e => e.stopPropagation()}>
            <Image src={active} alt={productName} fill className="object-contain" sizes="90vw" />
          </div>
          <button onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 text-xl">
            ✕
          </button>
          {safeImages.length > 1 && (
            <>
              <button onClick={() => setActiveIdx(i => (i - 1 + safeImages.length) % safeImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full text-white text-xl hover:bg-white/20 flex items-center justify-center">‹</button>
              <button onClick={() => setActiveIdx(i => (i + 1) % safeImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full text-white text-xl hover:bg-white/20 flex items-center justify-center">›</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
