"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, ArrowsOut } from "@phosphor-icons/react";

gsap.registerPlugin(useGSAP);

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".gallery-main", {
      opacity: 0,
      scale: 0.96,
      duration: 0.7,
      ease: "power3.out",
    });
    gsap.from(".gallery-thumb", {
      opacity: 0,
      y: 16,
      stagger: 0.07,
      duration: 0.5,
      ease: "power2.out",
      delay: 0.3,
    });
  }, { scope: containerRef });

  const switchImage = (idx: number) => {
    if (idx === active) return;
    const img = mainImgRef.current;
    if (!img) { setActive(idx); return; }
    gsap.to(img, {
      opacity: 0,
      scale: 0.97,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        setActive(idx);
        gsap.to(img, { opacity: 1, scale: 1, duration: 0.28, ease: "power2.out" });
      },
    });
  };

  const prev = () => switchImage((active - 1 + images.length) % images.length);
  const next = () => switchImage((active + 1) % images.length);

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      {/* Main image */}
      {/* <div className="gallery-main relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 group">
        <img
          ref={mainImgRef}
          src={images[active]}
          alt={`${productName} – view ${active + 1}`}
          className="w-full h-full object-cover"
        /> */}
      <div className="gallery-main relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-zinc-100 group">
        <img
          ref={mainImgRef}
          src={images[active]}
          alt={`${productName} – view ${active + 1}`}
          className="w-full h-full object-contain p-3"
        />
        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white active:scale-95"
              aria-label="Previous image"
            >
              <ArrowLeft size={16} weight="bold" className="text-zinc-800" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white active:scale-95"
              aria-label="Next image"
            >
              <ArrowRight size={16} weight="bold" className="text-zinc-800" />
            </button>
          </>
        )}
        {/* Expand */}
        <button
          onClick={() => setLightbox(true)}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white active:scale-95"
          aria-label="Expand image"
        >
          <ArrowsOut size={14} weight="bold" className="text-zinc-800" />
        </button>
        {/* Dot counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => switchImage(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-5 bg-amber-500" : "w-1.5 bg-white/60"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div ref={thumbsRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => switchImage(i)}
              className={`gallery-thumb flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 active:scale-95 ${i === active
                ? "border-amber-500 shadow-[0_0_0_2px_rgba(245,158,11,0.25)]"
                : "border-zinc-200 hover:border-zinc-400"
                }`}
              aria-label={`View image ${i + 1}`}
            >
              {/* <img src={src} alt={`${productName} thumbnail ${i + 1}`} className="w-full h-full object-cover" /> */}
              <img src={src} alt={`${productName} thumbnail ${i + 1}`} className="w-full h-full object-contain bg-white p-1" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <img
            src={images[active]}
            alt={productName}
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
            aria-label="Close lightbox"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}