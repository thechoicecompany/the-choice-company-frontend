import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link     from "next/link";
import PageHero from "@/components/layout/PageHero";
import CtaBanner from "@/components/sections/home/CtaBanner";
import { INDUSTRIES } from "@/lib/constants/industries";
export async function generateStaticParams() { return INDUSTRIES.map(i=>({industry:i.slug})); }
export async function generateMetadata({params}:{params:Promise<{industry:string}>}): Promise<Metadata> {
  const {industry} = await params;
  const ind = INDUSTRIES.find(i=>i.slug===industry);
  return ind ? {title:ind.metaTitle} : {title:"Not Found"};
}
export default async function IndustryPage({params}:{params:Promise<{industry:string}>}) {
  const {industry} = await params;
  const ind = INDUSTRIES.find(i=>i.slug===industry);
  if (!ind) notFound();
  return (<><PageHero title={`Corporate Gifts for ${ind.label}`} subtitle={ind.description}
    breadcrumbs={[{label:"Home",href:"/"},{label:"Industries",href:"/industries"},{label:ind.label}]} />
    <section className="section-py"><div className="container-site max-w-4xl mx-auto text-center">
      <div className="text-6xl mb-6">{ind.icon}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {ind.popularProducts.map(p=>(
          <Link key={p} href={`/products?category=${p.toLowerCase().replace(/\s/g,"-")}`}
            className="card-flat p-4 text-sm font-medium text-navy hover:border-gold hover:text-gold transition-colors">{p}</Link>
        ))}
      </div>
      <Link href="/bulk-orders#inquiry-form" className="btn-gold btn-lg">Get a Custom Quote for {ind.label} →</Link>
    </div></section><CtaBanner /></>);
}
