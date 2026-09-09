import HeroBannerClient from "./HeroBannerClient";
import type { HeroBanner } from "@/lib/types/heroBanner.types";

async function fetchBanners(): Promise<HeroBanner[]> {
    const API = process.env.NEXT_PUBLIC_API_URL;
    if (!API) return [];

    try {
        const res = await fetch(`${API}/api/hero-banners`, {
            // Revalidate every 5 minutes — banners don't change often.
            // Admin publishes → stale for up to 5 min → fine for a banner.
            next: { revalidate: 300 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

export default async function HeroBannerServer() {
    const banners = await fetchBanners();

    // No banners — render nothing (no layout shift, no broken image)
    if (banners.length === 0) return null;

    return <HeroBannerClient initialBanners={banners} />;
}