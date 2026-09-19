"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { GalleryItem, FileType } from "@/lib/api/gallery";
import { isCatalogUnlocked } from "@/lib/hooks/useCatalogueRequest";
import CatalogueCard from "./CatalogueCard";

gsap.registerPlugin(useGSAP, ScrollTrigger);


const TAB_LABELS: Record<Tab, string> = {
  "All": "All",
  "festive": "Festive",
  "employee-kits": "Employee Kits",
  "hampers": "Hampers",
  "corporate": "Corporate",
  "tech-electronics": "Tech & Electronics",
  "bags-travel": "Bags & Travel",
  "events": "Events",
  "packaging": "Packaging",
};

// ── constants ──────────────────────────────────────────────────────────────
const BRASS = "#B8892B";
const PENDING_ITEM_KEY = "tcc_pending_download_item";

const ALL_TABS = [
  "All",
  "festive",
  "employee-kits",
  "hampers",
  "corporate",
  "tech-electronics",
  "bags-travel",
  "events",
  "packaging",
] as const;

type Tab = (typeof ALL_TABS)[number];

export const TYPE_LABEL: Record<FileType, string> = {
  image: "Image",
  pdf: "PDF",
  poster: "Poster",
  document: "Doc",
  video: "Video",
};

// ── helpers ────────────────────────────────────────────────────────────────
function downloadDirectly(fileUrl: string, filename: string) {
  const url = fileUrl.replace(
    /\/(image|raw|video)\/upload\//,
    "/$1/upload/fl_attachment/"
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ── component ──────────────────────────────────────────────────────────────
export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [tab, setTab] = useState<Tab>("All");
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // ── filter ──────────────────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      tab === "All" ? items : items.filter((i) => i.category === tab),
    [items, tab]
  );

  // ── pending download on return from /catalog ─────────────────────────────
  useEffect(() => {
    const pendingId = sessionStorage.getItem(PENDING_ITEM_KEY);
    if (!pendingId || !isCatalogUnlocked()) return;
    const item = items.find((i) => String(i.id) === pendingId);
    if (item?.fileUrl) downloadDirectly(item.fileUrl, `${item.projectName}.pdf`);
    sessionStorage.removeItem(PENDING_ITEM_KEY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // ── GSAP: tab bar slide in ───────────────────────────────────────────────
  useGSAP(
    () => {
      gsap.from(tabBarRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: tabBarRef.current,
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: tabBarRef }
  );

  // ── GSAP: staggered card reveal ──────────────────────────────────────────
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".catalogue-card", gridRef.current);
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: {
            each: 0.09,
            from: "start",
          },
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { scope: gridRef, dependencies: [filtered] }
  );

  // ── click handler ────────────────────────────────────────────────────────
  function handleCardClick(item: GalleryItem) {
    if (!item.fileUrl) return;
    if (isCatalogUnlocked()) {
      downloadDirectly(item.fileUrl, `${item.projectName}.pdf`);
      return;
    }
    sessionStorage.setItem(PENDING_ITEM_KEY, String(item.id));
    router.push(`/catalog?returnTo=${encodeURIComponent("/gallery")}`);
  }

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Tab bar */}
      <div
        ref={tabBarRef}
        className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-12 pb-5 border-b border-[#D9D4C7]"
      >
        {ALL_TABS.map((t) => {
          const count =
            t === "All"
              ? items.length
              : items.filter((i) => i.category === t).length;
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative text-sm transition-colors pb-1 group" style={{
                color: active ? "#0D1B2A" : "#8A8577",
                fontWeight: active ? 600 : 400,
              }}
            >
              {t}
              {/* Count badge — only render tabs that have items */}
              {count > 0 && (
                <span
                  className="ml-1.5 text-[10px]"
                  style={{ color: active ? BRASS : "#B0A99A" }}
                >
                  {count}
                </span>
              )}
              {/* Active underline */}
              <span
                className="absolute -bottom-[21px] left-0 right-0 h-[2px] transition-transform duration-200"
                style={{
                  background: BRASS,
                  transform: active ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                }}
              />
            </button>
          );
        })}

        {/* Right: count summary */}
        <span className="ml-auto text-xs" style={{ color: "#9A9285" }}>
          {filtered.length} catalogue{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <div
            className="w-10 h-10 border-2 border-dashed flex items-center justify-center"
            style={{ borderColor: "#C9C2B5" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 9h10M9 4v10"
                stroke="#B0A99A"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-sm" style={{ color: "#9A9285" }}>
            No catalogues in this category yet.
          </p>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8"
        >
          {filtered.map((item) => (
            <CatalogueCard
              key={item.id}
              item={item}
              typeLabel={TYPE_LABEL[item.fileType] ?? "File"}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}
    </>
  );
}