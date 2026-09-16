"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CATEGORIES } from "@/lib/constants/categories";

type Industry = {
    slug: string;
    label: string;
    icon: string;
    description: string;
    popularProducts: readonly string[]; // slugs from CATEGORIES
};

function resolveCategory(slug: string) {
    return CATEGORIES.find((c) => c.slug === slug);
}

export default function IndustryDetailAnimated({ industry }: { industry: Industry }) {
    const rootRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.fromTo(
                ".industry-icon",
                { scale: 0.6, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, duration: 0.6 }
            )
                .fromTo(
                    ".industry-product",
                    { y: 16, autoAlpha: 0 },
                    { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.06 },
                    "-=0.25"
                )
                .fromTo(
                    ".industry-cta",
                    { y: 10, autoAlpha: 0 },
                    { y: 0, autoAlpha: 1, duration: 0.4 },
                    "-=0.15"
                );
        }, rootRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={rootRef} className="container-site max-w-4xl mx-auto text-center">
            <div className="industry-icon text-5xl sm:text-6xl mb-6">{industry.icon}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {industry.popularProducts.map((slug) => {
                    const category = resolveCategory(slug);
                    if (!category) return null; // skip silently if a slug drifts out of sync
                    const Icon = category.icon;
                    return (
                        <Link
                            key={slug}
                            href={`/products?category=${category.slug}`}
                            className="industry-product card-flat p-4 text-sm font-medium text-navy hover:border-gold hover:text-gold transition-colors flex flex-col items-center gap-2"
                        >
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${category.color}`}>
                                <Icon className={`w-5 h-5 ${category.iconColor}`} />
                            </span>
                            {category.label}
                        </Link>
                    );
                })}
            </div>
            <Link href="/bulk-orders#inquiry-form" className="industry-cta btn-gold btn-lg">
                Get a Custom Quote for {industry.label} →
            </Link>
        </div>
    );
}