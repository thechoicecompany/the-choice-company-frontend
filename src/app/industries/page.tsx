import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero/PageHero";
import IndustriesExplorer from "@/components/sections/industries/IndustriesExplorer";
import { INDUSTRIES } from "@/lib/constants/industries";
import { heroPresets } from "@/components/ui/PageHero/heroPresets";

export const metadata: Metadata = {
  title: "Industry Solutions",
  description: "Corporate gifting for every business sector.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero {...heroPresets.industries} />
      <section className="section-py">
        <div className="container-site">
          <IndustriesExplorer industries={INDUSTRIES} />
        </div>
      </section>

    </>
  );
}