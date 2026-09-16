import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import GalleryGrid from "@/components/sections/gallery/GalleryGrid";
import { fetchGalleryItems } from "@/lib/api/gallery";

export const revalidate = 7200;
export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our corporate gifting projects.",
};

export default async function GalleryPage() {
  const items = await fetchGalleryItems().catch(() => []);

  return (
    <>
      <PageHero
        title="Explore Our Catalogs"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Gallery" },
        ]}
      />
      <section className="section-py">
        <div className="container-site">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {items.length} Catalogue{items.length !== 1 ? "s" : ""}
            </p>
            <Link
              href="/catalog"
              className="btn-navy rounded-xl px-6 py-3 text-sm font-semibold"
            >
              📋 Download Catalogue
            </Link>
          </div>
          <GalleryGrid items={items} />
        </div>
      </section>
    </>
  );
}
