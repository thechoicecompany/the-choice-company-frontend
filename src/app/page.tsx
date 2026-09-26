import type { Metadata } from "next";
import HeroBannerServer from "@/components/hero-banner/HeroBannerServer";
import CategoryGrid from "@/components/sections/home/CategoryGrid";
import FeaturedProductsAnimated from "@/components/sections/home/FeaturedProducts";
import IndustriesStrip from "@/components/sections/home/IndustriesStrip";
import WhyChooseUsAnimated from "@/components/sections/home/WhyChooseUs";
import ProcessFlowAnimated from "@/components/sections/home/ProcessFlow";
import SocialProofAnimated from "@/components/sections/home/SocialProof";
import SchemaMarkup from "@/components/ui/SchemaMarkup";
import ScrollRevealWrapper from "@/components/ui/ScrollRevealWrapper";
import { fetchFeaturedProducts } from "@/lib/api/products";

export const metadata: Metadata = {
  title: "India's Trusted Corporate Gifting Partner",
  description:
    "Bulk corporate gifts,employee kits & festive hampers. Custom branding. Pan-India delivery.",
  alternates: { canonical: "https://thechoicecompany.in" },
};

export default async function HomePage() {
  const featuredProducts = await fetchFeaturedProducts().catch(() => []);

  return (
    <>
      <SchemaMarkup
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "The Choice Company",
          url: "https://thechoicecompany.in",
        }}
      />

      {/* Hero — above the fold, no scroll trigger needed */}
      <HeroBannerServer />

      {/* Category grid */}
      <ScrollRevealWrapper variant="fadeUp" threshold={0.1}>
        <CategoryGrid />
      </ScrollRevealWrapper>

      {/* Featured products — has its own internal GSAP */}
      <FeaturedProductsAnimated products={featuredProducts} />

      {/* Industries strip */}
      <ScrollRevealWrapper variant="staggerChildren" childSelector="a" stagger={0.06}>
        <IndustriesStrip />
      </ScrollRevealWrapper>

      {/* Why Choose Us — internal GSAP stagger */}
      <WhyChooseUsAnimated />

      {/* Process Flow — internal GSAP */}
      <ProcessFlowAnimated />

      {/* Social Proof — internal GSAP counters + stagger */}
      {/* <SocialProofAnimated /> */}

    </>
  );
}