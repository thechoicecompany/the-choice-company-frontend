import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogRequestForm from "@/components/forms/CatalogRequestForm";

export const metadata: Metadata = {
    title: "Request Our Catalogue",
    description: "Tell us what you're looking for and we'll get you the full catalogue.",
};

export default function CataloguesPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <section className="bg-navy text-white">
                <div className="max-w-3xl mx-auto px-6 py-14 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                        Get Our Full Catalogue
                    </h1>
                    <p className="mt-3 text-white/70 max-w-xl mx-auto">
                        A few details about what you need, and you'll be able to download right after.
                    </p>
                </div>
            </section>

            <section className="max-w-3xl mx-auto px-6 py-14">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                    <Suspense fallback={<div className="animate-pulse text-gray-400 text-center py-8">Loading form...</div>}>
                        <CatalogRequestForm />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}