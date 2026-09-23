"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface Props {
    images: string[];
    productName: string;
    productSlug: string;
    href?: string;
    counterPosition?: "top-left" | "bottom-right";
}

export default function ImageCarousel({
    images,
    productName,
    productSlug,
    href,
    counterPosition = "bottom-right",
}: Props) {
    const [current, setCurrent] = useState(0);
    const total = images.length;
    const linkHref = href ?? `/products/${productSlug}`;

    const prev = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrent((i) => (i - 1 + total) % total);
        },
        [total]
    );

    const next = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrent((i) => (i + 1) % total);
        },
        [total]
    );

    const goTo = useCallback((e: React.MouseEvent, idx: number) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrent(idx);
    }, []);

    if (total === 0) {
        return (
            <Link
                href={linkHref}
                className="relative flex aspect-[4/3] items-center justify-center bg-white text-4xl"
            >
                🎁
            </Link>
        );
    }

    return (
        <Link
            href={linkHref}
            className="block relative aspect-[4/3] bg-white overflow-hidden group"
        >
            {images.map((src, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-400 ${idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <Image
                        src={src}
                        alt={`${productName} — image ${idx + 1}`}
                        fill
                        className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                        priority={idx === 0}
                    />
                    {/* Soft vignette — blends white image edges into section background */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            boxShadow: "inset 0 0 28px 10px rgba(247,243,238,0.6)",
                        }}
                    />
                </div>
            ))}

            {total > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="Previous image"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/85 hover:bg-white shadow-sm flex items-center justify-center text-[#10233f] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <CaretLeft size={14} weight="bold" />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next image"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/85 hover:bg-white shadow-sm flex items-center justify-center text-[#10233f] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <CaretRight size={14} weight="bold" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/15">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => goTo(e, idx)}
                                aria-label={`Image ${idx + 1}`}
                                className={`rounded-full transition-all duration-200 ${idx === current
                                        ? "w-4 h-1.5 bg-white"
                                        : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Counter */}
                    <div
                        className={`absolute z-10 bg-black/40 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${counterPosition === "bottom-right"
                                ? "bottom-2 right-2"
                                : "top-3 left-3"
                            }`}
                    >
                        {current + 1} / {total}
                    </div>
                </>
            )}
        </Link>
    );
}