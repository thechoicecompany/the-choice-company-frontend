import type { Metadata } from "next";
import PageHero    from "@/components/layout/PageHero";
import GalleryGrid from "@/components/sections/gallery/GalleryGrid";
import { fetchGalleryItems } from "@/lib/api/gallery";
export const revalidate = 7200;
export const metadata: Metadata = { title:"Gallery", description:"Browse our corporate gifting projects." };
export default async function GalleryPage() {
  const items = await fetchGalleryItems().catch(()=>[]);
  return (<><PageHero title="Our Work Gallery" breadcrumbs={[{label:"Home",href:"/"},{label:"Gallery"}]} />
    <section className="section-py"><div className="container-site"><GalleryGrid items={items} /></div></section></>);
}
