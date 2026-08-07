"use client";
import { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/api/gallery";

const TABS = ["All","products","packaging","branding","events","corporate"] as const;
const FALLBACK: GalleryItem[] = Array.from({length:12},(_,i) => ({
  id: i+1, image:"/images/gallery/placeholder.jpg", caption:`Project ${i+1}`,
  category: (["products","packaging","branding","events","corporate"] as const)[i%5],
  projectName:`Corporate Gift Project ${i+1}`,
}));

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [tab,      setTab]      = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem|null>(null);
  const data = items.length > 0 ? items : FALLBACK;
  const filtered = tab === "All" ? data : data.filter(i => i.category === tab);

  return (
    <>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`badge capitalize ${tab === t ? "badge-navy" : "badge-gray"}`}>
            {t}
          </button>
        ))}
      </div>
      {/* Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {filtered.map(item => (
          <div key={item.id} className="card group cursor-pointer break-inside-avoid"
            onClick={() => setLightbox(item)}>
            <div className="relative bg-gray-100 overflow-hidden" style={{ height: `${160 + (item.id % 3) * 60}px` }}>
              <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-gray-100 to-gray-200">🎁</div>
              <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">View ⛶</span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold text-navy">{item.projectName}</p>
              <span className="badge-gray text-[10px] mt-1">{item.category}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[600] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="h-72 bg-gray-100 flex items-center justify-center text-7xl">🎁</div>
            <div className="p-5">
              <h3 className="font-bold text-navy">{lightbox.projectName}</h3>
              <p className="text-sm text-gray-500">{lightbox.caption}</p>
            </div>
          </div>
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 text-xl">✕</button>
        </div>
      )}
    </>
  );
}
