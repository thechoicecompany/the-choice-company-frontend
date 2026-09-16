import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import CtaBanner from "@/components/sections/home/CtaBanner";
import IndustryDetailAnimated from "@/components/sections/industries/IndustryDetailAnimated";
import { INDUSTRIES } from "@/lib/constants/industries";

export async function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry } = await params;
  const ind = INDUSTRIES.find((i) => i.slug === industry);
  return ind ? { title: ind.metaTitle } : { title: "Not Found" };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry } = await params;
  const ind = INDUSTRIES.find((i) => i.slug === industry);
  if (!ind) notFound();

  return (
    <>
      <PageHero
        title={`Corporate Gifts for ${ind.label}`}
        subtitle={ind.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: ind.label },
        ]}
      />
      <section className="section-py">
        <IndustryDetailAnimated industry={ind} />
      </section>
      <CtaBanner />
    </>
  );
}