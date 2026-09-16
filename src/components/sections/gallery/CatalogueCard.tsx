"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { GalleryItem } from "@/lib/api/gallery";
import { useLazyLoad } from "@/lib/hooks/useLazyLoad";

gsap.registerPlugin(useGSAP);

const BRASS = "#B8892B";

interface Props {
    item: GalleryItem;
    typeLabel: string;
    onClick: (item: GalleryItem) => void;
}

export default function CatalogueCard({ item, typeLabel, onClick }: Props) {
    const { ref: lazyRef, isVisible } = useLazyLoad();
    const cardRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const spineRef = useRef<HTMLDivElement>(null);

    // ── hover micro-animation via GSAP ────────────────────────────────────────
    useGSAP(
        () => {
            const card = cardRef.current;
            const overlay = overlayRef.current;
            const spine = spineRef.current;
            if (!card || !overlay || !spine) return;

            const enter = gsap.timeline({ paused: true })
                .to(overlay, { opacity: 1, duration: 0.2, ease: "power2.out" }, 0)
                .to(spine, { scaleY: 1.04, duration: 0.3, ease: "power2.out" }, 0)
                .to(card, { y: -3, duration: 0.3, ease: "power2.out" }, 0);

            const handleEnter = () => enter.play();
            const handleLeave = () => enter.reverse();

            card.addEventListener("mouseenter", handleEnter);
            card.addEventListener("mouseleave", handleLeave);

            return () => {
                card.removeEventListener("mouseenter", handleEnter);
                card.removeEventListener("mouseleave", handleLeave);
                enter.kill();
            };
        },
        { scope: cardRef }
    );

    return (
        <div
            ref={(node) => {
                // merge lazy ref + card ref
                (lazyRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            onClick={() => onClick(item)}
            className="catalogue-card cursor-pointer bg-white flex flex-col"
            style={{
                borderLeft: `3px solid ${BRASS}`,
                willChange: "transform",
                // Tinted shadow (hued to paper background)
                boxShadow: "0 2px 12px rgba(92,74,42,0.08)",
            }}
        >
            {/* Spine accent — the left border visually "thickens" on hover via scaleY */}
            <div
                ref={spineRef}
                className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
                style={{ background: BRASS, transformOrigin: "center" }}
                aria-hidden="true"
            />

            {/* Thumbnail */}
            <div className="relative overflow-hidden bg-[#ECEAE4] aspect-[4/3] flex-shrink-0">
                {isVisible && item.thumbnailUrl ? (
                    <Image
                        src={item.thumbnailUrl}
                        alt={item.projectName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                        loading="lazy"
                    />
                ) : (
                    // Skeleton while not yet in viewport
                    <div className="w-full h-full animate-pulse bg-[#DDD9D0]" />
                )}

                {/* Download overlay */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 flex items-end justify-between p-4 opacity-0"
                    style={{ background: "rgba(13,27,42,0.72)" }}
                >
                    <span
                        className="text-xs font-medium tracking-wider uppercase"
                        style={{ color: "#B8892B" }}
                    >
                        {typeLabel}
                    </span>
                    <span className="text-white text-sm font-medium flex items-center gap-1.5">
                        Download
                        {/* Down arrow icon */}
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M6 1v8M2 7l4 4 4-4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </div>
            </div>

            {/* Meta */}
            <div className="p-4 flex flex-col gap-1 flex-1">
                <p
                    className="text-base leading-snug"
                    style={{
                        fontFamily: "var(--font-playfair)",
                        color: "#0D1B2A",
                    }}
                >
                    {item.projectName}
                </p>
                <p className="text-xs capitalize" style={{ color: "#8A8577" }}>
                    {item.category}
                    {item.clientIndustry && (
                        <>
                            <span className="mx-1.5 opacity-40">·</span>
                            {item.clientIndustry}
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}