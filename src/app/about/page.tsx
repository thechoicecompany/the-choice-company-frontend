
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero/PageHero";
import AboutHero from "@/components/sections/about/AboutHero";
import AboutStory from "@/components/sections/about/AboutStory";
import MissionVision from "@/components/sections/about/MissionVision";
import AboutUSPs from "@/components/sections/about/AboutUSPs";
import InfrastructureScale from "@/components/sections/about/InfrastructureScale";
import PanIndiaNetwork from "@/components/sections/about/PanIndiaNetwork";
import AboutCTA from "@/components/sections/about/AboutCTA";

const SITE_URL = "https://thechoicecompany.in"; // replace with your live domain

export const metadata: Metadata = {
  title: "About Us | Corporate Gifting Company in India Since 2025",
  description:
    "The Choice Company designs, sources and delivers corporate gifts and branded merchandise at scale — 500+ corporate relationships, 10M+ units delivered across 28+ states in India.",
  keywords: [
    "corporate gifting company India",
    "bulk corporate gifts",
    "employee gifting solutions",
    "branded merchandise supplier",
    "corporate gift customization",
  ],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About The Choice Company | Corporate Gifting, Built for Scale",
    description:
      "India's corporate gifting partner for Mobility, Telecom, FMCG, Pharma and Manufacturing — from sourcing to pan-India delivery.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "The Choice Company",
      url: SITE_URL,
      description:
        "Corporate gifting and merchandise partner serving businesses across India with sourcing, customization and pan-India delivery.",
      areaServed: { "@type": "Country", name: "India" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About Us", item: `${SITE_URL}/about` },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AboutHero breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <AboutStory />
      <MissionVision />
      <AboutUSPs />
      <InfrastructureScale />
      {/* <DeliveryNetwork /> */}
      <PanIndiaNetwork />
      {/* <TrustedBrands /> */}
      <AboutCTA />
    </>
  );
}