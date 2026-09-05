"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import type { GalleryItem, FileType } from "@/lib/api/gallery";
import { isCatalogUnlocked } from "@/lib/hooks/useCatalogueRequest";
import { useLazyLoad } from "@/lib/hooks/useLazyLoad";
import GalleryLightbox from "./GalleryLightbox";
import CatalogGateModal from "@/components/catalog/CatalogGateModal";

const TABS = ["All", "products", "packaging", "branding", "events", "corporate"] as const;

const TYPE_ICON: Record<FileType, string> = {
  image: "🖼", pdf: "📄", poster: "🗞", document: "📑", video: "🎬",
};
const TYPE_LABEL: Record<FileType, string> = {
  image: "Image", pdf: "PDF", poster: "Poster", document: "Doc", video: "Video",
};
const HEIGHT_MAP = [220, 280, 240, 300, 260];

function GalleryCard({
  item, index, onClick,
}: {
  item: GalleryItem;
  index: number;
  onClick: (item: GalleryItem) => void;
}) {
  const { ref, isVisible } = useLazyLoad();
  const height = HEIGHT_MAP[index % HEIGHT_MAP.length];
  const icon = TYPE_ICON[item.fileType] ?? "📁";
  const label = TYPE_LABEL[item.fileType] ?? "File";

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      className="group cursor-pointer break-inside-avoid mb-4"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.4s ease ${(index % 6) * 60}ms, transform 0.4s ease ${(index % 6) * 60}ms`,
      }}
    >
      <div className="relative overflow-hidden bg-gray-100 rounded-t-2xl" style={{ height }}>
        {isVisible && item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.projectName}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}

        <span className="absolute top-2 left-2 badge-gray text-[10px] font-semibold backdrop-blur-sm bg-white/80">
          {icon} {label}
        </span>

        <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="text-white text-sm font-medium tracking-wide">Open ↗</span>
        </div>
      </div>

      <div className="p-3 border border-t-0 border-gray-100 rounded-b-2xl bg-white">
        <p className="text-xs font-semibold text-navy truncate">{item.projectName}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="badge-gray text-[10px] capitalize">{item.category}</span>
          {item.clientIndustry && (
            <span className="text-[10px] text-gray-400 truncate max-w-[80px]">{item.clientIndustry}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [tab, setTab] = useState<string>("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  // Item the user tried to open before passing the contact gate
  const [pendingItem, setPendingItem] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () => (tab === "All" ? items : items.filter((i) => i.category === tab)),
    [items, tab]
  );

  function handleCardClick(item: GalleryItem) {
    if (isCatalogUnlocked()) {
      setLightboxItem(item);
    } else {
      setPendingItem(item);
    }
  }

  function handleGateSuccess() {
    setLightboxItem(pendingItem);
    setPendingItem(null);
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`badge capitalize transition-colors ${tab === t ? "badge-navy" : "badge-gray"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-20">No items in this category yet.</p>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {filtered.map((item, i) => (
            <GalleryCard key={item.id} item={item} index={i} onClick={handleCardClick} />
          ))}
        </div>
      )}

      {lightboxItem && (
        <GalleryLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}

      {pendingItem && (
        <CatalogGateModal
          onClose={() => setPendingItem(null)}
          onSuccess={handleGateSuccess}
        />
      )}
    </>
  );
}