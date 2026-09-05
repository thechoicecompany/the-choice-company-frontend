"use client";
import { useEffect, useState } from "react";
import type { GalleryItem, GalleryItemDetail } from "@/lib/api/gallery";
import { fetchGalleryItemDetail } from "@/lib/api/gallery";

interface Props {
    item: GalleryItem;
    onClose: () => void;
}

export default function GalleryLightbox({ item, onClose }: Props) {
    const [detail, setDetail] = useState<GalleryItemDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch the real asset URL only now
    useEffect(() => {
        fetchGalleryItemDetail(item.id).then((d) => {
            setDetail(d);
            setLoading(false);
        });
    }, [item.id]);

    // Trap escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[600] bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: "lightboxIn 0.2s ease" }}
            >
                {/* Asset viewer */}
                <div className="flex-1 min-h-0 bg-gray-50 relative overflow-hidden" style={{ minHeight: 360 }}>
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center gap-3 text-gray-400">
                            <span className="animate-spin text-2xl">⏳</span>
                            <span className="text-sm">Loading…</span>
                        </div>
                    ) : !detail ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            Unable to load file
                        </div>
                    ) : item.fileType === "image" || item.fileType === "poster" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={detail.fullUrl}
                            alt={item.projectName}
                            className="w-full h-full object-contain"
                            style={{ maxHeight: 520 }}
                        />
                    ) : item.fileType === "pdf" || item.fileType === "document" ? (
                        <iframe
                            src={`${detail.fullUrl}#toolbar=0`}
                            title={item.projectName}
                            className="w-full h-full border-0"
                            style={{ minHeight: 480 }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            Preview not available
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <h3 className="font-bold text-navy truncate">{item.projectName}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{item.caption}</p>
                    </div>
                    {detail && (
                        <a
                            href={detail.fullUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 btn-sm btn-navy text-xs px-4 py-2 rounded-lg"
                        >
                            Download ↓
                        </a>
                    )}
                </div>
            </div>

            {/* Close button */}
            <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-colors"
            >
                ✕
            </button>

            <style>{`
        @keyframes lightboxIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    );
}