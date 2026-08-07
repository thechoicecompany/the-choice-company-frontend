import type { Metadata } from "next";
import PageHero        from "@/components/layout/PageHero";
import CompanyOverview from "@/components/sections/about/CompanyOverview";
import VisionMission   from "@/components/sections/about/VisionMission";
import Infrastructure  from "@/components/sections/about/Infrastructure";
import TeamGrid        from "@/components/sections/about/TeamGrid";
import DeliveryMap     from "@/components/sections/about/DeliveryMap";
export const metadata: Metadata = { title:"About Us", description:"India's trusted corporate gifting partner since 2010." };
export default function AboutPage() {
  return (
    <>
      <PageHero title="About The Choice Company" subtitle="Crafting memorable brand experiences since 2010"
        breadcrumbs={[{label:"Home",href:"/"},{label:"About Us"}]} />
      <CompanyOverview /><VisionMission /><Infrastructure /><TeamGrid /><DeliveryMap />
    </>
  );
}
