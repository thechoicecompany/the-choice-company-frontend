import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CompanyOverview from "@/components/sections/about/CompanyOverview";
import VisionMission from "@/components/sections/about/VisionMission";
import Infrastructure from "@/components/sections/about/Infrastructure";
import DeliveryMap from "@/components/sections/about/DeliveryMap";
import ClosingStatement from "@/components/sections/about/Closing-Statement";

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
      <CompanyOverview />
      <VisionMission />
      <Infrastructure />
      <DeliveryMap />
      <ClosingStatement />
    </>
  );
}