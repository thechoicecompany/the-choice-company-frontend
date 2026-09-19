import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogRequestForm from "@/components/forms/CatalogRequestForm";
import CataloguePageClient from "@/components/catalog/CataloguePageClient";

export const metadata: Metadata = {
    title: "Request Our Catalogue",
    description: "Tell us what you're looking for and we'll get you the full catalogue.",
};

export default function CataloguesPage() {
    return (
        <CataloguePageClient>
            <Suspense fallback={
                <div className="space-y-4 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-white/10 rounded-xl" />
                    ))}
                </div>
            }>
                <CatalogRequestForm />
            </Suspense>
        </CataloguePageClient>
    );
}