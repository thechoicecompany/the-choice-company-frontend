import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CtaBanner from "@/components/sections/home/CtaBanner";
import IndustriesExplorer from "@/components/sections/industries/IndustriesExplorer";
import { INDUSTRIES } from "@/lib/constants/industries";

export const metadata: Metadata = {
  title: "Industry Solutions",
  description: "Corporate gifting for every business sector.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        title="Industries We Serve"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
      />
      <section className="section-py">
        <div className="container-site">
          <IndustriesExplorer industries={INDUSTRIES} />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}