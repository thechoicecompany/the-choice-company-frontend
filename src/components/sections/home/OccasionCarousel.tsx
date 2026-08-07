"use client";
import Link from "next/link";
import { useRef } from "react";
import { OCCASIONS } from "@/lib/constants/occasions";

export default function OccasionCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "l" | "r") => {
    if (ref.current) ref.current.scrollBy({ left: dir === "l" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <section className="section-py" style={{ background: "var(--cream)" }}>
      <div className="container-site">
        <div className="text-center mb-8">
          <span className="section-label">SHOP BY OCCASION</span>
        </div>
        <div className="relative">
          {/* Left arrow */}
          <button onClick={() => scroll("l")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-navy hover:shadow-lg transition-shadow" aria-label="Scroll left">‹</button>

          <div ref={ref} className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-2">
            {OCCASIONS.map((occ) => (
              <Link key={occ.slug}
                href={`/products?occasion=${occ.slug}`}
                className="flex flex-col items-center gap-2 flex-shrink-0 w-[90px] group">
                <div className="w-16 h-16 rounded-full border-2 border-gold/30 flex items-center justify-center text-2xl bg-white group-hover:border-gold group-hover:bg-gold/5 transition-all">
                  {occ.icon}
                </div>
                <span className="text-[11px] text-center text-gray-600 font-medium leading-tight group-hover:text-gold transition-colors">
                  {occ.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right arrow */}
          <button onClick={() => scroll("r")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-navy hover:shadow-lg transition-shadow" aria-label="Scroll right">›</button>
        </div>
      </div>
    </section>
  );
}
