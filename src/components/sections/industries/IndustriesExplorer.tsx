"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants/categories";

type Industry = {
    slug: string;
    label: string;
    icon: string;
    description: string;
    popularProducts?: readonly string[]; // slugs from CATEGORIES
};

function resolveCategory(slug: string) {
    return CATEGORIES.find((c) => c.slug === slug);
}

export default function IndustriesExplorer({ industries }: { industries: readonly Industry[] }) {
    const renderProducts = (products: readonly string[] | undefined, compact = false) => {
        if (!products?.length) return null;
        return (
            <div className={`flex flex-wrap gap-3 ${compact ? "mb-6" : "mb-8"}`}>
                {products.map((slug) => {
                    const category = resolveCategory(slug);
                    if (!category) return null;
                    return (
                        <Link
                            key={slug}
                            href={`/products?category=${category.slug}`}
                            className="card-flat flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-navy hover:border-gold hover:text-gold transition-colors"
                        >
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full overflow-hidden ${category.color}`}>
                                <img
                                    src={category.image}
                                    alt={category.label}
                                    className="w-full h-full object-cover"
                                />
                            </span>
                            {category.label}
                        </Link>
                    );
                })}
            </div>
        );
    };
    /* ---------- Desktop: hover/focus-driven list + side panel (md and up) ---------- */
    const [activeSlug, setActiveSlug] = useState(industries[0]?.slug);
    const active = industries.find((i) => i.slug === activeSlug) ?? industries[0];

    const listRef = useRef<HTMLUListElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!listRef.current || !barRef.current) return;
        const el = listRef.current.querySelector<HTMLElement>(`[data-slug="${activeSlug}"]`);
        if (!el) return;
        gsap.to(barRef.current, {
            y: el.offsetTop,
            height: el.offsetHeight,
            duration: 0.45,
            ease: "power3.out",
        });
    }, [activeSlug]);

    useEffect(() => {
        if (!panelRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                panelRef.current,
                { autoAlpha: 0, y: 12 },
                { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
            gsap.fromTo(
                iconRef.current,
                { scale: 0.85, rotate: -4 },
                { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" }
            );
        });
        return () => ctx.revert();
    }, [activeSlug]);

    /* ---------- Mobile: tap-to-expand accordion (below md) ---------- */
    const [openSlug, setOpenSlug] = useState<string | null>(null);
    const panelsRef = useRef<Record<string, HTMLDivElement | null>>({});

    // Collapse every panel before paint so nothing flashes open on load
    useLayoutEffect(() => {
        Object.values(panelsRef.current).forEach((el) => {
            if (el) gsap.set(el, { height: 0, autoAlpha: 0 });
        });
    }, []);

    useEffect(() => {
        Object.entries(panelsRef.current).forEach(([slug, el]) => {
            if (!el) return;
            const isOpen = slug === openSlug;
            gsap.to(el, {
                height: isOpen ? "auto" : 0,
                autoAlpha: isOpen ? 1 : 0,
                duration: 0.35,
                ease: "power2.out",
            });
        });
    }, [openSlug]);

    if (!active) return null;

    return (
        <>
            {/* ---------- Mobile accordion ---------- */}
            <div className="md:hidden">
                <ul>
                    {industries.map((ind) => {
                        const isOpen = openSlug === ind.slug;
                        return (
                            <li key={ind.slug} className="border-b border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setOpenSlug(isOpen ? null : ind.slug)}
                                    aria-expanded={isOpen}
                                    className="w-full flex items-center justify-between gap-3 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="text-2xl">{ind.icon}</span>
                                        <span className="font-semibold text-navy">{ind.label}</span>
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 shrink-0 transition-transform ${isOpen ? "rotate-180 text-gold" : "text-gray-400"
                                            }`}
                                    />
                                </button>
                                <div
                                    ref={(el) => {
                                        panelsRef.current[ind.slug] = el;
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-6 pt-1">
                                        <p className="text-gray-600 text-sm mb-5">{ind.description}</p>
                                        {renderProducts(ind.popularProducts, true)}
                                        <Link href={`/industries/${ind.slug}`} className="btn-gold w-full text-center block">
                                            Explore {ind.label} Gifts
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* ---------- Desktop: hover list + side panel ---------- */}
            <div className="hidden md:grid grid-cols-[minmax(0,340px)_1fr] gap-12">
                <div className="relative">
                    <div
                        ref={barRef}
                        className="absolute left-0 w-[3px] bg-gold rounded-full"
                        style={{ height: 0, top: 0 }}
                        aria-hidden
                    />
                    <ul ref={listRef} className="pl-6">
                        {industries.map((ind) => (
                            <li key={ind.slug} data-slug={ind.slug}>
                                <button
                                    type="button"
                                    onMouseEnter={() => setActiveSlug(ind.slug)}
                                    onFocus={() => setActiveSlug(ind.slug)}
                                    onClick={() => setActiveSlug(ind.slug)}
                                    className={`w-full text-left py-4 border-b border-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm ${activeSlug === ind.slug ? "text-navy" : "text-gray-400 hover:text-navy"
                                        }`}
                                >
                                    <span className="text-lg font-semibold">{ind.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div ref={panelRef} className="card p-10">
                    <div ref={iconRef} className="text-6xl mb-6">
                        {active.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-navy mb-3">{active.label}</h3>
                    <p className="text-gray-600 mb-8 max-w-lg">{active.description}</p>
                    {renderProducts(active.popularProducts)}
                    <Link href={`/industries/${active.slug}`} className="btn-gold">
                        Explore {active.label} Gifts
                    </Link>
                </div>
            </div>
        </>
    );
}