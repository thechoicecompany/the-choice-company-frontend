import type { Metadata } from "next";
import HeroBanner from "@/components/sections/home/HeroBanner";
import TrustStrip from "@/components/sections/home/TrustStrip";
import OccasionCarousel from "@/components/sections/home/OccasionCarousel";
import BudgetFilter from "@/components/sections/home/BudgetFilter";
import CategoryGrid from "@/components/sections/home/CategoryGrid";
import FeaturedProducts from "@/components/sections/home/FeaturedProducts";
import IndustriesStrip from "@/components/sections/home/IndustriesStrip";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import ProcessFlow from "@/components/sections/home/ProcessFlow";
import SocialProof from "@/components/sections/home/SocialProof";
import CtaBanner from "@/components/sections/home/CtaBanner";
import SchemaMarkup from "@/components/ui/SchemaMarkup";
import { fetchFeaturedProducts } from "@/lib/api/products";

export const metadata: Metadata = {
  title: "India's Trusted Corporate Gifting Partner",
  description: "Bulk corporate gifts, employee kits & festive hampers. Custom branding. Pan-India delivery.",
  alternates: { canonical: "https://thechoicecompany.in" },
};

export default async function HomePage() {
  const featuredProducts = await fetchFeaturedProducts().catch(() => []);
  return (
    <>
      <SchemaMarkup schema={{ "@context": "https://schema.org", "@type": "Organization", name: "The Choice Company", url: "https://thechoicecompany.in" }} />
      <HeroBanner />
      <TrustStrip />
      <OccasionCarousel />
      <BudgetFilter />
      <CategoryGrid />
      <FeaturedProducts products={featuredProducts} />
      <IndustriesStrip />
      <WhyChooseUs />
      <ProcessFlow />
      <SocialProof />
      <CtaBanner />
    </>
  );
}
