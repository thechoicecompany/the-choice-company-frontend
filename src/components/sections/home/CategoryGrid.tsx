"use client";
import Link from "next/link";
import { useRef } from "react";
import { CATEGORIES } from "@/lib/constants/categories";

export default function CategoryGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "l" | "r") => ref.current?.scrollBy({ left: dir === "l" ? -300 : 300, behavior: "smooth" });

  return (
    <section className="section-py" style={{ background: "var(--cream)", paddingTop: '1rem' }}>
      <div className="container-site">
        <div className="text-center mb-20">
          <span className="section-label" style={{ color: '#363f48', fontWeight: 'bold', fontSize: '1rem' }}>SHOP BY CATEGORY</span>
        </div>
        <div className="relative">
          <button onClick={() => scroll("l")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg" aria-label="Scroll left">‹</button>
          <div ref={ref} className="flex gap-4 overflow-x-auto no-scrollbar px-2 pb-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.slug} href={`/products/category/${cat.slug}`}
                  className="flex-shrink-0 w-[120px] group">
                  <div className={`w-full aspect-square rounded-2xl ${cat.color} border border-gray-100 flex items-center justify-center group-hover:shadow-md transition-all mb-2`}>
                    <Icon className={`w-8 h-8 ${cat.iconColor} transition-colors`} />
                  </div>
                  <p className="text-[12px] font-medium text-center text-gray-600 group-hover:text-gold transition-colors">{cat.label}</p>
                </Link>
              );
            })}
          </div>
          <button onClick={() => scroll("r")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg" aria-label="Scroll right">›</button>
        </div>
      </div>
    </section>
  );
}