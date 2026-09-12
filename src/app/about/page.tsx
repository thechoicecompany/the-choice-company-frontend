import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import VisionMission from "@/components/sections/about/VisionMission";
import Infrastructure from "@/components/sections/about/Infrastructure";
import DeliveryMap from "@/components/sections/about/DeliveryMap";
import ClosingStatement from "@/components/sections/about/Closing-Statement";
import ScrollRevealWrapper from "@/components/ui/ScrollRevealWrapper";
import CompanyOverviewAnimated from "@/components/sections/about/CompanyOverview";
export const metadata: Metadata = {
  title: "About Us",
  description: "India's trusted corporate gifting partner since 2010.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About The Choice Company"
        subtitle="Corporate gifting, built for scale"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Animated overview with number tickers */}
      <CompanyOverviewAnimated />

      <ScrollRevealWrapper variant="fadeUp" threshold={0.1}>
        <VisionMission />
      </ScrollRevealWrapper>

      <ScrollRevealWrapper variant="staggerChildren" childSelector=".border-l-2" stagger={0.08}>
        <Infrastructure />
      </ScrollRevealWrapper>

      <ScrollRevealWrapper variant="fadeLeft" threshold={0.1}>
        <DeliveryMap />
      </ScrollRevealWrapper>

      <ScrollRevealWrapper variant="scaleUp" threshold={0.15}>
        <ClosingStatement />
      </ScrollRevealWrapper>
    </>
  );
}